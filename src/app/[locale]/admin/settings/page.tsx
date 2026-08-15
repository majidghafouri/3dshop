import { notFound } from "next/navigation";
import { Locale, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import ContactSettingsManager from "@/components/admin/ContactSettingsManager";
import ContactMessagesManager from "@/components/admin/ContactMessagesManager";
import SettingsManager from "@/components/admin/SettingsManager";
import EmailSettingsManager from "@/components/admin/EmailSettingsManager";

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
      <EmailSettingsManager dict={dict.admin.emailSettings} />
      <div className="mt-6">
        <ContactSettingsManager dict={dict.admin.contactSettings} />
      </div>
      <div className="mt-6">
        <ContactMessagesManager dict={dict.admin.contactMessages} />
      </div>
      <div className="mt-6">
        <SettingsManager dict={dict.admin.settings} />
      </div>
    </div>
  );
}
