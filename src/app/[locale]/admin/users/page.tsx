import { notFound } from "next/navigation";
import { Locale, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import prisma from "@/lib/db";
import UsersTable from "@/components/admin/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);

  const [users, total, verifiedCount, adminCount, newWeek, newMonth, orderCounts] =
    await Promise.all([
      prisma.user.findMany({
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
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { OR: [{ phoneVerified: true }, { emailVerified: true }] } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.order.aggregate({ _sum: { total: true }, _count: true }),
    ]);

  const totalRevenue = orderCounts._sum.total ?? 0;

  return (
    <UsersTable
      dict={dict.admin.users}
      users={users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        phoneVerified: u.phoneVerified,
        emailVerified: u.emailVerified,
        locale: u.locale,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
        orderCount: u._count.orders,
      }))}
      stats={{
        total,
        verifiedCount,
        adminCount,
        newWeek,
        newMonth,
        totalRevenue,
        totalOrders: orderCounts._count,
      }}
    />
  );
}
