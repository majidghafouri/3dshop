import { notFound } from "next/navigation";
import { Locale, isLocale, localePrefix } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import prisma from "@/lib/db";
import { getUserAnalytics, getUserActivityTimeline } from "@/lib/analytics";
import UserDetailCard from "@/components/admin/UserDetailCard";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const prefix = localePrefix(locale);

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      phoneVerified: true,
      emailVerified: true,
      locale: true,
      role: true,
      createdAt: true,
      orders: {
        select: { id: true, total: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  const analytics = await getUserAnalytics(user.id, 30, locale);
  const timeline = await getUserActivityTimeline(user.id, 14, 500);

  const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <UserDetailCard
      dict={dict.admin.userDetail}
      locale={locale}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        emailVerified: user.emailVerified,
        locale: user.locale,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        orderCount: user.orders.length,
        totalSpent,
        recentOrders: user.orders.slice(0, 5).map((o) => ({
          id: o.id,
          total: o.total,
          status: o.status,
          createdAt: o.createdAt.toISOString(),
        })),
      }}
      analytics={{
        totalEvents: analytics.totalEvents,
        firstActivity: analytics.firstActivity?.toISOString() ?? null,
        lastActivity: analytics.lastActivity?.toISOString() ?? null,
        uniqueSessions: analytics.uniqueSessions,
        dailySeries: analytics.dailySeries,
        hourlyGrid: analytics.hourlyGrid,
        eventBreakdown: analytics.eventBreakdown,
        topPages: analytics.topPages.map((p) => ({ path: p.path, count: Number(p.count) })),
        topProducts: analytics.topProducts
          .filter((p): p is typeof p & { id: string } => p.id !== null)
          .map((p) => ({
            id: p.id,
            name: p.name,
            count: Number(p.count),
          })),
        topSearches: analytics.topSearches
          .filter((s): s is typeof s & { query: string } => s.query !== null)
          .map((s) => ({
            query: s.query,
            count: Number(s.count),
          })),
        topCategories: analytics.topCategories
          .filter((c): c is typeof c & { slug: string } => c.slug !== null)
          .map((c) => ({
            slug: c.slug,
            name: c.name,
            count: Number(c.count),
          })),
      }}
      timeline={timeline}
      showSessions={true}
      backHref={`${prefix}/admin/users`}
    />
  );
}
