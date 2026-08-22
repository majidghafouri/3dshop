"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type UsersDict = {
  title: string;
  subtitle: string;
  stats: {
    total: string;
    verified: string;
    admins: string;
    newWeek: string;
    newMonth: string;
    revenue: string;
    totalOrders: string;
  };
  table: {
    name: string;
    email: string;
    phone: string;
    role: string;
    verified: string;
    locale: string;
    joined: string;
    lastActive: string;
    orders: string;
    user: string;
    admin: string;
    yes: string;
    no: string;
  };
  empty: string;
  search: string;
  filterAll: string;
  filterAdmin: string;
  filterVerified: string;
};

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  locale: string;
  role: string;
  createdAt: string;
  lastActiveAt: string | null;
  orderCount: number;
};

type Stats = {
  total: number;
  verifiedCount: number;
  adminCount: number;
  newWeek: number;
  newMonth: number;
  totalRevenue: number;
  totalOrders: number;
};

export default function UsersTable({
  users,
  stats,
  dict,
}: {
  users: UserRow[];
  stats: Stats;
  dict: UsersDict;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "verified">("all");
  const router = useRouter();
  const pathname = usePathname();

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q);
    const matchesFilter =
      filter === "all" ||
      (filter === "admin" && u.role === "ADMIN") ||
      (filter === "verified" && (u.phoneVerified || u.emailVerified));
    return matchesSearch && matchesFilter;
  });

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-CA");
  const fmtDateTime = (d: string) =>
    new Date(d).toLocaleString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <div>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      {/* Stats cards */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: dict.stats.total, value: stats.total.toLocaleString("en-US"), icon: "👥" },
          { label: dict.stats.verified, value: stats.verifiedCount.toLocaleString("en-US"), icon: "✅" },
          { label: dict.stats.admins, value: stats.adminCount.toLocaleString("en-US"), icon: "🛡️" },
          { label: dict.stats.newWeek, value: stats.newWeek.toLocaleString("en-US"), icon: "🆕" },
          { label: dict.stats.newMonth, value: stats.newMonth.toLocaleString("en-US"), icon: "📅" },
          { label: dict.stats.totalOrders, value: stats.totalOrders.toLocaleString("en-US"), icon: "📦" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-[18px]">{s.icon}</span>
              <span className="text-[12px] font-[850] text-[var(--muted)]">{s.label}</span>
            </div>
            <p className="mt-1.5 text-[22px] font-[1000] text-[var(--text)]" dir="ltr">
              {s.value}
            </p>
          </div>
        ))}
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
          {(["all", "admin", "verified"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-[10px] text-[12px] font-[900] transition-colors ${
                filter === f
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] border border-[var(--line)] text-[var(--text-2)] hover:bg-[var(--soft)]"
              }`}
            >
              {f === "all" ? dict.filterAll : f === "admin" ? dict.filterAdmin : dict.filterVerified}
            </button>
          ))}
        </div>
        <span className="text-[12px] font-[850] text-[var(--muted)]">
          {filtered.length} / {users.length}
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
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.name}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.email}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.phone}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.role}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.verified}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.locale}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.orders}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.lastActive}</th>
                  <th className="px-4 py-3 text-[11.5px] font-[950] text-[var(--muted)] uppercase tracking-wide">{dict.table.joined}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const basePath = pathname.replace(/\/admin\/users.*$/, "/admin/users");
                  return (
                  <tr
                    key={u.id}
                    onClick={() => router.push(`${basePath}/${u.id}`)}
                    className="border-b border-[var(--line)] last:border-b-0 hover:bg-[var(--soft)] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-[13px] font-[900] text-[var(--text)]">
                      {u.name || <span className="text-[var(--muted)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[12.5px] font-[850] text-[var(--text-2)]" dir="ltr">
                      {u.email || <span className="text-[var(--muted)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[12.5px] font-[850] text-[var(--text-2)]" dir="ltr">
                      {u.phone || <span className="text-[var(--muted)]">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-[900] px-2 py-0.5 rounded-full ${
                        u.role === "ADMIN"
                          ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                          : "bg-[var(--bg-tint)] text-[var(--text-2)]"
                      }`}>
                        {u.role === "ADMIN" ? dict.table.admin : dict.table.user}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {u.phoneVerified && (
                          <span className="text-[10.5px] font-[850] px-1.5 py-0.5 rounded bg-[var(--success-soft)] text-[var(--success)]">
                            📱
                          </span>
                        )}
                        {u.emailVerified && (
                          <span className="text-[10.5px] font-[850] px-1.5 py-0.5 rounded bg-[var(--success-soft)] text-[var(--success)]">
                            ✉️
                          </span>
                        )}
                        {!u.phoneVerified && !u.emailVerified && (
                          <span className="text-[10.5px] font-[850] text-[var(--muted)]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-[850] text-[var(--muted)] uppercase" dir="ltr">
                      {u.locale}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-[950] text-[var(--text)]" dir="ltr">
                      {u.orderCount}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-[850] text-[var(--muted)] whitespace-nowrap" dir="ltr">
                      {u.lastActiveAt ? (
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              Date.now() - new Date(u.lastActiveAt).getTime() <
                              7 * 86400000
                                ? "bg-[var(--success)]"
                                : "bg-[var(--muted-2)]"
                            }`}
                          />
                          {fmtDateTime(u.lastActiveAt)}
                        </span>
                      ) : (
                        <span className="text-[var(--muted)]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-[850] text-[var(--muted)]" dir="ltr">
                      {fmt(u.createdAt)}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
