import { notFound } from "next/navigation";
import { Locale, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import prisma from "@/lib/db";

export default async function AdminDashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const [orderCount, revenueAgg, productCount, lowStock, categoryCount, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 5 } } }),
      prisma.category.count(),
      prisma.order.findMany({
        include: { user: true, items: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

  const d = dict.admin.dashboard;
  const stats = [
    { label: d.totalOrders, value: orderCount, icon: "📦" },
    { label: d.revenue, value: `${(revenueAgg._sum.total ?? 0).toLocaleString("en-US")} T`, icon: "💰" },
    { label: d.products, value: productCount, icon: "🗃️" },
    { label: d.lowStock, value: lowStock, icon: "⚠️" },
    { label: d.categories, value: categoryCount, icon: "🗂️" },
  ];

  return (
    <div>
      <h2 className="text-[18px] font-[1000] text-[var(--text)]">{d.title}</h2>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-4">
            <div className="text-[22px]">{s.icon}</div>
            <p className="mt-2 text-[20px] font-[1000] text-[var(--text)]" dir="ltr">{s.value}</p>
            <p className="mt-0.5 text-[11.5px] font-[850] text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-8 text-[16px] font-[1000] text-[var(--text)]">{d.recentOrders}</h3>
      <div className="mt-3 bg-[var(--surface)] border border-[var(--line)] rounded-[18px] overflow-hidden">
        {recentOrders.length === 0 ? (
          <p className="p-6 text-[13.5px] font-[850] text-[var(--muted)]">{d.noOrders}</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-right border-b border-[var(--surface-3)] text-[var(--muted)] font-[900]">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">{d.customer}</th>
                <th className="px-4 py-3">{d.items}</th>
                <th className="px-4 py-3">{d.total}</th>
                <th className="px-4 py-3">{d.status}</th>
                <th className="px-4 py-3">{d.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-3)]">
              {recentOrders.map((o) => (
                <tr key={o.id} className="font-[850] text-[var(--text-3)]">
                  <td className="px-4 py-3 font-[950] text-[var(--primary)]" dir="ltr">#{o.orderNumber}</td>
                  <td className="px-4 py-3" dir="ltr">{o.user.phone}</td>
                  <td className="px-4 py-3">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="px-4 py-3" dir="ltr">{o.total.toLocaleString("en-US")}</td>
                  <td className="px-4 py-3">
                    <span className="bg-[var(--soft)] text-[var(--primary)] rounded-full px-2.5 py-1 text-[11px] font-[950]">
                      {dict.account.statuses[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Date(o.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
