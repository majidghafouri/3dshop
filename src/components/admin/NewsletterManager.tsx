"use client";

import { useState } from "react";

type NewsletterDict = {
  title: string;
  subtitle: string;
  statTotal: string;
  statActive: string;
  search: string;
  filterAll: string;
  filterActive: string;
  filterInactive: string;
  empty: string;
  table: {
    email: string;
    account: string;
    locale: string;
    subscribedAt: string;
    status: string;
  };
  active: string;
  inactive: string;
  noAccount: string;
};

type SubscriberRow = {
  id: string;
  email: string;
  locale: string;
  isActive: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string | null } | null;
};

export default function NewsletterManager({
  dict,
  subscribers,
}: {
  dict: NewsletterDict;
  subscribers: SubscriberRow[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = subscribers.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q || s.email.toLowerCase().includes(q) || s.user?.name?.toLowerCase().includes(q);
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && s.isActive) ||
      (filter === "inactive" && !s.isActive);
    return matchesSearch && matchesFilter;
  });

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-CA");

  return (
    <div>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-4">
          <div className="flex items-center gap-2">
            <span className="text-[18px]">📬</span>
            <span className="text-[12px] font-[850] text-[var(--muted)]">{dict.statTotal}</span>
          </div>
          <p className="mt-1.5 text-[22px] font-[1000] text-[var(--text)]" dir="ltr">
            {subscribers.length.toLocaleString("en-US")}
          </p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-4">
          <div className="flex items-center gap-2">
            <span className="text-[18px]">✅</span>
            <span className="text-[12px] font-[850] text-[var(--muted)]">{dict.statActive}</span>
          </div>
          <p className="mt-1.5 text-[22px] font-[1000] text-[var(--success)]" dir="ltr">
            {activeCount.toLocaleString("en-US")}
          </p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="mt-5 flex items-center gap-3 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={dict.search}
          className="flex-1 min-w-[200px] border border-[var(--line-2)] rounded-[12px] px-4 py-2.5 text-[13px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
        />
        <div className="flex items-center gap-1.5">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-[10px] text-[12px] font-[900] transition-colors ${
                filter === f
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] border border-[var(--line)] text-[var(--text-2)] hover:bg-[var(--soft)]"
              }`}
            >
              {f === "all" ? dict.filterAll : f === "active" ? dict.filterActive : dict.filterInactive}
            </button>
          ))}
        </div>
        <span className="text-[12px] font-[850] text-[var(--muted)]">
          {filtered.length} / {subscribers.length}
        </span>
      </div>

      {/* Table */}
      <div className="mt-4 bg-[var(--surface)] border border-[var(--line)] rounded-[18px] overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-[13.5px] font-[850] text-[var(--muted)]">{dict.empty}</p>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.email}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.account}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.locale}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.subscribedAt}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.status}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-[var(--line)] last:border-b-0 hover:bg-[var(--soft)] transition-colors">
                    <td className="px-4 py-3 text-[12.5px] font-[900] text-[var(--text)]" dir="ltr">
                      ✉️ {s.email}
                    </td>
                    <td className="px-4 py-3 text-[12.5px] font-[850] text-[var(--text-2)]">
                      {s.user ? (
                        <span className="flex flex-col">
                          <span>{s.user.name || dict.noAccount}</span>
                          {s.user.email && (
                            <span className="text-[11px] text-[var(--muted)]" dir="ltr">
                              {s.user.email}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-[var(--muted)]">{dict.noAccount}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-[850] text-[var(--muted)] uppercase" dir="ltr">
                      {s.locale}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-[850] text-[var(--muted)] whitespace-nowrap" dir="ltr">
                      {fmt(s.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-[900] px-2 py-0.5 rounded-full ${
                          s.isActive
                            ? "bg-[var(--success-soft)] text-[var(--success)]"
                            : "bg-[var(--danger-soft)] text-[var(--danger)]"
                        }`}
                      >
                        {s.isActive ? dict.active : dict.inactive}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
