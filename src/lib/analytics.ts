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

type TranslationRow = { locale: string; name: string };

function translatedName(translations: TranslationRow[], locale: string, fallback: string) {
  return translations.find((t) => t.locale === locale)?.name || translations[0]?.name || fallback;
}

export async function getAnalyticsOverview(days = 30, locale = "fa") {
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
          select: { id: true, slug: true, translations: { select: { locale: true, name: true } } },
        })
      : [],
    categorySlugs.length
      ? prisma.category.findMany({
          where: { slug: { in: categorySlugs } },
          select: { slug: true, translations: { select: { locale: true, name: true } } },
        })
      : [],
  ]);

  const productName = new Map(
    products.map((p) => [p.id, translatedName(p.translations, locale, p.slug)])
  );
  const categoryName = new Map(
    categories.map((c) => [c.slug, translatedName(c.translations, locale, c.slug)])
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

// ---------- Daily activity heatmap (GitHub-style) ----------

type ActivityRow = {
  day: Date;
  views: bigint;
  unique_users: bigint;
  registered: bigint;
  guests: bigint;
};

export type DailyActivity = {
  date: string;
  label: string;
  views: number;
  uniqueUsers: number;
  registeredUsers: number;
  guestUsers: number;
};

export async function getDailyActivity(days = 365): Promise<DailyActivity[]> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  let rows: ActivityRow[] = [];
  try {
    rows = await prisma.$queryRaw<ActivityRow[]>`
      SELECT date_trunc('day', "createdAt") AS day,
             COUNT(*) FILTER (WHERE type = 'PAGE_VIEW') AS views,
             COUNT(DISTINCT COALESCE("userId", 's:' || "sessionId")) AS unique_users,
             COUNT(DISTINCT "userId") AS registered,
             COUNT(DISTINCT "sessionId") FILTER (WHERE "userId" IS NULL) AS guests
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${since}
      GROUP BY day ORDER BY day ASC
    `;
  } catch (err) {
    console.error("[analytics] daily activity query failed", err);
    return [];
  }

  const map = new Map<string, Omit<DailyActivity, "date" | "label">>();
  for (const row of rows) {
    map.set(row.day.toISOString().slice(0, 10), {
      views: Number(row.views),
      uniqueUsers: Number(row.unique_users),
      registeredUsers: Number(row.registered),
      guestUsers: Number(row.guests),
    });
  }

  const series: DailyActivity[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const row = map.get(iso);
    series.push({
      date: iso,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      views: row?.views ?? 0,
      uniqueUsers: row?.uniqueUsers ?? 0,
      registeredUsers: row?.registeredUsers ?? 0,
      guestUsers: row?.guestUsers ?? 0,
    });
  }
  return series;
}

// ---------- Per-user analytics ----------

type HourlyRow = { hour: number; day: number; cnt: bigint };
type DailyUserRow = { day: Date; cnt: bigint };

