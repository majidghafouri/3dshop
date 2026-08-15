import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Locale, localePrefix, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { getPaymentDeadline, PAYMENT_EXTENSION_MINUTES } from "@/lib/orders";
import PaymentCountdown from "@/components/PaymentCountdown";

export default async function PayOrderPage({
  params,
}: {
  params: { locale: string; orderId: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const prefix = localePrefix(locale);

  const user = await getSessionUser();
  if (!user) redirect(`${prefix}/auth?next=${encodeURIComponent(`${prefix}/account`)}`);

  const order = await prisma.order.findFirst({
    where: { id: params.orderId, userId: user.id },
    include: {
      items: {
        include: { product: { include: { translations: { where: { locale } } } } },
      },
    },
  });

  if (!order) {
    redirect(`${prefix}/account`);
  }

  const isPending = order.status === "PENDING";
  const isOnline = order.paymentMethod !== "CASH_ON_DELIVERY";
  const deadline = getPaymentDeadline(order);
  const remainingMs = deadline.getTime() - Date.now();
  const extended = !!order.deadlineExtendedAt;

  if (!isPending || !isOnline || remainingMs <= 0) {
    redirect(`${prefix}/account`);
  }

  const d = dict.payment;

  return (
    <div className="relative overflow-hidden py-[40px] max-sm:py-[28px]"
      style={{
        background:
          "radial-gradient(circle_at_12%_8%,rgba(var(--teal-rgb),0.10),transparent_30%), radial-gradient(circle_at_90%_10%,rgba(var(--primary-rgb),0.08),transparent_26%), linear-gradient(180deg,var(--bg),var(--bg-grad))",
      }}
    >
      <div className="container-page">
        <div className="mx-auto max-w-[560px]">
          <div className="text-center">
            <div className="mx-auto w-[64px] h-[64px] rounded-full bg-[var(--soft)] flex items-center justify-center text-[28px]">
              💳
            </div>
            <h1 className="mt-4 text-[clamp(22px,3vw,30px)] font-[1000] text-[var(--text)]">
              {d.title}
            </h1>
            <p className="mt-2 text-[13.5px] font-[750] text-[var(--muted)]">{d.subtitle}</p>
          </div>

          <div className="mt-6 bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 shadow-[0_12px_36px_rgba(20,45,90,0.06)]">
            <div className="flex items-center justify-between text-[13.5px] font-[900]">
              <span className="text-[var(--muted)]">{d.orderNumber}</span>
              <span className="text-[var(--text)]" dir="ltr">#{order.orderNumber}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[13.5px] font-[900]">
              <span className="text-[var(--muted)]">{d.total}</span>
              <span className="text-[17px] font-[1000] text-[var(--primary)]" dir="ltr">
                {order.total.toLocaleString("en-US")} {dict.common.currency}
              </span>
            </div>

            <div className="mt-4 rounded-[14px] border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3.5 text-[13px] font-[850] text-[var(--text-3)] leading-relaxed">
              🧾 {d.gatewaySoon}
            </div>

            {extended && (
              <div className="mt-3 rounded-[14px] border border-[var(--success-soft-3)] bg-[var(--success-soft)] px-4 py-3 text-[12.5px] font-[850] text-[var(--success)]">
                ✅ {d.extendNotice.replace("{minutes}", String(PAYMENT_EXTENSION_MINUTES))}
              </div>
            )}
          </div>

          <PaymentCountdown
            deadline={deadline.toISOString()}
            label={d.deadline}
            expiredLabel={d.deadlineExpired}
          />

          <div className="mt-6 flex justify-center">
            <Link
              href={`${prefix}/account`}
              className="rounded-[14px] font-[950] px-6 py-3 text-[13px] border border-[var(--line-2)] bg-[var(--surface)] text-[var(--text-2)] hover:border-[var(--primary)] transition-all"
            >
              {d.backToAccount}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
