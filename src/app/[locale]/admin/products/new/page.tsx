import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale, localePrefix, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import prisma from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const prefix = localePrefix(locale);
  const dict = getDictionary(locale);
  const p = dict.admin.products;

  const categories = await prisma.category.findMany({
    include: { translations: { where: { locale } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <Link href={`${prefix}/admin/products`} className="text-[13px] font-[950] text-[var(--primary)] hover:underline">
        ← {p.back}
      </Link>
      <h2 className="mt-2 text-[18px] font-[1000] text-[var(--text)]">{p.newTitle}</h2>
      <div className="mt-4">
        <ProductForm
          isEdit={false}
          dict={p}
          redirectHref={`${prefix}/admin/products`}
          categories={categories.map((c) => ({
            slug: c.slug,
            name: c.translations[0]?.name ?? c.slug,
          }))}
        />
      </div>
    </div>
  );
}