export async function getUserAnalytics(userId: string, days = 30, locale = "fa") {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const where = { userId, createdAt: { gte: since } };

  const [
    totalEvents,
    firstActivity,
    lastActivity,
    dailyRows,
    hourlyRows,
    topPages,
    topProducts,
    topSearches,
    topCategories,
    sessionRows,
  ] = await Promise.all([
    prisma.analyticsEvent.count({ where: { userId } }),
    prisma.analyticsEvent.findFirst({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.analyticsEvent.findFirst({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.$queryRaw<DailyUserRow[]>`
      SELECT date_trunc('day', "createdAt") AS day, COUNT(*) AS cnt
      FROM "AnalyticsEvent"
      WHERE "userId" = ${userId} AND "createdAt" >= ${since}
      GROUP BY day ORDER BY day ASC
    `,
    prisma.$queryRaw<HourlyRow[]>`
      SELECT EXTRACT(HOUR FROM "createdAt")::int AS hour,
             EXTRACT(DOW FROM "createdAt")::int AS day,
             COUNT(*) AS cnt
      FROM "AnalyticsEvent"
      WHERE "userId" = ${userId} AND "createdAt" >= ${since}
      GROUP BY hour, day ORDER BY day, hour
    `,
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
        userId,
        type: { in: ["PRODUCT_VIEW", "ADD_TO_CART"] },
        productId: { not: null },
      },
      _count: { _all: true },
      orderBy: { _count: { productId: "desc" } },
      take: 10,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["query"],
      where: { userId, type: "SEARCH", query: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { query: "desc" } },
      take: 10,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["categorySlug"],
      where: { userId, categorySlug: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { categorySlug: "desc" } },
      take: 10,
    }),
    prisma.analyticsEvent.findMany({
      where: { userId, sessionId: { not: null } },
      select: { sessionId: true },
      distinct: ["sessionId"],
    }),
  ]);

  // Resolve product names
  const productIds = topProducts.map((p) => p.productId).filter(Boolean) as string[];
  const categorySlugs = topCategories.map((c) => c.categorySlug).filter(Boolean) as string[];

  const [products, categories] = await Promise.all([
    productIds.length
      ? prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, slug: true, translations: { select: { locale: true, name: true } } },
        })
      : [],
    categorySlugs.length
      ? prisma.category.findMany({
          where: { slug: { in: categorySlugs } },
          select: { slug: true, translations: { select: { locale: true, name: true } } },
        })
      : [],
  ]);

  const productName = new Map(products.map((p) => [p.id, translatedName(p.translations, locale, p.slug)]));
  const categoryName = new Map(categories.map((c) => [c.slug, translatedName(c.translations, locale, c.slug)]));

  // Daily series
  const dailyMap = new Map<string, number>();
  for (const row of dailyRows) {
    dailyMap.set(row.day.toISOString().slice(0, 10), Number(row.cnt));
  }
  const dailySeries: { date: string; label: string; count: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    dailySeries.push({
      date: iso,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count: dailyMap.get(iso) ?? 0,
    });
  }

  // Hourly heatmap (7 days × 24 hours)
  const hourlyGrid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const row of hourlyRows) {
    const dayIdx = row.day; // 0=Sun..6=Sat from EXTRACT(DOW)
    if (dayIdx >= 0 && dayIdx < 7 && row.hour >= 0 && row.hour < 24) {
      hourlyGrid[dayIdx][row.hour] = Number(row.cnt);
    }
  }

  // Event type breakdown
  const [pageViews, productViews, searches, cartAdds, checkoutStarts] = await Promise.all([
    prisma.analyticsEvent.count({ where: { ...where, type: "PAGE_VIEW" } }),
    prisma.analyticsEvent.count({ where: { ...where, type: "PRODUCT_VIEW" } }),
    prisma.analyticsEvent.count({ where: { ...where, type: "SEARCH" } }),
    prisma.analyticsEvent.count({ where: { ...where, type: "ADD_TO_CART" } }),
    prisma.analyticsEvent.count({ where: { ...where, type: "CHECKOUT_START" } }),
  ]);

  return {
    totalEvents,
    firstActivity: firstActivity?.createdAt ?? null,
    lastActivity: lastActivity?.createdAt ?? null,
    uniqueSessions: sessionRows.length,
    dailySeries,
    hourlyGrid,
    eventBreakdown: { pageViews, productViews, searches, cartAdds, checkoutStarts },
    topPages: topPages.map((r) => ({ path: r.path, count: r._count._all })),
    topProducts: topProducts.map((r) => ({
      id: r.productId,
      name: r.productId ? productName.get(r.productId) ?? r.productId : "—",
      count: r._count._all,
    })),
    topSearches: topSearches.map((r) => ({ query: r.query, count: r._count._all })),
    topCategories: topCategories.map((r) => ({
      slug: r.categorySlug,
      name: r.categorySlug ? categoryName.get(r.categorySlug) ?? r.categorySlug : "—",
      count: r._count._all,
    })),
  };
}

export type UserAnalytics = Awaited<ReturnType<typeof getUserAnalytics>>;
