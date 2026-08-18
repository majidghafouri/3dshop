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

type PostContent = {
  type: "product" | "blog" | "tip" | "collection";
  text: string;
  image?: string;
  url?: string;
};

const DAILY_TIPS = [
  {
    icon: "🖨️",
    tip: "نکته چاپ سه‌بعدی: همیشه قبل از شروع پرینت، بستر چاپ را با الکل ایزوپروپیل تمیز کنید تا چسبندگی بهتری داشته باشید.",
    en: "3D Printing Tip: Always clean the print bed with isopropyl alcohol before starting for better adhesion.",
  },
  {
    icon: "🎨",
    tip: "نکته رنگ: فیگورهای رنگی را در معرض نور مستقیم خورشید قرار ندهید تا رنگ‌ها تغییر نکنند.",
    en: "Color Tip: Don't place colored figures in direct sunlight to prevent color fading.",
  },
  {
    icon: "🛡️",
    tip: "نکته نگهداری: هر هفته یکبار با یک پارچه نرم و خشک، گرد و غبار فیگورهای خود را پاک کنید.",
    en: "Care Tip: Dust your figures weekly with a soft, dry cloth to keep them clean.",
  },
  {
    icon: "📦",
    tip: "نکته بسته‌بندی: هنگام ارسال فیگور، از حباب‌چسب استفاده کنید و فضای خالی را با پنبه پر کنید.",
    en: "Packing Tip: Use bubble wrap and fill empty spaces with cotton when shipping figures.",
  },
  {
    icon: "🔧",
    tip: "نکته تعمیر: اگر فیگور شما قطعه‌ای شکسته دارد، از چسب اپوکسی دو جزئی برای تعمیر استفاده کنید.",
    en: "Repair Tip: Use two-part epoxy glue to fix broken figure parts.",
  },
  {
    icon: "✨",
    tip: "نکته براق‌کردن: برای براق کردن فیگورهای مات، از اسپری براق‌کننده مخصوص مدل استفاده کنید.",
    en: "Shining Tip: Use model-specific gloss spray to make matte figures shine.",
  },
  {
    icon: "🌡️",
    tip: "نکته دما: فیگورهای رزینی را در دمای زیر ۴۰ درجه نگهداری کنید تا تغییر شکل ندهند.",
    en: "Temperature Tip: Store resin figures below 40°C to prevent deformation.",
  },
  {
    icon: "📐",
    tip: "نکته مقیاس: هنگام خرید فیگور، مقیاس آن را با فیگورهای دیگر مجموعه‌تان مقایسه کنید.",
    en: "Scale Tip: Compare figure scale with others in your collection before buying.",
  },
  {
    icon: "🎁",
    tip: "نکته هدیه: فیگورهای انیمه‌ای هدیه‌ای عالی برای علاقه‌مندان به فرهنگ ژاپن هستند.",
    en: "Gift Tip: Anime figures make great gifts for Japanese culture enthusiasts.",
  },
  {
    icon: "💰",
    tip: "نکته خرید: فیگورهای اورجینال معمولاً قیمت بالاتری دارند اما کیفیت و ماندگاری بیشتری نیز دارند.",
    en: "Buying Tip: Original figures cost more but offer better quality and longevity.",
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatPriceShort(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return amount.toString();
}

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
    take: 10,
  });
  return shuffleArray(posts).slice(0, count);
}

function buildProductPost(product: ProductWithTranslations): PostContent {
  const tr = product.translations[0];
  const name = tr?.name || "محصول";
  const desc = tr?.shortDescription || "";
  const price = formatPrice(product.price, "fa");
  const imageUrl = product.images[0] || "";
  const productUrl = `${SITE_URL}/products/${product.slug}`;

  const text = [
    `🛍️ <b>${name}</b>`,
    "",
    desc ? `${desc.slice(0, 150)}${desc.length > 150 ? "..." : ""}` : "",
    "",
    `💰 ${price}`,
    product.compareAtPrice ? `❌ ${formatPrice(product.compareAtPrice, "fa")}` : "",
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
  const coverImage = post.coverImage || "";

  const text = [
    `📝 <b>${title}</b>`,
    "",
    excerpt ? excerpt.slice(0, 200) + (excerpt.length > 200 ? "..." : "") : "",
    "",
    `📖 زمان مطالعه: ${post.readingTime || 5} دقیقه`,
    "",
    `🔗 <a href="${blogUrl}">مطالعه کامل مقاله</a>`,
    "",
    "#بلاگ #چاپ_سه_بعدی #فیگرفورج",
  ]
    .filter(Boolean)
    .join("\n");

  return { type: "blog", text, image: coverImage, url: blogUrl };
}

function buildTipPost(): PostContent {
  const tip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];

  const text = [tip.icon, "", tip.tip, "", "#نکته_چاپ_سه_بعدی #فیگرفورج"].join("\n");

  return { type: "tip", text };
}

export async function generateDailyPost(): Promise<PostContent> {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );

  const postType = dayOfYear % 3;

  if (postType === 0) {
    const products = await getRandomProducts(1);
    if (products.length > 0) return buildProductPost(products[0]);
    return buildTipPost();
  }

  if (postType === 1) {
    const posts = await getRecentBlogPosts(1);
    if (posts.length > 0) return buildBlogPost(posts[0]);
    return buildTipPost();
  }

  return buildTipPost();
}

export async function generateWeeklyCollection(): Promise<PostContent | null> {
  const products = await getRandomProducts(4);
  if (products.length === 0) return null;

  const lines: string[] = ["🎁 <b>مجموعه هفتگی فیگور</b>", ""];

  for (const p of products) {
    const tr = p.translations[0];
    const name = tr?.name || "محصول";
    const price = formatPriceShort(p.price);
    lines.push(`• <b>${name}</b> — ${price} تومان`);
  }

  lines.push("");
  lines.push(`🔗 مشاهده همه: ${SITE_URL}/products`);
  lines.push("");
  lines.push("#مجموعه #فیگور #انیمه #فیگرفورج");

  return {
    type: "collection",
    text: lines.join("\n"),
    image: products[0].images[0],
    url: `${SITE_URL}/products`,
  };
}
