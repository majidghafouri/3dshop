import { notFound } from "next/navigation";
import { Locale, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import prisma from "@/lib/db";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const categories = await prisma.category.findMany({
    include: {
      translations: { where: { locale } },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <CategoryManager
      dict={dict.admin.categories}
      categories={categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.translations[0]?.name ?? c.slug,
        productCount: c._count.products,
      }))}
    />
  );
}
