import prisma from "@/lib/db";
import { Locale } from "@/lib/i18n";
import { Prisma } from "@prisma/client";

export const blogPostInclude = (locale: Locale) =>
  Prisma.validator<Prisma.BlogPostInclude>()({
    translations: { where: { locale } },
  });

export type BlogPostWithLocale = Prisma.BlogPostGetPayload<{
  include: ReturnType<typeof blogPostInclude>;
}>;

export type BlogPostItem = {
  id: string;
  slug: string;
  coverImage: string | null;
  tag: string | null;
  readingTime: number | null;
  isTrending: boolean;
  publishedAt: Date | null;
  title: string;
  excerpt: string | null;
  sourceType: "ORIGINAL" | "RSS";
  sourceUrl: string | null;
  sourceAuthor: string | null;
  sourceSiteName: string | null;
};

export type BlogPostDetail = BlogPostItem & { body: string };

export function mapBlogPost(post: BlogPostWithLocale): BlogPostItem {
  const t = post.translations[0];
  return {
    id: post.id,
    slug: post.slug,
    coverImage: post.coverImage,
    tag: t?.tag ?? null,
    readingTime: post.readingTime,
    isTrending: post.isTrending,
    publishedAt: post.publishedAt,
    title: t?.title ?? post.slug,
    excerpt: t?.excerpt ?? null,
    sourceType: post.sourceType,
    sourceUrl: post.sourceUrl ?? null,
    sourceAuthor: post.sourceAuthor ?? null,
    sourceSiteName: post.sourceSiteName ?? null,
  };
}

export function mapBlogPostDetail(post: BlogPostWithLocale): BlogPostDetail {
  return {
    ...mapBlogPost(post),
    body: post.translations[0]?.body ?? "",
  };
}

export async function getPublishedPosts(locale: Locale, take = 50) {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true, publishedAt: { lte: new Date() } },
    include: blogPostInclude(locale),
    orderBy: { publishedAt: "desc" },
    take,
  });
  return posts.map(mapBlogPost);
}

export async function getPostBySlug(locale: Locale, slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: blogPostInclude(locale),
  });
  if (!post || !post.isPublished || !post.publishedAt || post.publishedAt > new Date()) return null;
  return mapBlogPostDetail(post);
}

export async function getRelatedPosts(locale: Locale, slug: string, take = 3) {
  const current = await prisma.blogPost.findUnique({ where: { slug } });
  if (!current) return [];
  const related = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      publishedAt: { lte: new Date() },
      slug: { not: slug },
      ...(current.category ? { category: current.category } : {}),
    },
    include: blogPostInclude(locale),
    orderBy: { publishedAt: "desc" },
    take,
  });
  const pool = related.length >= take
    ? related
    : await prisma.blogPost.findMany({
        where: {
          isPublished: true,
          publishedAt: { lte: new Date() },
          slug: { not: slug },
        },
        include: blogPostInclude(locale),
        orderBy: { publishedAt: "desc" },
        take,
      });
  const merged = [...related, ...pool].filter(
    (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i,
  );
  return merged.slice(0, take).map(mapBlogPost);
}

export async function publishNextBankPost() {
  const next = await prisma.blogPost.findFirst({
    where: { isPublished: false },
    orderBy: { createdAt: "asc" },
  });
  if (!next) return null;
  const [, post] = await prisma.$transaction([
    prisma.blogPost.updateMany({
      where: { isTrending: true },
      data: { isTrending: false },
    }),
    prisma.blogPost.update({
      where: { id: next.id },
      data: {
        isPublished: true,
        isTrending: true,
        publishedAt: new Date(),
      },
    }),
  ]);
  return post;
}
