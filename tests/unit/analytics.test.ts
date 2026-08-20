import { describe, it, expect } from "vitest";
import { isAnalyticsEventType, ANALYTICS_EVENT_TYPES } from "@/lib/analytics";

describe("ANALYTICS_EVENT_TYPES", () => {
  it("contains all expected event types", () => {
    expect(ANALYTICS_EVENT_TYPES).toContain("PAGE_VIEW");
    expect(ANALYTICS_EVENT_TYPES).toContain("PRODUCT_VIEW");
    expect(ANALYTICS_EVENT_TYPES).toContain("CATEGORY_VIEW");
    expect(ANALYTICS_EVENT_TYPES).toContain("SEARCH");
    expect(ANALYTICS_EVENT_TYPES).toContain("ADD_TO_CART");
    expect(ANALYTICS_EVENT_TYPES).toContain("REMOVE_FROM_CART");
    expect(ANALYTICS_EVENT_TYPES).toContain("CHECKOUT_START");
    expect(ANALYTICS_EVENT_TYPES).toContain("ORDER_PLACED");
  });

  it("has 8 event types", () => {
    expect(ANALYTICS_EVENT_TYPES).toHaveLength(8);
  });
});

describe("isAnalyticsEventType", () => {
  it("returns true for valid event types", () => {
    expect(isAnalyticsEventType("PAGE_VIEW")).toBe(true);
    expect(isAnalyticsEventType("PRODUCT_VIEW")).toBe(true);
    expect(isAnalyticsEventType("SEARCH")).toBe(true);
    expect(isAnalyticsEventType("ADD_TO_CART")).toBe(true);
  });

  it("returns false for invalid event types", () => {
    expect(isAnalyticsEventType("INVALID")).toBe(false);
    expect(isAnalyticsEventType("page_view")).toBe(false);
    expect(isAnalyticsEventType("")).toBe(false);
  });
});
