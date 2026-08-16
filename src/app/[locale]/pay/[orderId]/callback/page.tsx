import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Locale, localePrefix, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { verifyVandarPayment } from "@/lib/vandar";

interface CallbackPageProps {
  params: { locale: string; orderId: string };
  searchParams: { token?: string; payment_status?: string };
}

export const dynamic = "force-dynamic";

export default async function PaymentCallbackPage({ params, searchParams }: CallbackPageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const prefix = localePrefix(locale);

  const user = await getSessionUser();
  if (!user) redirect(`${prefix}/auth?next=${encodeURIComponent(`${prefix}/account`)}`);

  const orderId = params.orderId;
  const token = searchParams.token;
  const paymentStatus = searchParams.payment_status;

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: user.id },
  });
  if (!order) redirect(`${prefix}/account`);

  const d = dict.payment;

  let paid = false;
  let failedMessage: string | null = null;

  if (order.paidAt) {
    paid = true;
  } else if (paymentStatus === "OK" && token) {
    const result = await verifyVandarPayment(token);
    if (result.ok) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
          paymentToken: token,
        },
      });
      paid = true;
    } else {
      failedMessage = result.error;
    }
  } else if (paymentStatus === "FAILED") {
    failedMessage = "payment_failed_by_user";
  }

  if (paid) {
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
              <div className="mx-auto w-[64px] h-[64px] rounded-full bg-[var(--success-soft)] flex items-center justify-center text-[28px]">
                ✅
              </div>
              <h1 className="mt-4 text-[clamp(22px,3vw,30px)] font-[1000] text-[var(--text)]">
                {d.verifySuccess}
              </h1>
              <p className="mt-2 text-[13.5px] font-[750] text-[var(--muted)]">
                {d.verifySuccessDesc}
              </p>
              <div className="mt-4 rounded-[14px] border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3.5 text-[13px] font-[850] text-[var(--text-3)]">
                💳 {d.cardMasked}: {order.total.toLocaleString("en-US")} {dict.common.currency}
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <Link
                href={`${prefix}/account`}
                className="w-full flex items-center justify-center rounded-[16px] text-white font-[950] px-8 py-4 text-[15px] shadow-[0_14px_34px_rgba(var(--primary-rgb),0.25)] hover:-translate-y-0.5 transition-all duration-300"
                style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
              >
                {d.backToAccount}
              </Link>
              <Link
                href={`${prefix}/products`}
                className="rounded-[14px] font-[950] px-6 py-3 text-[13px] border border-[var(--line-2)] bg-[var(--surface)] text-[var(--text-2)] hover:border-[var(--primary)] transition-all"
              >
                {dict.products.viewAll}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="mx-auto w-[64px] h-[64px] rounded-full bg-[var(--danger-soft)] flex items-center justify-center text-[28px]">
              ❌
            </div>
            <h1 className="mt-4 text-[clamp(22px,3vw,30px)] font-[1000] text-[var(--text)]">
              {d.verifyFailed}
            </h1>
            <p className="mt-2 text-[13.5px] font-[750] text-[var(--muted)]">
              {failedMessage ?? d.verifyFailedDesc}
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              href={`${prefix}/pay/${orderId}`}
              className="w-full flex items-center justify-center rounded-[16px] text-white font-[950] px-8 py-4 text-[15px] shadow-[0_14px_34px_rgba(var(--primary-rgb),0.25)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
            >
              {d.retryPayment}
            </Link>
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
