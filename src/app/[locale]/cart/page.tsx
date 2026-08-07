import { notFound } from "next/navigation";
import { Locale, localePrefix, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import CartClient from "@/components/CartClient";

export default async function CartPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const prefix = localePrefix(locale);

  return (
    <div className="relative overflow-hidden py-[40px] max-sm:py-[28px]"
      style={{
        background:
          "radial-gradient(circle_at_12%_8%,rgba(var(--teal-rgb),0.10),transparent_30%), linear-gradient(180deg,var(--bg),var(--bg-grad))",
      }}
    >
      <div className="container-page">
        <CartClient dict={dict} prefix={prefix} />
      </div>
    </div>
  );
}
