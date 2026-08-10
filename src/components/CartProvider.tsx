"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { trackClient } from "@/lib/client-analytics";

export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  stock: number;
  brand: string | null;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
  lastAdded: CartItem | null;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setItems(json.data.items ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const json = await res.json();
      if (!json.ok) return false;
      setItems(json.data.items ?? []);
      const added = json.data.items?.find(
        (i: CartItem) => i.product.id === productId
      );
      if (added) setLastAdded(added);
      trackClient("ADD_TO_CART", { productId });
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const json = await res.json();
      if (json.ok) setItems(json.data.items ?? []);
    } catch {
      // ignore
    }
  }, []);

  const removeItem = useCallback(
    async (itemId: string) => {
      const removed = items.find((i) => i.id === itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      try {
        const res = await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
        const json = await res.json();
        if (json.ok) setItems(json.data.items ?? []);
        if (removed) trackClient("REMOVE_FROM_CART", { productId: removed.product.id });
      } catch {
        // ignore
      }
    },
    [items]
  );

  const { count, subtotal } = useMemo(() => {
    return {
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: items.reduce((s, i) => s + i.quantity * i.product.price, 0),
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      refresh,
      lastAdded,
    }),
    [items, count, subtotal, loading, addToCart, updateQuantity, removeItem, refresh, lastAdded]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
