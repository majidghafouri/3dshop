import { describe, it, expect } from "vitest";
import { mapProduct, buildCategoryTree } from "@/lib/shop";
import type { LocaleProduct } from "@/lib/shop";

function makeProduct(overrides: Partial<LocaleProduct> = {}): LocaleProduct {
  return {
    id: "prod1",
    slug: "test-product",
    sku: "SKU-001",
    brand: "TestBrand",
    price: 100000,
    compareAtPrice: null,
    stock: 10,
    isActive: true,
    isFeatured: false,
    isSpecial: false,
    hasDiscount: false,
    heightCm: null,
    material: null,
    weightGrams: null,
    images: [],
    musicUrl: null,
    musicTitle: null,
    createdAt: new Date(),
    translations: [
      {
        locale: "fa",
        name: "محصول تست",
        shortDescription: "توضیح کوتاه",
        description: "توضیح کامل",
        features: null,
      },
    ],
    category: {
      slug: "test-cat",
      translations: [{ locale: "fa", name: "دسته تست" }],
    },
    ...overrides,
  };
}

describe("mapProduct", () => {
  it("maps a full product correctly", () => {
    const product = makeProduct();
    const result = mapProduct(product);
    expect(result.id).toBe("prod1");
    expect(result.name).toBe("محصول تست");
    expect(result.price).toBe(100000);
    expect(result.category).toEqual({ slug: "test-cat", name: "دسته تست" });
  });

  it("handles null category", () => {
    const product = makeProduct({ category: null });
    const result = mapProduct(product);
    expect(result.category).toBeNull();
  });

  it("handles missing translations", () => {
    const product = makeProduct({ translations: [] });
    const result = mapProduct(product);
    expect(result.name).toBe("");
  });

  it("parses features JSON string", () => {
    const product = makeProduct({
      translations: [
        {
          locale: "fa",
          name: "Test",
          shortDescription: null,
          description: null,
          features: '["feature1","feature2"]',
        },
      ],
    });
    const result = mapProduct(product);
    expect(result.features).toEqual(["feature1", "feature2"]);
  });

  it("returns null features when not set", () => {
    const product = makeProduct();
    const result = mapProduct(product);
    expect(result.features).toBeNull();
  });

  it("uses slug as fallback category name", () => {
    const product = makeProduct({
      category: {
        slug: "test-cat",
        translations: [],
      },
    });
    const result = mapProduct(product);
    expect(result.category?.name).toBe("test-cat");
  });
});

describe("buildCategoryTree", () => {
  it("builds tree from flat categories", () => {
    const cats = [
      { id: "1", parentId: null, slug: "a", name: "A", image: null },
      { id: "2", parentId: "1", slug: "b", name: "B", image: null },
    ];
    const tree = buildCategoryTree(cats);
    expect(tree).toHaveLength(1);
    expect(tree[0].slug).toBe("a");
  });

  it("returns empty array for empty input", () => {
    expect(buildCategoryTree([])).toEqual([]);
  });

  it("handles multiple root categories", () => {
    const cats = [
      { id: "1", parentId: null, slug: "a", name: "A", image: null },
      { id: "2", parentId: null, slug: "b", name: "B", image: null },
    ];
    const tree = buildCategoryTree(cats);
    expect(tree).toHaveLength(2);
  });
});
