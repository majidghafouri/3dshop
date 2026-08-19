import prisma from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import { formatPrice } from "@/lib/i18n";
import { Prisma } from "@prisma/client";

type ProductWithTranslations = Prisma.ProductGetPayload<{
  include: { translations: { where: { locale: "fa" } } };
}>;

type BlogPostWithTranslations = Prisma.BlogPostGetPayload<{
  include: { translations: { where: { locale: "fa" } } };
}>;

export type PostContent = {
  type: "product" | "blog" | "web_article";
  text: string;
  image?: string;
  url?: string;
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const WEB_SEARCH_QUERIES = [
  "anime figure collecting 2026 tips",
  "3D printing resin figures tutorial",
  "best anime figures releases 2026",
  "3D printed figurines techniques",
  "anime figure care maintenance guide",
  "3D printing hobby trends 2026",
  "nendoroid scale figure comparison guide",
  "resin vs FDM printing figures quality",
  "anime figure photography tips",
  "3D print post processing painting figures",
  "figure collecting investment value",
  "garage kit assembly beginner guide",
];

async function getRandomProducts(count: number) {
  const products = await prisma.product.findMany({
    where: { isActive: true, images: { isEmpty: false } },
    include: { translations: { where: { locale: "fa" } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return shuffleArray(products).slice(0, count);
}

async function getRecentBlogPosts(count: number) {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    include: { translations: { where: { locale: "fa" } } },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
  return shuffleArray(posts).slice(0, count);
}

function buildProductPost(product: ProductWithTranslations): PostContent {
  const tr = product.translations[0];
  const name = tr?.name || "محصول";
  const desc = tr?.shortDescription || "";
  const price = formatPrice(product.price, "fa");
  const rawImage = product.images[0];
  const imageUrl = rawImage ? (rawImage.startsWith("http") ? rawImage : `${SITE_URL}${rawImage}`) : undefined;
  const productUrl = `${SITE_URL}/products/${product.slug}`;

  const text = [
    `🛍️ <b>${name}</b>`,
    "",
    desc ? `${desc.slice(0, 200)}${desc.length > 200 ? "..." : ""}` : "",
    "",
    `💰 ${price}`,
    product.compareAtPrice ? `~~${formatPrice(product.compareAtPrice, "fa")}~~` : "",
    product.material ? `📐 ${product.material}` : "",
    "",
    `🔗 <a href="${productUrl}">مشاهده در سایت</a>`,
    "",
    "#فیگور #انیمه #فیگرفورج",
  ]
    .filter(Boolean)
    .join("\n");

  return { type: "product", text, image: imageUrl, url: productUrl };
}

function buildBlogPost(post: BlogPostWithTranslations): PostContent {
  const tr = post.translations[0];
  const title = tr?.title || "مقاله جدید";
  const excerpt = tr?.excerpt || "";
  const blogUrl = `${SITE_URL}/blog/${post.slug}`;
  const rawImage = post.coverImage;
  const coverImage = rawImage ? (rawImage.startsWith("http") ? rawImage : `${SITE_URL}${rawImage}`) : undefined;

  const text = [
    `📝 <b>${title}</b>`,
    "",
    excerpt ? excerpt.slice(0, 250) + (excerpt.length > 250 ? "..." : "") : "",
    "",
    `📖 ${post.readingTime || 5} دقیقه مطالعه`,
    "",
    `🔗 <a href="${blogUrl}">مطالعه کامل</a>`,
    "",
    "#بلاگ #چاپ_سه_بعدی #فیگرفورج",
  ]
    .filter(Boolean)
    .join("\n");

  return { type: "blog", text, image: coverImage, url: blogUrl };
}

function buildWebArticlePost(article: {
  title: string;
  snippet: string;
  url: string;
  image?: string;
}): PostContent {
  const text = [
    `🌐 <b>${article.title}</b>`,
    "",
    article.snippet.slice(0, 250) + (article.snippet.length > 250 ? "..." : ""),
    "",
    `🔗 <a href="${article.url}">مشاهده منبع</a>`,
    "",
    "#چاپ_سه_بعدی #فیگور #دانش",
  ]
    .filter(Boolean)
    .join("\n");

  return { type: "web_article", text, image: article.image, url: article.url };
}

export async function searchWebArticle(): Promise<PostContent | null> {
  const query = pickRandom(WEB_SEARCH_QUERIES);

  try {
    const API_KEY = process.env.SERPAPI_KEY || process.env.SERP_API_KEY;
    const res = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&num=5&hl=en&api_key=${API_KEY || ""}`,
    );

    if (!res.ok) {
      return buildFallbackWebPost(query);
    }

    const data = await res.json();
    const results: Array<{
      title?: string;
      snippet?: string;
      link?: string;
      thumbnail?: string;
    }> = data.organic_results || [];

    const good = results.find((r) => r.title && r.snippet && r.link);
    if (!good) return buildFallbackWebPost(query);

    return buildWebArticlePost({
      title: good.title!,
      snippet: good.snippet!,
      url: good.link!,
      image: good.thumbnail,
    });
  } catch {
    return buildFallbackWebPost(query);
  }
}

function buildFallbackWebPost(query: string): PostContent {
  const tips: Record<string, { text: string; url: string }> = {
    "anime figure collecting 2026 tips": {
      text: "collecting anime figures in 2026 — what to look for when building your collection",
      url: "https://myfigurecollection.net",
    },
    "3D printing resin figures tutorial": {
      text: "a complete guide to 3D printing anime figures with resin printers — from slicing to finishing",
      url: "https://www.all3dp.com/2/resin-3d-printing/",
    },
    "best anime figures releases 2026": {
      text: "the most anticipated anime figure releases of 2026 — check what's coming to stores",
      url: "https://www.amiami.com",
    },
    "3D printed figurines techniques": {
      text: "advanced techniques for 3D printed figurines — supports, orientation, and post-processing",
      url: "https://all3dp.com",
    },
    "anime figure care maintenance guide": {
      text: "how to clean, store, and maintain your anime figures to keep them in perfect condition",
      url: "https://www.otakuusamagazine.com",
    },
    "3D printing hobby trends 2026": {
      text: "the latest trends in the 3D printing hobby space for 2026 — new resins, printers, and techniques",
      url: "https://3dprint.com",
    },
    "nendoroid scale figure comparison guide": {
      text: "understanding figure scales — Nendoroid, Figma, S.H.Figuarts, and 1/7 scale explained",
      url: "https://myfigurecollection.net",
    },
    "resin vs FDM printing figures quality": {
      text: "resin vs FDM: which printer gives better quality for anime figures? a detailed comparison",
      url: "https://www.tomshardware.com",
    },
    "anime figure photography tips": {
      text: "tips and tricks for photographing your anime figure collection — lighting, angles, and backgrounds",
      url: "https://www.reddit.com/r/AnimeFigures/",
    },
    "3D print post processing painting figures": {
      text: "master the art of post-processing 3D printed figures — sanding, priming, and painting techniques",
      url: "https://www.instructables.com",
    },
    "figure collecting investment value": {
      text: "are anime figures a good investment? looking at resale values and rare figure markets",
      url: "https://myfigurecollection.net",
    },
    "garage kit assembly beginner guide": {
      text: "getting started with garage kits — tools, paints, and assembly tips for beginners",
      url: "https://www.1999.co.jp/eng/",
    },
  };

  const fallback = tips[query] || tips["3D printing resin figures tutorial"];

  return {
    type: "web_article",
    text: [
      "🌐 <b>" + query.replace(/_/g, " ") + "</b>",
      "",
      fallback.text,
      "",
      `🔗 <a href="${fallback.url}">بیشتر بخوانید</a>`,
      "",
      "#چاپ_سه_بعدی #فیگور #دانش",
    ].join("\n"),
  };
}

export async function generatePostBatch(): Promise<PostContent[]> {
  const results = await Promise.allSettled([getRandomProducts(3), getRecentBlogPosts(3)]);

  const products =
    results[0].status === "fulfilled" ? results[0].value : getFallbackProducts();
  const blogs = results[1].status === "fulfilled" ? results[1].value : getFallbackBlogs();

  const posts: PostContent[] = [];

  if (products.length > 0) {
    posts.push(buildProductPost(pickRandom(products)));
  }

  if (blogs.length > 0) {
    posts.push(buildBlogPost(pickRandom(blogs)));
  }

  const webPost = await searchWebArticle();
  if (webPost) posts.push(webPost);

  return posts;
}

function getFallbackProducts(): ProductWithTranslations[] {
  return [
    {
      id: "fb1",
      slug: "nezuko-kamado-figure",
      sku: "FF-NZ-001",
      categoryId: null,
      brand: "FigureForge",
      price: 890000,
      compareAtPrice: 1100000,
      stock: 5,
      isActive: true,
      isFeatured: true,
      isSpecial: false,
      hasDiscount: true,
      heightCm: "18",
      material: "Resin",
      weightGrams: 200,
      images: [],
      musicUrl: null,
      musicTitle: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "t1",
          productId: "fb1",
          locale: "fa",
          name: "فیگور نزوکو کامادو",
          shortDescription: "فیگور دستی نزوکو از سری Demon Slayer با جزئیات بالا",
          description: "",
          features: null,
        },
      ],
      category: null,
      cartItems: [],
      orderItems: [],
    },
    {
      id: "fb2",
      slug: "gojo-satoru-figure",
      sku: "FF-GJ-002",
      categoryId: null,
      brand: "FigureForge",
      price: 1250000,
      compareAtPrice: null,
      stock: 3,
      isActive: true,
      isFeatured: true,
      isSpecial: false,
      hasDiscount: false,
      heightCm: "22",
      material: "Resin",
      weightGrams: 350,
      images: [],
      musicUrl: null,
      musicTitle: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "t2",
          productId: "fb2",
          locale: "fa",
          name: "فیگور گوجو ساتورو",
          shortDescription: "فیگور گوجو ساتورو از Jujutsu Kaisen با قابلیت نور LED",
          description: "",
          features: null,
        },
      ],
      category: null,
      cartItems: [],
      orderItems: [],
    },
    {
      id: "fb3",
      slug: "luffy-gear-5-figure",
      sku: "FF-LF-003",
      categoryId: null,
      brand: "FigureForge",
      price: 980000,
      compareAtPrice: 1300000,
      stock: 7,
      isActive: true,
      isFeatured: true,
      isSpecial: true,
      hasDiscount: true,
      heightCm: "20",
      material: "PVC",
      weightGrams: 280,
      images: [],
      musicUrl: null,
      musicTitle: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "t3",
          productId: "fb3",
          locale: "fa",
          name: "فیگور لافی گیر ۵",
          shortDescription: "فیگور لافی در حالت Gear 5 از سری One Piece",
          description: "",
          features: null,
        },
      ],
      category: null,
      cartItems: [],
      orderItems: [],
    },
  ] as unknown as ProductWithTranslations[];
}

function getFallbackBlogs(): BlogPostWithTranslations[] {
  return [
    {
      id: "bb1",
      slug: "how-to-paint-3d-figures",
      coverImage: null,
      coverSvg: null,
      category: "tutorial",
      readingTime: 7,
      isPublished: true,
      isTrending: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "bt1",
          postId: "bb1",
          locale: "fa",
          tag: "آموزش",
          title: "آموزش رنگ‌آمیزی فیگورهای چاپ سه‌بعدی",
          excerpt:
            "با این آموزش قدم به قدم، فیگورهای چاپ سه‌بعدی خود را مثل حرفه‌ای‌ها رنگ کنید.",
          body: "",
        },
      ],
    },
    {
      id: "bb2",
      slug: "best-resin-printers-2026",
      coverImage: null,
      coverSvg: null,
      category: "review",
      readingTime: 10,
      isPublished: true,
      isTrending: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "bt2",
          postId: "bb2",
          locale: "fa",
          tag: "بررسی",
          title: "بهترین پرینترهای رزینی ۲۰۲۶",
          excerpt:
            "مقایسه بهترین پرینترهای رزینی برای چاپ فیگورهای انیمه با کیفیت بالا.",
          body: "",
        },
      ],
    },
    {
      id: "bb3",
      slug: "figure-collecting-beginners-guide",
      coverImage: null,
      coverSvg: null,
      category: "guide",
      readingTime: 8,
      isPublished: true,
      isTrending: false,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "bt3",
          postId: "bb3",
          locale: "fa",
          tag: "راهنما",
          title: "راهنمای شروع جمع‌آوری فیگور",
          excerpt:
            "همه چیزی که برای شروع مجموعه فیگور خود نیاز دارید — از انتخاب اولین فیگور تا نگهداری.",
          body: "",
        },
      ],
    },
  ] as unknown as BlogPostWithTranslations[];
}
