import { randomBytes } from "crypto";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/seo";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type SubscribeResult = {
  status: "subscribed" | "already" | "invalid" | "error";
};

export async function subscribeEmail(
  rawEmail: string,
  locale = "fa",
  userId?: string | null,
): Promise<SubscribeResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return { status: "invalid" };
  }

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
      select: { id: true },
    });

    // Any email that has ever subscribed is considered taken.
    if (existing) {
      return { status: "already" };
    }

    const token = randomBytes(24).toString("hex");

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        locale,
        userId: userId ?? null,
        unsubscribeToken: token,
      },
    });
    return { status: "subscribed" };
  } catch (err) {
    console.error("[newsletter] subscribe failed", err);
    return { status: "error" };
  }
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  try {
    const res = await prisma.newsletterSubscriber.updateMany({
      where: { unsubscribeToken: token },
      data: { isActive: false },
    });
    return res.count > 0;
  } catch (err) {
    console.error("[newsletter] unsubscribe failed", err);
    return false;
  }
}

function buildPostHtml(params: {
  dir: string;
  brand: string;
  heading: string;
  title: string;
  excerpt: string;
  cta: string;
  url: string;
  unsubscribeLabel: string;
  unsubscribeUrl: string;
}): string {
  const { dir, brand, heading, title, excerpt, cta, url, unsubscribeLabel, unsubscribeUrl } =
    params;
  return `<!doctype html><html dir="${dir}"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f4f7fc;font-family:Tahoma,Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:28px">
    <div style="background:#fff;border-radius:18px;padding:30px 26px;box-shadow:0 12px 36px rgba(20,45,90,.10)">
      <div style="font-size:20px;font-weight:900;color:#3454D1">${brand}</div>
      <p style="margin:16px 0 4px;font-size:13px;font-weight:700;color:#53647C">${heading}</p>
      <h2 style="margin:8px 0 10px;font-size:20px;font-weight:900;color:#0D1633;line-height:1.6">${title}</h2>
      ${excerpt ? `<p style="margin:0 0 20px;font-size:14px;color:#53647C;line-height:1.9">${excerpt}</p>` : ""}
      <a href="${url}" style="display:inline-block;background:#3454D1;color:#fff;text-decoration:none;font-weight:900;font-size:14px;padding:11px 22px;border-radius:12px">${cta}</a>
    </div>
    <p style="text-align:center;margin:18px 0 0;font-size:12px;color:#94a3b8">
      <a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline">${unsubscribeLabel}</a>
    </p>
  </div>
</body></html>`;
}

/**
 * Send the new article to all active newsletter subscribers.
 * Uses BlogPost.newsletterNotifiedAt as a dedupe marker so each post is announced once.
 * Safe to call fire-and-forget after publishing; never throws.
 */
export async function notifySubscribersOfNewPost(postId: string): Promise<void> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: {
        slug: true,
        isPublished: true,
        newsletterNotifiedAt: true,
        translations: { select: { locale: true, title: true, excerpt: true } },
      },
    });
    if (!post || !post.isPublished || post.newsletterNotifiedAt) return;

    // Mark first so a crash mid-send never causes duplicate blasts.
    await prisma.blogPost.update({
      where: { id: postId },
      data: { newsletterNotifiedAt: new Date() },
    });

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true, locale: true, unsubscribeToken: true },
    });
    if (subscribers.length === 0) return;

    const dirFor = (locale: string) => (locale === "fa" || locale === "ar" ? "rtl" : "ltr");
    const labels = {
      fa: { brand: "فیگرفورج", heading: "مقاله جدید در وبلاگ فیگرفورج", cta: "خواندن مقاله", unsub: "لغو اشتراک خبرنامه" },
      en: { brand: "FigureForge", heading: "New article on the FigureForge blog", cta: "Read the article", unsub: "Unsubscribe from the newsletter" },
      ar: { brand: "FigureForge", heading: "مقال جديد في مدونة FigureForge", cta: "اقرأ المقال", unsub: "إلغاء الاشتراك في النشرة البريدية" },
    };

    let sent = 0;
    for (const sub of subscribers) {
      const t =
        post.translations.find((x) => x.locale === sub.locale) ??
        post.translations[0];
      if (!t) continue;
      const l = labels[sub.locale as keyof typeof labels] ?? labels.fa;
      const url = `${SITE_URL}/${sub.locale}/blog/${post.slug}`;
      const unsubUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken}`;
      try {
        await sendEmail(
          sub.email,
          `${l.heading}: ${t.title}`,
          `${t.title}\n\n${url}`,
          buildPostHtml({
            dir: dirFor(sub.locale),
            brand: l.brand,
            heading: l.heading,
            title: t.title,
            excerpt: t.excerpt ?? "",
            cta: l.cta,
            url,
            unsubscribeLabel: l.unsub,
            unsubscribeUrl: unsubUrl,
          }),
        );
        sent++;
      } catch (err) {
        console.error(`[newsletter] send to ${sub.email} failed`, err);
      }
    }
    console.log(`[newsletter] notified ${sent}/${subscribers.length} subscribers for ${post.slug}`);
  } catch (err) {
    console.error("[newsletter] notify failed", err);
  }
}
