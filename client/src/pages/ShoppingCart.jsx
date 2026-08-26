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
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center py-20 px-4 font-sans text-center">
        <div className="w-24 h-24 bg-white border border-slate-200/80 text-[#ff3838] rounded-3xl flex items-center justify-center mb-6 text-4xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)]">
          <i className="fas fa-shopping-basket"></i>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-8 max-w-md font-medium">
          Looks like you haven't added any dishes yet. Discover our chef special burgers, pizzas, and drinks!
        </p>
        <Link
          to="/menu"
          className="px-8 py-3.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-black rounded-2xl transition-all shadow-lg shadow-red-200 text-xs sm:text-sm active:scale-[0.98]"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-8 font-sans selection:bg-red-500 selection:text-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff3838] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
              Order Review
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Your <span className="text-[#ff3838]">Shopping Cart</span>
            </h1>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              Review your items and apply vouchers before proceeding to delivery ({items.length} items).
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-slate-400 hover:text-red-600 transition flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-red-50"
          >
            <i className="fas fa-trash-alt text-[10px]"></i>
            <span>Clear Cart</span>
          </button>
        </div>

        {/* 2-Column Layout: Items List & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.cartItemId || item.id}
                className="bg-white rounded-3xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all group"
              >
                {/* Image & Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl || item.img || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                  />
                  <div className="space-y-1">
                    <h3 className="font-black text-base text-slate-900 group-hover:text-[#ff3838] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-black text-[#ff3838] tabular-nums">
                        {formatCurrency(item.price)}
                      </span>
                      {item.options?.size && item.options?.size !== "Standard" && (
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          Size: {item.options.size}
                        </span>
                      )}
                    </div>

                    {/* Toppings list */}
                    {item.options?.toppings && item.options.toppings.length > 0 && (
                      <p className="text-[11px] text-slate-400 font-medium">
                        + {item.options.toppings.join(", ")}
                      </p>
                    )}

                    {/* Note */}
                    {item.options?.itemNote && (
                      <p className="text-[11px] text-amber-600 font-medium italic">
                        Note: "{item.options.itemNote}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity & Item Total & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                  {/* Quantity modifier pill */}
                  <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-1 shadow-inner">
                    <button
                      onClick={() => updateQty(item.cartItemId, (item.qty || 1) - 1)}
                      className="w-7 h-7 rounded-xl bg-white text-slate-700 font-black hover:bg-slate-100 flex items-center justify-center text-xs transition active:scale-95 shadow-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-black text-xs text-slate-900 tabular-nums">
                      {item.qty || 1}
                    </span>
                    <button
                      onClick={() => updateQty(item.cartItemId, (item.qty || 1) + 1)}
                      className="w-7 h-7 rounded-xl bg-white text-slate-700 font-black hover:bg-slate-100 flex items-center justify-center text-xs transition active:scale-95 shadow-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Total price for this item */}
                  <span className="font-black text-base text-slate-900 min-w-[75px] text-right tabular-nums">
                    {formatCurrency((item.price || 0) * (item.qty || 1))}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition"
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
            <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <i className="fas fa-ticket-alt text-[#ff3838]"></i>
                <span>Promo Code & Coupons</span>
              </h3>

              {appliedVoucher ? (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-emerald-900">
                        {appliedVoucher.code}
                      </span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 font-black px-2 py-0.5 rounded-full">
                        Applied
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-1 font-medium">
                      Savings: -{formatCurrency(voucherDiscount)}
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
                    placeholder="e.g., WELCOME50"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono uppercase text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-bold"
                  />
                  <button
                    type="submit"
                    disabled={voucherLoading}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-[#ff3838] text-white font-bold rounded-2xl text-xs transition active:scale-95 disabled:opacity-50 shadow-sm"
                  >
                    {voucherLoading ? "..." : "Apply"}
                  </button>
                </form>
              )}

              {/* Suggestions Chips */}
              <div className="text-[11px] text-slate-400 space-y-1.5 pt-1">
                <p className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">
                  Available Coupons (Click to paste):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["WELCOME50", "LOVEFOOD5", "FREESHIP"].map((c) => (
                    <span
                      key={c}
                      onClick={() => setVoucherCodeInput(c)}
                      className="cursor-pointer bg-slate-100 hover:bg-red-50 hover:text-[#ff3838] text-slate-600 px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold transition border border-slate-200/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Delivery Fee</span>
                  <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(shippingFee)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Promo</span>
                    <span className="tabular-nums">-{formatCurrency(voucherDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-slate-900 font-black">
                  <span className="text-sm">Total Amount</span>
                  <span className="text-2xl text-[#ff3838] tabular-nums">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-gradient-to-r from-[#ff7b00] to-[#ff3838] hover:from-[#ff3838] hover:to-[#e02d2d] text-white font-black text-sm rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-4"
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
