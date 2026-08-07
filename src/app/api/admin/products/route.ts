import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson, requireAdmin } from "@/lib/api";
import { Locale } from "@/lib/i18n";

type ProductPayload = {
  slug?: string;
  sku?: string;
  categorySlug?: string;
  brand?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isSpecial?: boolean;
  heightCm?: string;
  material?: string;
  weightGrams?: number;
  images?: string[];
  musicUrl?: string;
  musicTitle?: string;
  name?: Record<string, string>;
  shortDescription?: Record<string, string>;
  description?: Record<string, string>;
  features?: Record<string, string[]>;
};

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const products = await prisma.product.findMany({
    include: { translations: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return ok({ products });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = parseJson<ProductPayload>(await req.text());
  if (!body?.slug || !body?.name) return fail("missing_fields");

  const locales: Locale[] = ["fa", "en", "ar"];
  const category = body.categorySlug
    ? await prisma.category.findUnique({ where: { slug: body.categorySlug } })
    : null;

  const slug = body.slug;
  const name = body.name;

  const product = await prisma.product.create({
    data: {
      slug,
      sku: body.sku || undefined,
      categoryId: category?.id ?? null,
      brand: body.brand || null,
      price: Math.round(body.price ?? 0),
      compareAtPrice: body.compareAtPrice ? Math.round(body.compareAtPrice) : null,
      stock: Math.max(0, Math.round(body.stock ?? 0)),
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      isSpecial: body.isSpecial ?? false,
      hasDiscount: !!(
        body.compareAtPrice && body.compareAtPrice > (body.price ?? 0)
      ),
      heightCm: body.heightCm ?? null,
      material: body.material ?? null,
      weightGrams: body.weightGrams ?? null,
      images: body.images?.filter(Boolean) ?? [],
      musicUrl: body.musicUrl?.trim() || null,
      musicTitle: body.musicTitle?.trim() || null,
      translations: {
        create: locales.map((loc) => ({
          locale: loc,
          name: name[loc]?.trim() || name.fa?.trim() || slug,
          shortDescription: body.shortDescription?.[loc]?.trim() || null,
          description: body.description?.[loc]?.trim() || null,
          features: body.features?.[loc]?.length
            ? JSON.stringify(body.features[loc])
            : null,
        })),
      },
    },
    include: { translations: true },
  });

  return ok({ product }, 201);
}
