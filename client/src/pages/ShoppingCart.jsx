import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../store/cartContext";
import { formatCurrency } from "../utils/formatCurrency";
import Toast from "../components/ui/Toast";

const ShoppingCart = () => {
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    subtotal,
    shippingFee,
    appliedVoucher,
    voucherDiscount,
    total,
    applyVoucher,
    removeVoucher,
  } = useContext(CartContext);

  const [voucherCodeInput, setVoucherCodeInput] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;

    setVoucherLoading(true);
    const res = await applyVoucher(voucherCodeInput.trim());
    setVoucherLoading(false);

    if (res.success) {
      setToast({
        type: "success",
        message: `Applied coupon ${voucherCodeInput.toUpperCase()} successfully!`,
      });
      setVoucherCodeInput("");
    } else {
      setToast({
        type: "error",
        message: res.message || "Invalid or expired promo code.",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-20 px-4 font-sans text-center">
        <div className="w-24 h-24 bg-red-50 text-[#ff3838] rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">
          <i className="fas fa-shopping-basket"></i>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-md">
          Looks like you haven't added any delicious food yet. Discover our menu and treat yourself!
        </p>
        <Link
          to="/menu"
          className="px-8 py-3.5 bg-[#ff3838] text-white font-extrabold rounded-full hover:bg-[#e02d2d] transition shadow-lg shadow-red-200 text-sm active:scale-95"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#0d1b2a]">
              Your <span className="text-[#ff3838]">Shopping Cart</span>
            </h1>
            <p className="text-gray-500 text-xs mt-1">
              Review your items before proceeding to checkout ({items.length} items).
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-gray-400 hover:text-red-600 transition flex items-center gap-1.5"
          >
            <i className="fas fa-trash-alt"></i> Clear All Items
          </button>
        </div>

        {/* 2-Column Layout: Items List & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.cartItemId || item.id}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition"
              >
                {/* Image & Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl || item.img || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-gray-100"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">
                      {item.name}
                    </h3>
                    <div className="text-xs text-gray-500 space-x-2 mt-0.5">
                      <span className="font-bold text-[#ff3838]">
                        {formatCurrency(item.price)}
                      </span>
                      {item.options?.size && item.options?.size !== "Standard" && (
                        <span className="text-blue-600 font-semibold">
                          • Size: {item.options.size}
                        </span>
                      )}
                    </div>

                    {/* Toppings list */}
                    {item.options?.toppings && item.options.toppings.length > 0 && (
                      <p className="text-[11px] text-gray-400 mt-1">
                        + Toppings: {item.options.toppings.join(", ")}
                      </p>
                    )}

                    {/* Note */}
                    {item.options?.itemNote && (
                      <p className="text-[11px] text-amber-600 italic mt-0.5">
                        Note: "{item.options.itemNote}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity & Item Total & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                  {/* Quantity modifier */}
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                    <button
                      onClick={() => updateQty(item.cartItemId, (item.qty || 1) - 1)}
                      className="w-7 h-7 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center text-xs transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-gray-900">
                      {item.qty || 1}
                    </span>
                    <button
                      onClick={() => updateQty(item.cartItemId, (item.qty || 1) + 1)}
                      className="w-7 h-7 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center text-xs transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Total price for this item */}
                  <span className="font-black text-base text-gray-900 min-w-[80px] text-right">
                    {formatCurrency((item.price || 0) * (item.qty || 1))}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="w-8 h-8 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                    title="Remove item"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary & Voucher */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Promo / Voucher Box */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <i className="fas fa-ticket-alt text-[#ff3838]"></i>
                <span>Promo Code & Coupons</span>
              </h3>

              {appliedVoucher ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-emerald-800">
                        {appliedVoucher.code}
                      </span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Applied
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-1">
                      Discount: -{formatCurrency(voucherDiscount)}
                    </p>
                  </div>
                  <button
                    onClick={removeVoucher}
                    className="text-xs font-bold text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g., WELCOME50)"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-mono uppercase text-gray-800 outline-none focus:bg-white focus:border-[#ff3838]"
                  />
                  <button
                    type="submit"
                    disabled={voucherLoading}
                    className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    {voucherLoading ? "..." : "Apply"}
                  </button>
                </form>
              )}

              {/* Suggestions */}
              <div className="text-[11px] text-gray-400 space-y-1 pt-1">
                <p className="font-semibold text-gray-500">Available Coupons:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span
                    onClick={() => setVoucherCodeInput("WELCOME50")}
                    className="cursor-pointer bg-red-50 hover:bg-red-100 text-[#ff3838] px-2 py-1 rounded-lg font-mono font-bold"
                  >
                    WELCOME50
                  </span>
                  <span
                    onClick={() => setVoucherCodeInput("LOVEFOOD5")}
                    className="cursor-pointer bg-red-50 hover:bg-red-100 text-[#ff3838] px-2 py-1 rounded-lg font-mono font-bold"
                  >
                    LOVEFOOD5
                  </span>
                  <span
                    onClick={() => setVoucherCodeInput("FREESHIP")}
                    className="cursor-pointer bg-red-50 hover:bg-red-100 text-[#ff3838] px-2 py-1 rounded-lg font-mono font-bold"
                  >
                    FREESHIP
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">{formatCurrency(shippingFee)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Promo</span>
                    <span>-{formatCurrency(voucherDiscount)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between items-baseline text-gray-900 font-black">
                  <span className="text-sm">Total Amount</span>
                  <span className="text-2xl text-[#ff3838]">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-gradient-to-r from-[#ff7b00] to-[#ff3838] hover:from-[#ff3838] hover:to-[#e02d2d] text-white font-black text-sm rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-95 mt-4"
              >
                <span>Proceed to Checkout</span>
                <i className="fas fa-arrow-right text-xs"></i>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
