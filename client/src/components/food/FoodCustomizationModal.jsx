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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col font-sans border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="relative h-48 sm:h-56 bg-gray-100 shrink-0">
          <img
            src={product.imageUrl || product.img || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center backdrop-blur-md shadow-md transition"
            aria-label="Close"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
          <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.category?.name || product.category || "Special"}
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Dish Details */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h3>
              <span className="text-lg font-black text-[#ff3838] shrink-0">
                {formatCurrency(basePrice)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* 1. Size Selection */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                1. Select Portion Size
              </h4>
              <span className="text-[11px] font-semibold text-[#ff3838] bg-red-50 px-2 py-0.5 rounded-full">
                Required
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setSelectedSize("Standard")}
                className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                  selectedSize === "Standard"
                    ? "border-[#ff3838] bg-red-50/50 text-[#ff3838]"
                    : "border-gray-100 hover:border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="size"
                    checked={selectedSize === "Standard"}
                    onChange={() => setSelectedSize("Standard")}
                    className="accent-[#ff3838]"
                  />
                  <span className="text-xs font-bold">Standard</span>
                </div>
                <span className="text-xs font-bold">+ $0.00</span>
              </label>

              <label
                onClick={() => setSelectedSize("Large")}
                className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                  selectedSize === "Large"
                    ? "border-[#ff3838] bg-red-50/50 text-[#ff3838]"
                    : "border-gray-100 hover:border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="size"
                    checked={selectedSize === "Large"}
                    onChange={() => setSelectedSize("Large")}
                    className="accent-[#ff3838]"
                  />
                  <span className="text-xs font-bold">Large (Upsize)</span>
                </div>
                <span className="text-xs font-bold">+ $1.50</span>
              </label>
            </div>
          </div>

          {/* 2. Toppings Selection */}
          {product.toppings && product.toppings.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  2. Extra Toppings & Add-ons
                </h4>
                <span className="text-[11px] text-gray-400">Optional</span>
              </div>

              <div className="space-y-2">
                {product.toppings.map((topping) => {
                  const isChecked = selectedToppings.includes(topping.name);
                  return (
                    <label
                      key={topping.id || topping.name}
                      onClick={() => handleToggleTopping(topping.name)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                        isChecked
                          ? "border-[#ff3838] bg-red-50/40 text-gray-900"
                          : "border-gray-100 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTopping(topping.name)}
                          className="accent-[#ff3838] rounded w-4 h-4"
                        />
                        <span className="text-xs font-semibold">{topping.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#ff3838]">
                        +{formatCurrency(topping.priceAdjustment)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Kitchen Special Note */}
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              3. Special Cooking Instructions
            </h4>
            <textarea
              rows={2}
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              placeholder="e.g., Less spicy, no onions, extra ice..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#ff3838] outline-none transition"
            />
          </div>
        </div>

        {/* Modal Footer (Quantity & Add Button) */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity selector */}
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-sm transition"
            >
              -
            </button>
            <span className="w-8 text-center font-black text-xs text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-sm transition"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#ff7b00] to-[#ff3838] hover:from-[#ff3838] hover:to-[#e02d2d] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md shadow-red-200 transition-all flex items-center justify-between active:scale-95"
          >
            <span>Add to Cart</span>
            <span className="font-black text-sm">{formatCurrency(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCustomizationModal;
