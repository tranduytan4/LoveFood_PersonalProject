import React, { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

const FoodCustomizationModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [itemNote, setItemNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Reset state when modal opens with a new product
  useEffect(() => {
    if (product) {
      setSelectedSize("Standard");
      setSelectedToppings([]);
      setItemNote("");
      setQuantity(1);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const basePrice = Number(product.price) || 0;
  const sizePrice = selectedSize === "Large" ? 1.50 : 0;

  // Calculate topping additional prices
  const toppingsPrice = selectedToppings.reduce((sum, toppingName) => {
    const found = product.toppings?.find((t) => t.name === toppingName);
    return sum + (found ? Number(found.priceAdjustment) : 0);
  }, 0);

  const unitPrice = basePrice + sizePrice + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const handleToggleTopping = (toppingName) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((t) => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleAdd = () => {
    onAddToCart(product, {
      size: selectedSize,
      toppings: selectedToppings,
      itemNote: itemNote.trim(),
      unitPrice,
      quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col font-sans border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header Media */}
        <div className="relative h-48 sm:h-56 bg-slate-100 shrink-0 overflow-hidden">
          <img
            src={product.imageUrl || product.img || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-md shadow-md transition-all active:scale-95"
            aria-label="Close"
          >
            <i className="fas fa-times text-sm"></i>
          </button>

          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              {product.category?.name || product.category || "Signature Dish"}
            </span>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* Dish Details */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h3>
              <span className="text-xl font-black text-[#ff3838] shrink-0 tabular-nums">
                {formatCurrency(basePrice)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* 1. Size Selection */}
          <div className="space-y-3 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 1</span>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Select Portion Size
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#ff3838] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                Required
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setSelectedSize("Standard")}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  selectedSize === "Standard"
                    ? "border-[#ff3838] bg-red-50/40 text-slate-900 shadow-sm"
                    : "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="size"
                    checked={selectedSize === "Standard"}
                    onChange={() => setSelectedSize("Standard")}
                    className="accent-[#ff3838]"
                  />
                  <span className="text-xs font-bold">Standard</span>
                </div>
                <span className="text-[11px] font-bold text-slate-500">+ $0.00</span>
              </label>

              <label
                onClick={() => setSelectedSize("Large")}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  selectedSize === "Large"
                    ? "border-[#ff3838] bg-red-50/40 text-slate-900 shadow-sm"
                    : "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="size"
                    checked={selectedSize === "Large"}
                    onChange={() => setSelectedSize("Large")}
                    className="accent-[#ff3838]"
                  />
                  <span className="text-xs font-bold">Large (Upsize)</span>
                </div>
                <span className="text-[11px] font-black text-[#ff3838]">+ $1.50</span>
              </label>
            </div>
          </div>

          {/* 2. Toppings Selection */}
          {product.toppings && product.toppings.length > 0 && (
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 2</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Extra Toppings & Add-ons
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Optional</span>
              </div>

              <div className="space-y-2">
                {product.toppings.map((topping) => {
                  const isChecked = selectedToppings.includes(topping.name);
                  return (
                    <label
                      key={topping.id || topping.name}
                      onClick={() => handleToggleTopping(topping.name)}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? "border-[#ff3838] bg-red-50/30 text-slate-900 shadow-sm"
                          : "border-slate-100 hover:border-slate-200 bg-slate-50/40 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTopping(topping.name)}
                          className="accent-[#ff3838] rounded-md w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-slate-800">{topping.name}</span>
                      </div>
                      <span className="text-xs font-black text-[#ff3838] tabular-nums">
                        +{formatCurrency(topping.priceAdjustment)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Kitchen Special Note */}
          <div className="space-y-2.5 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 3</span>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Special Cooking Instructions
              </h4>
            </div>
            <textarea
              rows={2}
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              placeholder="e.g., Less spicy, no onions, sauce on the side..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] outline-none transition"
            />
          </div>
        </div>

        {/* Modal Footer (Quantity & Add Button) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-black flex items-center justify-center text-sm transition active:scale-95"
            >
              -
            </button>
            <span className="w-8 text-center font-black text-xs text-slate-900 tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-black flex items-center justify-center text-sm transition active:scale-95"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#ff7b00] to-[#ff3838] hover:from-[#ff3838] hover:to-[#e02d2d] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md shadow-red-200 transition-all flex items-center justify-between active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <i className="fas fa-cart-plus"></i>
              <span>Add to Cart</span>
            </span>
            <span className="font-black text-sm tabular-nums">{formatCurrency(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCustomizationModal;
