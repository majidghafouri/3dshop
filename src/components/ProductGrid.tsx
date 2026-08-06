import { Locale } from "@/lib/i18n";
import { Dictionary } from "@/lib/i18n-dictionaries";
import { ProductItem } from "@/lib/shop";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({
  products,
  locale,
  dict,
}: {
  products: ProductItem[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[15px]">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
      ))}
    </div>
  );
}
