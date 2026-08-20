import { notFound } from "next/navigation";
import { Locale, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import SendEmailCard from "@/components/admin/SendEmailCard";
import EmailSettingsManager from "@/components/admin/EmailSettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminEmailPage({
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
      <SendEmailCard dict={dict.admin.sendEmail} />
    </div>
  );
}
