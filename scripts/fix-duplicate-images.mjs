import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const norm = (url) => {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return String(url).toLowerCase();
  }
};

async function getOgImage(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FigureForgeBot/1.0)" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m =
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (!m) return null;
    return new URL(m[1], pageUrl).href;
  } catch {
    return null;
  }
}

const IMG_LINE = /^!\[[^\]]*\]\(([^)\s]+)\)\s*$/;

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: { sourceType: "RSS" },
    select: {
      id: true,
      slug: true,
      sourceUrl: true,
      coverImage: true,
      translations: { select: { id: true, locale: true, body: true } },
    },
  });

  let fixedTranslations = 0;

  for (const post of posts) {
    const ogNorm = norm((await getOgImage(post.sourceUrl)) ?? "");
    const targets = new Set(ogNorm ? [ogNorm] : []);

    if (targets.size === 0 && post.coverImage) {
      // Fallback: if the body contains exactly one unique image, it is the
      // og:image the cover was downloaded from.
      const uniqueImgs = [
        ...new Set(
          post.translations
            .flatMap((t) => t.body.split("\n"))
            .map((l) => l.trim().match(IMG_LINE)?.[1])
            .filter(Boolean)
            .map(norm),
        ),
      ];
      if (uniqueImgs.length === 1) targets.add(uniqueImgs[0]);
    }

    if (targets.size === 0) continue;

    for (const t of post.translations) {
      const cleaned = t.body
        .split("\n")
        .filter((line) => {
          const m = line.trim().match(IMG_LINE);
          return !(m && targets.has(norm(m[1])));
        })
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      if (cleaned !== t.body.trim()) {
        await prisma.blogPostTranslation.update({ where: { id: t.id }, data: { body: cleaned } });
        fixedTranslations += 1;
        console.log(`fixed ${post.slug} [${t.locale}]`);
      }
    }
  }

  console.log(`done — ${fixedTranslations} translation(s) updated`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
