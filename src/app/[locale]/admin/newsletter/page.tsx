import { notFound } from "next/navigation";
import { Locale, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import prisma from "@/lib/db";
import NewsletterManager from "@/components/admin/NewsletterManager";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <NewsletterManager
      dict={dict.admin.newsletter}
      subscribers={subscribers.map((s) => ({
        id: s.id,
        email: s.email,
        locale: s.locale,
        isActive: s.isActive,
        createdAt: s.createdAt.toISOString(),
        user: s.user
          ? { id: s.user.id, name: s.user.name, email: s.user.email }
          : null,
      }))}
    />
  );
}
