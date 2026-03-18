import { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext(null);

const CART_KEY = "sfo_cart_v1";

const readCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const found = prev.find((x) => x.slug === product.slug);
      if (found) {
        return prev.map((x) =>
          x.slug === product.slug ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (slug, qty) => {
    setItems((prev) =>
      prev
        .map((x) => (x.slug === slug ? { ...x, qty } : x))
        .filter((x) => x.qty > 0)
    );
  };

  const removeItem = (slug) => setItems((prev) => prev.filter((x) => x.slug !== slug));
  const clear = () => setItems([]);

  const value = useMemo(
    () => ({ items, addItem, updateQty, removeItem, clear }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
