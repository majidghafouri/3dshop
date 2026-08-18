import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale, localePrefix, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getSessionUser } from "@/lib/auth";
import CheckoutClient from "@/components/CheckoutClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "fa";
  const dict = getDictionary(locale);
  return buildMetadata({
    title: dict.checkout.title,
    description: dict.checkout.shippingInfo,
    path: `${localePrefix(locale)}/checkout`,
    locale,
    noindex: true,
  });
}

export default async function CheckoutPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const prefix = localePrefix(locale);

  const user = await getSessionUser();

  return (
    <div className="relative overflow-hidden py-[40px] max-sm:py-[28px]"
      style={{
        background:
          "radial-gradient(circle_at_12%_8%,rgba(var(--teal-rgb),0.10),transparent_30%), radial-gradient(circle_at_90%_10%,rgba(var(--primary-rgb),0.08),transparent_26%), linear-gradient(180deg,var(--bg),var(--bg-grad))",
      }}
    >
      <div className="container-page">
        <CheckoutClient
          dict={dict}
          prefix={prefix}
          isAuthed={!!user}
          userName={user?.name ?? undefined}
          userPhone={user?.phone ?? undefined}
        />
      </div>
    </div>
  );
}
