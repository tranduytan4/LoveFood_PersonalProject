import { createContext, useState, useEffect } from "react";
import { voucherApi } from "../api/voucher.api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("smart_food_cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [appliedVoucher, setAppliedVoucher] = useState(() => {
    const saved = localStorage.getItem("smart_food_voucher");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("smart_food_cart", JSON.stringify(items));
  }, [items]);

  // Recalculate subtotal
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);
  const shippingFee = items.length > 0 ? 2.50 : 0;

  // Re-verify voucher whenever subtotal changes
  useEffect(() => {
    if (appliedVoucher && subtotal > 0) {
      voucherApi
        .apply(appliedVoucher.code, subtotal)
        .then((res) => {
          if (res.data?.data?.valid) {
            setVoucherDiscount(res.data.data.discountAmount);
          } else {
            setAppliedVoucher(null);
            setVoucherDiscount(0);
            localStorage.removeItem("smart_food_voucher");
          }
        })
        .catch(() => {
          setAppliedVoucher(null);
          setVoucherDiscount(0);
          localStorage.removeItem("smart_food_voucher");
        });
    } else {
      setVoucherDiscount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, appliedVoucher?.code]);

  const total = Math.max(0, subtotal + shippingFee - voucherDiscount);

  const addItem = (product, options = {}) => {
    const {
      size = "Standard",
      sizePrice = 0,
      toppings = [],
      note = "",
      itemNote = "",
      qty = 1,
      quantity = 1,
    } = options;

    const finalQty = Number(options.quantity || options.qty || qty || quantity || 1);
    const finalNote = note || itemNote || "";

    // Normalize toppings to always be an array of objects
    const normalizedToppings = toppings.map((t) => {
      if (typeof t === "string") {
        const found = product.toppings?.find((pt) => pt.name === t);
        return {
          name: t,
          priceAdjustment: found ? Number(found.priceAdjustment) : 0,
        };
      }
      return {
        name: t.name || "",
        priceAdjustment: Number(t.priceAdjustment || 0),
      };
    });

    const calculatedSizePrice = Number(
      sizePrice || (size === "Large" ? 1.50 : 0)
    );
    const toppingsPrice = normalizedToppings.reduce(
      (acc, t) => acc + (t.priceAdjustment || 0),
      0
    );
    const unitPrice = (Number(product.price) || 0) + calculatedSizePrice + toppingsPrice;

    // Create a deterministic unique cart key based on product + size + sorted toppings
    const toppingKey = normalizedToppings
      .map((t) => t.name)
      .sort()
      .join("-");
    const cartItemId = `${product.id || product.slug}-${size}-${toppingKey}-${finalNote.trim()}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex].qty += finalQty;
        return next;
      }

      const newItem = {
        cartItemId,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category?.name || product.category || "Món ngon",
        imageUrl: product.imageUrl || product.img || "",
        basePrice: Number(product.price) || 0,
        price: unitPrice,
        size,
        sizePrice: calculatedSizePrice,
        toppings: normalizedToppings,
        note: finalNote,
        qty: finalQty,
      };
      return [...prevItems, newItem];
    });
  };

  const updateQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, qty: newQty } : item))
    );
  };

  const removeItem = (cartItemId) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clear = () => {
    setItems([]);
    setAppliedVoucher(null);
    setVoucherDiscount(0);
    localStorage.removeItem("smart_food_cart");
    localStorage.removeItem("smart_food_voucher");
  };

  const applyVoucher = async (code) => {
    if (!code || !code.trim()) {
      return { success: false, message: "Please enter a coupon code." };
    }
    try {
      const res = await voucherApi.apply(code.trim(), subtotal);
      if (res.data?.data?.valid) {
        const vData = {
          code: res.data.data.code,
          voucherId: res.data.data.voucherId,
        };
        setAppliedVoucher(vData);
        setVoucherDiscount(res.data.data.discountAmount);
        localStorage.setItem("smart_food_voucher", JSON.stringify(vData));
        return {
          success: true,
          message: `Coupon ${res.data.data.code} applied! Saved $${res.data.data.discountAmount.toFixed(2)}`,
        };
      }
      return { success: false, message: res.data?.message || "Invalid coupon code" };
    } catch (err) {
      const message = err.response?.data?.message || "Coupon code is invalid or does not meet minimum order requirements";
      return { success: false, message };
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherDiscount(0);
    localStorage.removeItem("smart_food_voucher");
  };

  const reorder = (orderItems = []) => {
    clear();
    orderItems.forEach((item) => {
      const options = typeof item.options === "string" ? JSON.parse(item.options) : item.options || {};
      addItem(
        {
          id: item.productId,
          slug: item.productId ? `p-${item.productId}` : "custom-dish",
          name: item.name || item.product_name,
          price: item.price || item.product_price,
          imageUrl: item.imageUrl || "",
          category: "Reordered",
        },
        {
          size: options.size || "Standard",
          toppings: (options.toppings || []).map((t) => (typeof t === "string" ? { name: t, priceAdjustment: 0 } : t)),
          note: options.itemNote || "",
          qty: item.quantity || 1,
        }
      );
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        shippingFee,
        discountAmount: voucherDiscount,
        voucherDiscount,
        total,
        appliedVoucher,
        addItem,
        updateQty,
        removeItem,
        clear,
        clearCart: clear,
        applyVoucher,
        removeVoucher,
        reorder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
