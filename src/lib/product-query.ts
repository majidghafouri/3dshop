import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Locale } from "@/lib/i18n";
import { mapProduct, productInclude } from "@/lib/shop";

export type ProductFilters = {
  locale: Locale;
  category?: string;
  brand?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  discounted?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  perPage?: number;
};

export async function getProductBrands() {
  const rows = await prisma.product.groupBy({
    by: ["brand"],
    where: { isActive: true, brand: { not: null } },
    _count: { _all: true },
  });
  return rows
    .filter((r) => r.brand)
    .map((r) => ({ brand: r.brand as string, count: r._count._all }))
    .sort((a, b) => a.brand.localeCompare(b.brand));
}

export async function queryProducts(filters: ProductFilters) {
  const {
    locale,
    category,
    brand,
    brands,
    minPrice,
    maxPrice,
    inStock,
    discounted,
    search,
    sort = "newest",
    page = 1,
    perPage = 24,
  } = filters;

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (category) {
    where.category = { slug: category };
  }
  if (brand) {
    where.brand = brand;
  }
  if (brands && brands.length > 0) {
    where.brand = { in: brands };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (inStock) {
    where.stock = { gt: 0 };
  }
  if (discounted) {
    where.hasDiscount = true;
  }
  if (search) {
    where.translations = {
      some: { locale, name: { contains: search, mode: "insensitive" } },
    };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
  switch (sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "discount":
      orderBy = [{ hasDiscount: "desc" }, { compareAtPrice: "desc" }];
      break;
    case "popular":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude(locale),
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => mapProduct(p)),
    total,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}
