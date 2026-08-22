"use client";

import { useState } from "react";
import Link from "next/link";

type UserDetailDict = {
  back: string;
  title: string;
  info: string;
  stats: {
    totalEvents: string;
    pageViews: string;
    productViews: string;
    searches: string;
    cartAdds: string;
    sessions: string;
    firstActive: string;
    lastActive: string;
    orders: string;
    totalSpent: string;
    joined: string;
  };
  charts: {
    dailyActivity: string;
    hourlyHeatmap: string;
    eventBreakdown: string;
    topPages: string;
    topProducts: string;
    topSearches: string;
    topCategories: string;
    days: string[];
    noData: string;
  };
  timeline: {
    title: string;
    adminTitle: string;
    session: string;
    noActivity: string;
    events: Record<string, string>;
  };
  message: {
    title: string;
    subtitle: string;
    channel: string;
    emailChannel: string;
    to: string;
    subject: string;
    body: string;
    bodyPlaceholder: string;
    template: string;
    templatePlaceholder: string;
    send: string;
    sending: string;
    sent: string;
    failed: string;
    noEmail: string;
    templates: Record<string, string>;
  };
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  locale: string;
  role: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  recentOrders: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
};

type Analytics = {
  totalEvents: number;
  firstActivity: string | null;
  lastActivity: string | null;
  uniqueSessions: number;
  dailySeries: { date: string; label: string; count: number }[];
  hourlyGrid: number[][];
  eventBreakdown: {
    pageViews: number;
    productViews: number;
    searches: number;
    cartAdds: number;
    checkoutStarts: number;
  };
  topPages: { path: string; count: number }[];
  topProducts: { id: string; name: string; count: number }[];
  topSearches: { query: string; count: number }[];
  topCategories: { slug: string; name: string; count: number }[];
};

type TimelineEvent = { time: string; type: string; target: string | null };
type TimelineSession = { sessionId: string | null; events: TimelineEvent[] };
type TimelineDay = { date: string; sessions: TimelineSession[] };

const EVENT_STYLES: Record<string, string> = {
  PAGE_VIEW: "bg-[var(--soft)] text-[var(--primary)]",
  PRODUCT_VIEW: "bg-[var(--soft)] text-[var(--primary)]",
  CATEGORY_VIEW: "bg-[var(--soft)] text-[var(--primary)]",
  SEARCH: "bg-[rgba(var(--teal-rgb),0.14)] text-[var(--teal-2)]",
  ADD_TO_CART: "bg-[var(--warning-soft-2)] text-[var(--warning-text)]",
  REMOVE_FROM_CART: "bg-[var(--danger-soft)] text-[var(--danger)]",
  CHECKOUT_START: "bg-[rgba(var(--primary-rgb),0.12)] text-[var(--primary)]",
  ORDER_PLACED: "bg-[var(--success-soft)] text-[var(--success)]",
};

