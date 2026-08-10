"use client";

const SESSION_KEY = "figurize_analytics_session";

export type ClientEventType =
  | "PAGE_VIEW"
  | "PRODUCT_VIEW"
  | "CATEGORY_VIEW"
  | "SEARCH"
  | "ADD_TO_CART"
  | "REMOVE_FROM_CART"
  | "CHECKOUT_START";

type ClientEventData = {
  path?: string;
  productId?: string;
  categorySlug?: string;
  query?: string;
};

function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function trackClient(type: ClientEventType, data: ClientEventData = {}) {
  try {
    const payload = {
      type,
      path: data.path ?? window.location.pathname,
      productId: data.productId,
      categorySlug: data.categorySlug,
      query: data.query,
      sessionId: getSessionId(),
    };
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // fire-and-forget
    });
  } catch {
    // ignore tracking errors
  }
}
