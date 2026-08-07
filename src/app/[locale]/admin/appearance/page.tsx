import { notFound } from "next/navigation";
import { Locale, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import { getSiteTheme, PRESETS, DEFAULT_PALETTE } from "@/lib/siteTheme";
import ThemeEditor from "@/components/admin/ThemeEditor";

export const dynamic = "force-dynamic";

export default async function AdminAppearancePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const palette = (await getSiteTheme()) ?? DEFAULT_PALETTE;

  return (
    <ThemeEditor initial={palette} presets={PRESETS} dict={dict.admin.appearance} />
  );
}
