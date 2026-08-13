import { notFound } from "next/navigation";
import { Locale, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import SettingsManager from "@/components/admin/SettingsManager";
import OtpChannelManager from "@/components/admin/OtpChannelManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <div>
      <OtpChannelManager dict={dict.admin.otpChannel} />
      <div className="mt-6">
        <SettingsManager dict={dict.admin.settings} />
      </div>
    </div>
  );
}
