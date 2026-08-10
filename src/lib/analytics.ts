import { NextRequest } from "next/server";
import prisma from "@/lib/db";

export const ANALYTICS_EVENT_TYPES = [
  "PAGE_VIEW",
  "PRODUCT_VIEW",
  "CATEGORY_VIEW",
  "SEARCH",
  "ADD_TO_CART",
  "REMOVE_FROM_CART",
  "CHECKOUT_START",
  "ORDER_PLACED",
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export type TrackEventInput = {
  type: AnalyticsEventType;
  path?: string;
  locale?: string;
  productId?: string;
  categorySlug?: string;
  query?: string;
  userId?: string | null;
  sessionId?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
};

export async function trackEvent(input: TrackEventInput) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type: input.type,
        path: (input.path || "/").slice(0, 500),
        locale: input.locale?.slice(0, 8) || null,
        productId: input.productId?.slice(0, 100) || null,
        categorySlug: input.categorySlug?.slice(0, 200) || null,
        query: input.query?.slice(0, 200) || null,
        userId: input.userId || null,
        sessionId: input.sessionId?.slice(0, 200) || null,
        referrer: input.referrer?.slice(0, 500) || null,
        userAgent: input.userAgent?.slice(0, 500) || null,
        ip: input.ip?.slice(0, 100) || null,
      },
    });
  } catch (err) {
    // Analytics must never break the app.
    console.error("[analytics] track failed", err);
  }
}

export function getRequestMeta(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;
  return {
    ip,
    userAgent: req.headers.get("user-agent"),
    referrer: req.headers.get("referer"),
  };
}

export function isAnalyticsEventType(value: string): value is AnalyticsEventType {
  return (ANALYTICS_EVENT_TYPES as readonly string[]).includes(value);
}

type DailyRow = { day: Date; views: bigint; visitors: bigint };

export async function getAnalyticsOverview(days = 30) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const where = { createdAt: { gte: since } };

  const [
    pageViews,
    productViews,
    categoryViews,
    searchCount,
    cartAdds,
    checkoutStarts,
    orderCount,
    sessionRows,
    topPages,
    topProducts,
    topCategories,
    topSearches,
    topReferrers,
    dailyRows,
  ] = await Promise.all([
    prisma.analyticsEvent.count({ where: { ...where, type: "PAGE_VIEW" } }),
    prisma.analyticsEvent.count({ where: { ...where, type: "PRODUCT_VIEW" } }),
    prisma.analyticsEvent.count({ where: { ...where, type: "CATEGORY_VIEW" } }),
    prisma.analyticsEvent.count({ where: { ...where, type: "SEARCH" } }),
    prisma.analyticsEvent.count({ where: { ...where, type: "ADD_TO_CART" } }),
    prisma.analyticsEvent.count({ where: { ...where, type: "CHECKOUT_START" } }),
    prisma.order.count({ where: { createdAt: { gte: since } } }),
    prisma.analyticsEvent.findMany({
      where: { ...where, sessionId: { not: null } },
      select: { sessionId: true },
      distinct: ["sessionId"],
    }),
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { ...where, type: "PAGE_VIEW" },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["productId"],
      where: {
        ...where,
        type: { in: ["PRODUCT_VIEW", "ADD_TO_CART"] },
        productId: { not: null },
      },
      _count: { _all: true },
      orderBy: { _count: { productId: "desc" } },
      take: 10,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["categorySlug"],
      where: { ...where, categorySlug: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { categorySlug: "desc" } },
      take: 10,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["query"],
      where: { ...where, type: "SEARCH", query: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { query: "desc" } },
      take: 10,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["referrer"],
      where: { ...where, referrer: { not: "" } },
      _count: { _all: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 8,
    }),
    prisma.$queryRaw<DailyRow[]>`
      SELECT date_trunc('day', "createdAt") AS day,
             COUNT(*) AS views,
             COUNT(DISTINCT "sessionId") AS visitors
      FROM "AnalyticsEvent"
      WHERE type = 'PAGE_VIEW' AND "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `,
  ]);

  const productIds = topProducts.map((p) => p.productId).filter(Boolean) as string[];
  const categorySlugs = topCategories.map((c) => c.categorySlug).filter(Boolean) as string[];

  const [products, categories] = await Promise.all([
    productIds.length
      ? prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, slug: true, translations: { select: { name: true }, take: 1 } },
        })
      : [],
    categorySlugs.length
      ? prisma.category.findMany({
          where: { slug: { in: categorySlugs } },
          select: { slug: true, translations: { select: { name: true }, take: 1 } },
        })
      : [],
  ]);

  const productName = new Map(
    products.map((p) => [p.id, p.translations[0]?.name || p.slug])
  );
  const categoryName = new Map(
    categories.map((c) => [c.slug, c.translations[0]?.name || c.slug])
  );

  const dailyMap = new Map<string, { views: number; visitors: number }>();
  for (const row of dailyRows) {
    const key = row.day.toISOString().slice(0, 10);
    dailyMap.set(key, { views: Number(row.views), visitors: Number(row.visitors) });
  }

  const dailySeries: { date: string; label: string; views: number; visitors: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const row = dailyMap.get(iso) ?? { views: 0, visitors: 0 };
    dailySeries.push({
      date: iso,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      views: row.views,
      visitors: row.visitors,
    });
  }

  return {
    range: { days, since: since.toISOString() },
    totals: {
      pageViews,
      productViews,
      categoryViews,
      searches: searchCount,
      cartAdds,
      checkoutStarts,
      orders: orderCount,
      uniqueVisitors: sessionRows.length,
    },
    dailySeries,
    topPages: topPages.map((r) => ({ path: r.path, count: r._count._all })),
    topProducts: topProducts.map((r) => ({
      id: r.productId,
      name: r.productId ? productName.get(r.productId) ?? r.productId : "—",
      count: r._count._all,
    })),
    topCategories: topCategories.map((r) => ({
      slug: r.categorySlug,
      name: r.categorySlug ? categoryName.get(r.categorySlug) ?? r.categorySlug : "—",
      count: r._count._all,
    })),
    topSearches: topSearches.map((r) => ({ query: r.query, count: r._count._all })),
    topReferrers: topReferrers.map((r) => ({ referrer: r.referrer, count: r._count._all })),
  };
}

export type AnalyticsOverview = Awaited<ReturnType<typeof getAnalyticsOverview>>;
