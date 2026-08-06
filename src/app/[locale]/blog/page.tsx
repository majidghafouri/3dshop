import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale, localePrefix, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import Reveal from "@/components/Reveal";

const POSTS = [
  { icon: "🏯", title: "راهنمای خرید فیگور انیمه؛ از کجا شروع کنیم؟", tag: "راهنما" },
  { icon: "🦸", title: "معرفی ۱۰ فیگور برتر مارول برای کلکسیونرها", tag: "معرفی" },
  { icon: "📦", title: "چگونه فیگورها را سالم تحویل بگیریم؟", tag: "راهنما" },
  { icon: "🎬", title: "فیگورهای سینمایی که کلکسیون را خاص می‌کنند", tag: "معرفی" },
  { icon: "🧩", title: "برندهای معتبر سازنده فیگور را بشناسید", tag: "دانستنی‌ها" },
  { icon: "💡", title: "قفسه‌بندی و نمایش کلکسیون؛ ایده‌هایی برای دیوراما", tag: "ایده" },
];

export default async function BlogPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const prefix = localePrefix(locale);

  return (
    <div className="relative overflow-hidden py-[40px] max-sm:py-[28px]"
      style={{
        background:
          "radial-gradient(circle_at_12%_8%,rgba(21,200,184,0.10),transparent_30%), linear-gradient(180deg,var(--bg),var(--bg-grad))",
      }}
    >
      <div className="container-page">
        <div className="text-center">
          <span className="inline-block bg-[var(--soft)] text-[var(--primary)] border border-[var(--line-4)] rounded-full px-4 py-1.5 text-[12px] font-[950]">
            {dict.blog.kicker}
          </span>
          <h1 className="mt-4 text-[clamp(28px,4vw,44px)] font-[1000] text-[var(--text)]">{dict.blog.title}</h1>
          <p className="mt-2 text-[14px] font-[750] text-[var(--muted)]">{dict.blog.subtitle}</p>
        </div>

        <Reveal>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POSTS.map((post, i) => (
              <article
                key={i}
                className="group bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 hover:shadow-[0_18px_48px_rgba(20,45,90,0.10)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="w-[64px] h-[64px] rounded-[18px] flex items-center justify-center text-[30px] product-img-bg border border-[var(--soft-line)]">
                  {post.icon}
                </div>
                <span className="mt-4 inline-block bg-[var(--soft)] text-[var(--primary)] rounded-full px-3 py-1 text-[11px] font-[950]">
                  {post.tag}
                </span>
                <h3 className="mt-3 text-[16.5px] leading-[1.7] font-[1000] text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                  {post.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-[950] text-[var(--primary)]">
                  {dict.blog.readMore}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="rtl:rotate-180"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                </span>
              </article>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 text-center">
          <Link
            href={`${prefix}/products`}
            className="inline-flex rounded-[16px] text-white font-[950] px-8 py-4 text-[15px] shadow-[0_14px_34px_rgba(52,84,209,0.25)] hover:-translate-y-0.5 transition-all duration-300"
            style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
          >
            {dict.cta.button}
          </Link>
        </div>
      </div>
    </div>
  );
}
