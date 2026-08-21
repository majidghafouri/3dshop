import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LABELS = {
  en: { label: "Source", article: "Original Article" },
  fa: { label: "منبع", article: "مقاله اصلی" },
  ar: { label: "المصدر", article: "المقال الأصلي" },
};

// Matches a trailing source-reference block (correct or malformed)
const REF_RE = /\n*---\n+> 🌐 \*\*[^*\n]+\*\*:?\s*\[[^\]]*\]\([^)]*\)\s*$/;

function buildReference(sourceUrl, siteName, locale) {
  const t = LABELS[locale] || LABELS.en;
  return `\n\n---\n\n> 🌐 **${t.label}:** [${siteName} — ${t.article}](${sourceUrl})`;
}

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: { sourceType: "RSS", sourceUrl: { not: null } },
    select: {
      slug: true,
      sourceUrl: true,
      sourceSiteName: true,
      sourceAuthor: true,
      translations: { select: { id: true, locale: true, body: true } },
    },
  });

  let fixed = 0;
  let clean = 0;

  for (const post of posts) {
    const siteName = post.sourceSiteName || post.sourceAuthor || "Source";
    for (const tr of post.translations) {
      const expected = buildReference(post.sourceUrl, siteName, tr.locale);
      const stripped = tr.body.replace(REF_RE, "");
      if (stripped + expected === tr.body) {
        clean++;
        continue;
      }
      await prisma.blogPostTranslation.update({
        where: { id: tr.id },
        data: { body: stripped + expected },
      });
      fixed++;
    }
  }

  console.log(`Checked ${posts.length} web articles: ${fixed} translation(s) fixed, ${clean} already correct.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