const TEMPLATES: Record<string, Record<string, { subject: string; body: string }>> = {
  fa: {
    welcome: {
      subject: "خوش آمدید به فیگرفورج! 🎉",
      body: `با سلام و احترام،\n\nاز اینکه فیگرفورج را انتخاب کردید سپاسگزاریم. 🙏\n\nما اینجاییم تا بهترین تجربه خرید آنلاین را برای شما فراهم کنیم. اگر سوالی دارید، تیم پشتیبانی ما همیشه آماده کمک است.\n\nبا آرزوی بهترین‌ها،\nتیم فیگرفورج\n\n🌐 https://figureforge.ir`,
    },
    orderConfirmation: {
      subject: "سفارش شما با موفقیت ثبت شد ✅",
      body: `با سلام،\n\nسفارش شما با موفقیت در سیستم ثبت شد.\n\nبرای پیگیری سفارش و اطلاع از وضعیت ارسال، می‌توانید به بخش «سفارش‌های من» در حساب کاربری خود مراجعه کنید.\n\nاگر سوالی دارید، با ما تماس بگیرید.\n\nبا تشکر،\nتیم فیگرفورج\n\n🌐 https://figureforge.ir`,
    },
    promotion: {
      subject: "🔥 تخفیف ویژه فقط برای شما!",
      body: `با سلام،\n\nیک پیشنهاد ویژه برای شما داریم!\n\nبه مناسبت [مناسبت]، از [درصد]% تخفیف ویژه روی تمام محصولات بهره‌مند شوید.\n\n فرصت محدود است، همین الان اقدام کنید!\n\n🌐 https://figureforge.ir\nبا احترام،\ntیم فیگرفورج`,
    },
    newsletter: {
      subject: "خبرنامه فیگرفورج 📰",
      body: `با سلام،\n\nآخرین اخبار و به‌روزرسانی‌های فیگرفورج:\n\n📦 محصولات جدید: [نام محصول]\n🎯 ویژگی جدید: [توضیح ویژگی]\n💡 نکته ماه: [نکته]\n\nبرای اطلاعات بیشتر به سایت ما سر بزنید:\n🌐 https://figureforge.ir\n\nبا تشکر،\nتیم فیگرفورج`,
    },
  },
  en: {
    welcome: {
      subject: "Welcome to FigureForge! 🎉",
      body: `Hello and welcome!\n\nThank you for choosing FigureForge. We're thrilled to have you with us.\n\nOur team is here to provide you with the best online shopping experience. If you have any questions, don't hesitate to reach out.\n\nBest regards,\nThe FigureForge Team\n\n🌐 https://figureforge.ir`,
    },
    orderConfirmation: {
      subject: "Your Order Has Been Confirmed ✅",
      body: `Hello,\n\nYour order has been successfully placed.\n\nYou can track your order and check delivery status from the "My Orders" section in your account.\n\nIf you have any questions, feel free to contact us.\n\nThank you,\nThe FigureForge Team\n\n🌐 https://figureforge.ir`,
    },
    promotion: {
      subject: "🔥 Exclusive Discount Just for You!",
      body: `Hello,\n\nWe have a special offer just for you!\n\nEnjoy [X]% off on all products for [Occasion].\n\nLimited time only — shop now!\n\n🌐 https://figureforge.ir\nBest regards,\nThe FigureForge Team`,
    },
    newsletter: {
      subject: "FigureForge Newsletter 📰",
      body: `Hello,\n\nHere are the latest updates from FigureForge:\n\n📦 New Arrivals: [Product Name]\n🎯 New Feature: [Feature Description]\n💡 Tip of the Month: [Tip]\n\nVisit our website for more information:\n🌐 https://figureforge.ir\n\nThank you,\nThe FigureForge Team`,
    },
  },
  ar: {
    welcome: {
      subject: "مرحباً بكم في فيگرفورج! 🎉",
      body: `مرحباً وتحية طيبة،\n\nشكراً لاختياركم فيگرفورج. يسعدنا انضمامكم إلينا.\n\nفريقنا هنا لتقديم أفضل تجربة تسوق إلكتروني لك. إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.\n\nمع أطيب التحيات،\nفريق فيگرفورج\n\n🌐 https://figureforge.ir`,
    },
    orderConfirmation: {
      subject: "تم تأكيد طلبك بنجاح ✅",
      body: `مرحباً،\n\nتم تسجيل طلبك بنجاح في النظام.\n\n يمكنك متابعة طلبك والاطلاع على حالة التوصيل من قسم "طلباتي" في حسابك الشخصي.\n\nإذا كان لديك أي سؤال، اتصل بنا.\n\nمع الشكر،\nفريق فيگرفورج\n\n🌐 https://figureforge.ir`,
    },
    promotion: {
      subject: "🔥 خصم حصري خصيصاً لك!",
      body: `مرحباً،\n\nلدينا عرض خاص لك!\n\nاستمتع بخصم [X]% على جميع المنتجات بمناسبة [المناسبة].\n\nالفترة محدودة — توقف الآن!\n\n🌐 https://figureforge.ir\nمع أطيب التحيات،\nفريق فيگرفورج`,
    },
    newsletter: {
      subject: "نشرة فيگرفورج الإخبارية 📰",
      body: `مرحباً،\n\nإليك آخر الأخبار والتحديثات من فيگرفورج:\n\n📦 وصل حديثاً: [اسم المنتج]\n🎯 ميزة جديدة: [وصف الميزة]\n💡 نصيحة الشهر: [النصيحة]\n\nقم بزيارة موقعنا لمزيد من المعلومات:\n🌐 https://figureforge.ir\n\nمع الشكر،\nفريق فيگرفورج`,
    },
  },
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, Record<string, string>> = {
  fa: {
    PENDING: "در انتظار پرداخت",
    PAID: "پرداخت شده",
    PROCESSING: "در حال پردازش",
    SHIPPED: "ارسال شده",
    DELIVERED: "تحویل شده",
    CANCELLED: "لغو شده",
  },
  en: {
    PENDING: "Pending",
    PAID: "Paid",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  },
  ar: {
    PENDING: "بانتظار الدفع",
    PAID: "مدفوع",
    PROCESSING: "قيد المعالجة",
    SHIPPED: "تم الشحن",
    DELIVERED: "تم التسليم",
    CANCELLED: "ملغي",
  },
};

export default function UserDetailCard({
  dict,
  locale,
  user,
  analytics,
  timeline,
  showSessions,
  backHref,
}: {
  dict: UserDetailDict;
  locale: string;
  user: User;
  analytics: Analytics;
  timeline: TimelineDay[];
  showSessions: boolean;
  backHref: string;
}) {
  const [template, setTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-CA");
  const timeFmt = (d: string) =>
    new Date(d).toLocaleTimeString(locale === "fa" ? "fa-IR" : locale === "ar" ? "ar" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const fmtDateTime = (d: string) =>
    new Date(d).toLocaleString(locale === "fa" ? "fa-IR" : locale === "ar" ? "ar" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const maxDaily = Math.max(...analytics.dailySeries.map((x) => x.count), 1);
  const maxHourly = Math.max(...analytics.hourlyGrid.flat(), 1);

  const applyTemplate = (key: string) => {
    setTemplate(key);
    if (!key || key === "custom") {
      setSubject("");
      setBody("");
      return;
    }
    const tpl = TEMPLATES[locale]?.[key] ?? TEMPLATES.fa[key];
    if (tpl) {
      setSubject(tpl.subject);
      setBody(tpl.body);
    }
  };

  const sendMessage = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          channel: "email",
          subject: subject.trim() || undefined,
          body: body.trim(),
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setMsg({ kind: "ok", text: `${dict.message.sent} → ${json.data?.to}` });
        setBody("");
        setSubject("");
        setTemplate("");
      } else {
        setMsg({ kind: "err", text: `${dict.message.failed}: ${json.error}` });
      }
    } catch {
      setMsg({ kind: "err", text: dict.message.failed });
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[800] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all";

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
      <h3 className="text-[13.5px] font-[1000] text-[var(--text)] mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="text-[13px] font-[950] text-[var(--primary)] hover:underline"
          >
            ← {dict.back}
          </Link>
          <h2 className="text-[18px] font-[1000] text-[var(--text)]">
            {dict.title}: {user.name || user.email || user.phone || user.id.slice(0, 8)}
          </h2>
        </div>
      </div>

      {/* User info + stats */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4">
        {/* Info card */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
          <h3 className="text-[13.5px] font-[1000] text-[var(--text)] mb-3">👤 {dict.info}</h3>
          <div className="space-y-2.5">
            <InfoRow label="نام" value={user.name} />
            <InfoRow label="ایمیل" value={user.email} dir="ltr" />
            <InfoRow label="موبایل" value={user.phone} dir="ltr" />
            <InfoRow
              label="نقش"
              value={
                <span
                  className={`text-[11px] font-[900] px-2 py-0.5 rounded-full ${
                    user.role === "ADMIN"
                      ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "bg-[var(--bg-tint)] text-[var(--text-2)]"
                  }`}
                >
                  {user.role === "ADMIN" ? "مدیر" : "کاربر"}
                </span>
              }
            />
            <InfoRow
              label="تأیید"
              value={
                <div className="flex items-center gap-1.5">
                  {user.phoneVerified && (
                    <span className="text-[10.5px] font-[850] px-1.5 py-0.5 rounded bg-[var(--success-soft)] text-[var(--success)]">
                      📱
                    </span>
                  )}
                  {user.emailVerified && (
                    <span className="text-[10.5px] font-[850] px-1.5 py-0.5 rounded bg-[var(--success-soft)] text-[var(--success)]">
                      ✉️
                    </span>
                  )}
                  {!user.phoneVerified && !user.emailVerified && (
                    <span className="text-[10.5px] font-[850] text-[var(--muted)]">—</span>
                  )}
                </div>
              }
            />
            <InfoRow label="زبان" value={user.locale.toUpperCase()} />
            <InfoRow label={dict.stats.joined} value={fmt(user.createdAt)} dir="ltr" />
          </div>

          {/* Recent orders */}
          {user.recentOrders.length > 0 && (
            <div className="mt-5">
              <h4 className="text-[12.5px] font-[950] text-[var(--text-2)] mb-2">
                📦 {dict.stats.orders} ({user.orderCount})
              </h4>
              <div className="space-y-1.5">
                {user.recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between text-[11.5px] font-[850] py-1.5 border-b border-[var(--line)] last:border-0"
                  >
                    <span className="text-[var(--text-3)]" dir="ltr">
                      {fmt(o.createdAt)}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-[900] ${
                        STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_LABELS[locale]?.[o.status] || o.status}
                    </span>
                    <span className="text-[var(--text)]" dir="ltr">
                      {o.total.toLocaleString("en-US")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard icon="📊" label={dict.stats.totalEvents} value={analytics.totalEvents} />
          <StatCard icon="👁️" label={dict.stats.pageViews} value={analytics.eventBreakdown.pageViews} />
          <StatCard icon="🛍️" label={dict.stats.productViews} value={analytics.eventBreakdown.productViews} />
          <StatCard icon="🔍" label={dict.stats.searches} value={analytics.eventBreakdown.searches} />
          <StatCard icon="🛒" label={dict.stats.cartAdds} value={analytics.eventBreakdown.cartAdds} />
          <StatCard icon="🧑‍🤝‍🧑" label={dict.stats.sessions} value={analytics.uniqueSessions} />
          <StatCard icon="📦" label={dict.stats.orders} value={user.orderCount} />
          <StatCard
            icon="💰"
            label={dict.stats.totalSpent}
            value={user.totalSpent.toLocaleString("en-US")}
          />
          <StatCard
            icon="🕐"
            label={dict.stats.firstActive}
            value={analytics.firstActivity ? fmtDateTime(analytics.firstActivity) : "—"}
          />
          <StatCard
            icon="⏰"
            label={dict.stats.lastActive}
            value={analytics.lastActivity ? fmtDateTime(analytics.lastActivity) : "—"}
          />
        </div>
      </div>

      {/* Daily activity chart */}
      <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
        <h3 className="text-[13.5px] font-[1000] text-[var(--text)]">
          📈 {dict.charts.dailyActivity}
        </h3>
        <div className="mt-4 flex items-end gap-[3px] h-[150px]">
          {analytics.dailySeries.map((x) => (
            <div
              key={x.date}
              className="group relative flex-1 flex flex-col justify-end h-full"
            >
              <div
                className="w-full rounded-t-[4px] min-h-[2px] transition-all duration-300"
                style={{
                  height: `${Math.max((x.count / maxDaily) * 100, 2)}%`,
                  backgroundImage:
                    x.count > 0
                      ? "linear-gradient(180deg,var(--primary),var(--sky))"
                      : "var(--line-2)",
                  opacity: x.count > 0 ? 1 : 0.4,
                }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black/85 text-white text-[10.5px] font-[850] rounded-[6px] px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                {x.label}: {x.count.toLocaleString("en-US")}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10.5px] font-[850] text-[var(--muted-2)]">
          <span>{analytics.dailySeries[0]?.label}</span>
          <span>{analytics.dailySeries[analytics.dailySeries.length - 1]?.label}</span>
        </div>
      </div>

      {/* Hourly heatmap */}
      <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
        <h3 className="text-[13.5px] font-[1000] text-[var(--text)]">
          🕐 {dict.charts.hourlyHeatmap}
        </h3>
        <div className="mt-4 overflow-x-auto no-scrollbar">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex items-center gap-0 mb-1">
              <div className="w-[52px] shrink-0" />
              {Array.from({ length: 24 }, (_, h) => (
                <div
                  key={h}
                  className="flex-1 text-center text-[9px] font-[850] text-[var(--muted)]"
                >
                  {h}
                </div>
              ))}
            </div>
            {/* Grid rows */}
            {analytics.hourlyGrid.map((row, dayIdx) => (
              <div key={dayIdx} className="flex items-center gap-0 mb-0.5">
                <div className="w-[52px] shrink-0 text-[10px] font-[850] text-[var(--muted-2)] pr-1 text-left">
                  {dict.charts.days[dayIdx]}
                </div>
                {row.map((val, hourIdx) => {
                  const intensity = maxHourly > 0 ? val / maxHourly : 0;
                  return (
                    <div
                      key={hourIdx}
                      className="flex-1 aspect-square rounded-[3px] group relative cursor-default"
                      style={{
                        backgroundColor:
                          val === 0
                            ? "var(--line)"
                            : `color-mix(in srgb, var(--primary) ${Math.round(intensity * 100)}%, var(--bg))`,
                      }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black/85 text-white text-[10px] font-[850] rounded-[6px] px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                        {dict.charts.days[dayIdx]} {hourIdx}:00 — {val}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top lists */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title={`📄 ${dict.charts.topPages}`}>
          <ListEmpty items={analytics.topPages} empty={dict.charts.noData}>
            {analytics.topPages.map((r, i) => (
              <ListItem key={r.path} index={i} value={r.count} dir="ltr">
                <span className="truncate font-[800] text-[var(--text-3)]">{r.path}</span>
              </ListItem>
            ))}
          </ListEmpty>
        </Card>

        <Card title={`🛍️ ${dict.charts.topProducts}`}>
          <ListEmpty items={analytics.topProducts} empty={dict.charts.noData}>
            {analytics.topProducts.map((r, i) => (
              <ListItem key={r.id ?? r.name} index={i} value={r.count}>
                <span className="truncate font-[800] text-[var(--text-3)]">{r.name}</span>
              </ListItem>
            ))}
          </ListEmpty>
        </Card>

        <Card title={`🔍 ${dict.charts.topSearches}`}>
          <ListEmpty items={analytics.topSearches} empty={dict.charts.noData}>
            {analytics.topSearches.map((r, i) => (
              <ListItem key={r.query} index={i} value={r.count}>
                <span className="truncate font-[800] text-[var(--text-3)]">&ldquo;{r.query}&rdquo;</span>
              </ListItem>
            ))}
          </ListEmpty>
        </Card>

        <Card title={`🗂️ ${dict.charts.topCategories}`}>
          <ListEmpty items={analytics.topCategories} empty={dict.charts.noData}>
            {analytics.topCategories.map((r, i) => (
              <ListItem key={r.slug} index={i} value={r.count}>
                <span className="truncate font-[800] text-[var(--text-3)]">{r.name}</span>
              </ListItem>
            ))}
          </ListEmpty>
        </Card>
      </div>

      {/* Activity timeline */}
      <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
        <h3 className="text-[14px] font-[1000] text-[var(--text)]">
          🕘 {showSessions ? dict.timeline.adminTitle : dict.timeline.title}
        </h3>
        {timeline.length === 0 ? (
          <p className="mt-3 text-[12.5px] font-[850] text-[var(--muted)]">{dict.timeline.noActivity}</p>
        ) : (
          <div className="mt-4 max-h-[520px] overflow-y-auto pl-1 space-y-5">
            {timeline.map((day) => (
              <div key={day.date}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-[950] bg-[var(--soft)] text-[var(--primary)] border border-[var(--line-4)]"
                    dir="ltr"
                  >
                    📅 {fmt(day.date)}
                  </span>
                  <span className="flex-1 h-px bg-[var(--line)]" />
                </div>

                {day.sessions.map((session, si) => {
                  const first = session.events[0];
                  const last = session.events[session.events.length - 1];
                  return (
                    <div
                      key={si}
                      className="relative mr-3 pr-4 border-s-2 border-[var(--line)] ms-2"
                    >
                      {showSessions && (
                        <div className="flex items-center gap-2 flex-wrap py-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] -ms-[23px] me-1 ring-4 ring-[var(--surface)]" />
                          <span className="text-[10.5px] font-[1000] text-[var(--text-2)]">
                            🔹 {dict.timeline.session} #
                            {(session.sessionId ?? "-").slice(0, 8)}
                          </span>
                          <span className="text-[10px] font-[850] text-[var(--muted-2)]" dir="ltr">
                            {timeFmt(first.time)} → {timeFmt(last.time)} · {session.events.length}
                          </span>
                        </div>
                      )}
                      <div className={showSessions ? "py-1 space-y-1" : "space-y-1"}>
                        {session.events.map((ev, ei) => (
                          <div
                            key={ei}
                            className="relative flex items-center gap-2 flex-wrap text-[11.5px] py-0.5"
                          >
                            <span
                              className={`absolute w-1.5 h-1.5 rounded-full -ms-[21px] ${
                                ev.type === "ORDER_PLACED"
                                  ? "bg-[var(--success)]"
                                  : "bg-[var(--muted-2)]"
                              }`}
                            />
                            <span
                              className="font-[900] tabular-nums text-[var(--muted)] w-[38px]"
                              dir="ltr"
                            >
                              {timeFmt(ev.time)}
                            </span>
                            <span
                              className={`rounded-full px-2 py-[1px] text-[10px] font-[950] ${
                                EVENT_STYLES[ev.type] ?? "bg-[var(--soft)] text-[var(--primary)]"
                              }`}
                            >
                              {dict.timeline.events[ev.type] ?? ev.type}
                            </span>
                            {ev.target && (
                              <span
                                className="truncate font-[800] text-[var(--muted-3)] max-w-[280px]"
                                dir="ltr"
                                title={ev.target}
                              >
                                {ev.target}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send message */}
      <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
        <h3 className="text-[14px] font-[1000] text-[var(--text)]">
          ✉️ {dict.message.title}
        </h3>
        <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">
          {dict.message.subtitle}
        </p>

        {user.email ? (
          <>
            <p className="mt-2 text-[12px] font-[850] text-[var(--text-2)]">
              {dict.message.to}: <span dir="ltr">{user.email}</span>
            </p>

            <label className="block mt-3">
              <span className="text-[12px] font-[900] text-[var(--text-2)]">
                {dict.message.template}
              </span>
              <select
                value={template}
                onChange={(e) => applyTemplate(e.target.value)}
                className={`${inputCls} mt-1.5 appearance-none cursor-pointer`}
              >
                <option value="">{dict.message.templatePlaceholder}</option>
                {Object.entries(dict.message.templates).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mt-3">
              <span className="text-[12px] font-[900] text-[var(--text-2)]">
                {dict.message.subject}
              </span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`${inputCls} mt-1.5`}
              />
            </label>

            <label className="block mt-3">
              <span className="text-[12px] font-[900] text-[var(--text-2)]">
                {dict.message.body}
              </span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={dict.message.bodyPlaceholder}
                rows={8}
                className={`${inputCls} mt-1.5 resize-y`}
              />
            </label>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={sendMessage}
                disabled={busy || !body.trim()}
                className="rounded-[12px] text-white font-[950] px-6 py-2.5 text-[13px] shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] disabled:opacity-50"
                style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
              >
                {busy ? dict.message.sending : dict.message.send}
              </button>
            </div>

            {msg && (
              <p
                className={`mt-3 text-[12.5px] font-[850] ${
                  msg.kind === "ok" ? "text-[var(--success)]" : "text-[var(--danger)]"
                }`}
              >
                {msg.text}
              </p>
            )}
          </>
        ) : (
          <p className="mt-3 text-[12.5px] font-[850] text-[var(--muted)]">
            ⚠️ {dict.message.noEmail}
          </p>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  dir,
}: {
  label: string;
  value: React.ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-[12.5px]">
      <span className="font-[850] text-[var(--muted)] shrink-0">{label}</span>
      <span className="font-[900] text-[var(--text)] truncate" dir={dir}>
        {value || <span className="text-[var(--muted)]">—</span>}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-4">
      <div className="text-[20px]">{icon}</div>
      <p className="mt-1.5 text-[20px] font-[1000] text-[var(--text)]" dir="ltr">
        {typeof value === "number" ? value.toLocaleString("en-US") : value}
      </p>
      <p className="mt-0.5 text-[11px] font-[850] text-[var(--muted)]">{label}</p>
    </div>
  );
}

function ListEmpty({
  items,
  empty,
  children,
}: {
  items: unknown[];
  empty: string;
  children: React.ReactNode;
}) {
  if (items.length === 0) {
    return <li className="text-[12.5px] font-[800] text-[var(--muted)] py-2">{empty}</li>;
  }
  return <>{children}</>;
}

function ListItem({
  index,
  value,
  dir,
  children,
}: {
  index: number;
  value: number;
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-between gap-3 text-[12.5px]">
      <span className="flex items-center gap-2 min-w-0">
        <span className="w-5 h-5 rounded-[7px] bg-[var(--soft)] text-[var(--primary)] text-[10.5px] font-[950] flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        {children}
      </span>
      <span className="font-[950] text-[var(--text)] shrink-0" dir={dir}>
        {value.toLocaleString("en-US")}
      </span>
    </li>
  );
}
