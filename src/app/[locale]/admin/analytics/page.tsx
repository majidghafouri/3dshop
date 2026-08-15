import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale, isLocale, localePrefix } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import { getAnalyticsOverview } from "@/lib/analytics";

export default async function AdminAnalyticsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const prefix = localePrefix(locale);

  const rawDays = searchParams.days;
  const days = rawDays === "7" ? 7 : 30;
  const data = await getAnalyticsOverview(days);
  const t = data.totals;
  const d = dict.admin.analytics;

  const maxViews = Math.max(...data.dailySeries.map((x) => x.views), 1);

  const stats = [
    { label: d.views, value: t.pageViews, icon: "👁️" },
    { label: d.uniqueVisitors, value: t.uniqueVisitors, icon: "🧑‍🤝‍🧑" },
    { label: d.productViews, value: t.productViews, icon: "🛍️" },
    { label: d.cartAdds, value: t.cartAdds, icon: "🛒" },
    { label: d.searches, value: t.searches, icon: "🔍" },
    { label: d.orders, value: t.orders, icon: "📦" },
  ];

  const host = (referrer: string | null) => {
    if (!referrer) return "—";
    try {
      return new URL(referrer).hostname.replace(/^www\./, "");
    } catch {
      return referrer;
    }
  };

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
      <h3 className="text-[13.5px] font-[1000] text-[var(--text)] mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-[18px] font-[1000] text-[var(--text)]">{d.title}</h2>
        <div className="flex items-center gap-1.5 bg-[var(--surface)] border border-[var(--line)] rounded-full p-1">
          {([7, 30] as const).map((n) => (
            <Link
              key={n}
              href={`${prefix}/admin/analytics?days=${n}`}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-[950] transition-colors ${
                days === n
                  ? "text-white"
                  : "text-[var(--text-3)] hover:text-[var(--primary)]"
              }`}
              style={days === n ? { backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" } : undefined}
            >
              {n === 7 ? d.last7Days : d.last30Days}
            </Link>
          ))}
        </div>
      </div>

      {/* stat cards */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-4">
            <div className="text-[22px]">{s.icon}</div>
            <p className="mt-2 text-[22px] font-[1000] text-[var(--text)]" dir="ltr">
              {s.value.toLocaleString("en-US")}
            </p>
            <p className="mt-0.5 text-[11.5px] font-[850] text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* daily chart */}
      <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
        <h3 className="text-[13.5px] font-[1000] text-[var(--text)]">{d.dailyViews}</h3>
        <div className="mt-4 flex items-end gap-[3px] h-[150px]">
          {data.dailySeries.map((x) => (
            <div
              key={x.date}
              className="group relative flex-1 flex flex-col justify-end h-full"
            >
              <div
                className="w-full rounded-t-[4px] min-h-[2px] transition-all duration-300"
                style={{
                  height: `${Math.max((x.views / maxViews) * 100, 2)}%`,
                  backgroundImage:
                    x.views > 0
                      ? "linear-gradient(180deg,var(--primary),var(--sky))"
                      : "var(--line-2)",
                  opacity: x.views > 0 ? 1 : 0.4,
                }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black/85 text-white text-[10.5px] font-[850] rounded-[6px] px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                {x.label}: {x.views.toLocaleString("en-US")}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10.5px] font-[850] text-[var(--muted-2)]">
          <span>{data.dailySeries[0]?.label}</span>
          <span>{data.dailySeries[data.dailySeries.length - 1]?.label}</span>
        </div>
      </div>

      {/* lists */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title={d.topPages}>
          <ul className="space-y-2">
            {data.topPages.length === 0 && <Empty label={d.noData} />}
            {data.topPages.map((r, i) => (
              <li key={r.path} className="flex items-center justify-between gap-3 text-[12.5px]">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-[7px] bg-[var(--soft)] text-[var(--primary)] text-[10.5px] font-[950] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate font-[800] text-[var(--text-3)]" dir="ltr">
                    {r.path}
                  </span>
                </span>
                <span className="font-[950] text-[var(--text)] shrink-0" dir="ltr">
                  {r.count.toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={d.topProducts}>
          <ul className="space-y-2">
            {data.topProducts.length === 0 && <Empty label={d.noData} />}
            {data.topProducts.map((r, i) => (
              <li key={r.id ?? r.name} className="flex items-center justify-between gap-3 text-[12.5px]">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-[7px] bg-[var(--soft)] text-[var(--primary)] text-[10.5px] font-[950] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate font-[800] text-[var(--text-3)]">{r.name}</span>
                </span>
                <span className="font-[950] text-[var(--text)] shrink-0" dir="ltr">
                  {r.count.toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={d.topCategories}>
          <ul className="space-y-2">
            {data.topCategories.length === 0 && <Empty label={d.noData} />}
            {data.topCategories.map((r, i) => (
              <li key={r.slug} className="flex items-center justify-between gap-3 text-[12.5px]">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-[7px] bg-[var(--soft)] text-[var(--primary)] text-[10.5px] font-[950] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate font-[800] text-[var(--text-3)]">{r.name}</span>
                </span>
                <span className="font-[950] text-[var(--text)] shrink-0" dir="ltr">
                  {r.count.toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={d.topSearches}>
          <ul className="space-y-2">
            {data.topSearches.length === 0 && <Empty label={d.noData} />}
            {data.topSearches.map((r, i) => (
              <li key={r.query} className="flex items-center justify-between gap-3 text-[12.5px]">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-[7px] bg-[var(--soft)] text-[var(--primary)] text-[10.5px] font-[950] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate font-[800] text-[var(--text-3)]">“{r.query}”</span>
                </span>
                <span className="font-[950] text-[var(--text)] shrink-0" dir="ltr">
                  {r.count.toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={d.topReferrers}>
          <ul className="space-y-2">
            {data.topReferrers.length === 0 && <Empty label={d.noData} />}
            {data.topReferrers.map((r, i) => (
              <li key={r.referrer} className="flex items-center justify-between gap-3 text-[12.5px]">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-[7px] bg-[var(--soft)] text-[var(--primary)] text-[10.5px] font-[950] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate font-[800] text-[var(--text-3)]" dir="ltr">
                    {host(r.referrer)}
                  </span>
                </span>
                <span className="font-[950] text-[var(--text)] shrink-0" dir="ltr">
                  {r.count.toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <li className="text-[12.5px] font-[800] text-[var(--muted)] py-2">{label}</li>;
}
