import React, { useState, useEffect, useContext } from "react";
import { productApi } from "../api/product.api";
import { voucherApi } from "../api/voucher.api";
import { CartContext } from "../store/cartContext";
import { formatCurrency } from "../utils/formatCurrency";
import FoodCustomizationModal from "../components/food/FoodCustomizationModal";
import Toast from "../components/ui/Toast";

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productApi.getDeals(),
      voucherApi.getActive().catch(() => ({ data: { data: [] } })),
    ])
      .then(([dealsRes, vouchersRes]) => {
        setDeals(dealsRes.data?.data || []);
        setVouchers(vouchersRes.data?.data || []);
      })
      .catch((err) => console.error("Error loading deals:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product, options) => {
    addItem(product, options);
    setToastMsg(`Added combo "${product.name}" to cart!`);
  };

  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setToastMsg(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-8 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Hero Banner with Modern Gradient & Glassmorphism */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#e62e2e] via-[#ff3838] to-[#ff7b00] rounded-[32px] p-8 md:p-12 text-white shadow-xl shadow-red-200/50 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3.5 max-w-xl text-center md:text-left relative z-10">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm border border-white/20">
              <i className="fas fa-bolt text-yellow-300"></i>
              <span>Exclusive Member Rewards</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Party Bundles & <span className="underline decoration-yellow-300 decoration-wavy decoration-2">Discount Codes</span>
            </h1>
            <p className="text-red-50 text-xs md:text-sm leading-relaxed font-medium">
              Save up to 50% on family combos or copy exclusive coupon codes below to apply directly at checkout!
            </p>
          </div>

          <div className="w-28 h-28 md:w-36 md:h-36 bg-white/15 backdrop-blur-xl rounded-3xl flex items-center justify-center text-5xl md:text-6xl shadow-2xl border border-white/30 shrink-0 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            🎁
          </div>
        </div>

        {/* 1. Active Coupons Section (Ticket Punch Design) */}
        {vouchers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff3838]"></span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Available Coupon Codes
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400">Apply at checkout</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {vouchers.map((v) => {
                const isCopied = copiedCode === v.code;
                return (
                  <div
                    key={v.id || v.code}
                    className="relative bg-white rounded-3xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.03)] border border-slate-200/80 flex flex-col justify-between overflow-hidden group hover:border-[#ff3838]/50 transition-all duration-300"
                  >
                    {/* Left & Right Circular Ticket Notches */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#f8fafc] rounded-full border-r border-slate-200/80 -translate-y-1/2 z-10"></div>
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#f8fafc] rounded-full border-l border-slate-200/80 -translate-y-1/2 z-10"></div>

                    <div className="space-y-2 px-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#ff3838] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                          {v.discountType === "percentage"
                            ? `${v.discountValue}% OFF`
                            : `${formatCurrency(v.discountValue)} OFF`}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Min ${v.minOrderValue || 0}
                        </span>
                      </div>

                      <h3 className="font-mono font-black text-xl text-slate-900 tracking-wide mt-1">
                        {v.code}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {v.description}
                      </p>
                    </div>

                    {/* Perforation Divider */}
                    <div className="my-4 border-t-2 border-dashed border-slate-200"></div>

                    <div className="px-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {v.usageLimit ? `${v.usageLimit - v.usedCount} left` : "Unlimited"}
                      </span>

                      <button
                        onClick={() => handleCopyVoucher(v.code)}
                        className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 ${
                          isCopied
                            ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                            : "bg-slate-900 hover:bg-[#ff3838] text-white shadow-sm"
                        }`}
                      >
                        <i className={`fas ${isCopied ? "fa-check" : "fa-copy"} text-[10px]`}></i>
                        <span>{isCopied ? "Copied!" : "Copy Code"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Featured Combo Deals Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Featured Combo Meal Deals
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">{deals.length} combo specials</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 animate-pulse space-y-4">
                  <div className="w-full h-48 bg-slate-100 rounded-2xl"></div>
                  <div className="h-5 bg-slate-100 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-2xl mx-auto">
                <i className="fas fa-gift"></i>
              </div>
              <h3 className="text-base font-black text-slate-800">No active combo deals right now</h3>
              <p className="text-xs text-slate-400">Please check back soon for chef special meal combos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((item) => {
                const discountAmount =
                  item.originalPrice && Number(item.originalPrice) > Number(item.price)
                    ? Number(item.originalPrice) - Number(item.price)
                    : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {discountAmount > 0 && (
                          <div className="absolute top-3 left-3 bg-[#ff3838] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                            SAVE {formatCurrency(discountAmount)}
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="text-amber-400">★</span>
                          <span>{item.ratingAvg || "5.0"}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {item.category?.name || "Combo Deal"}
                        </span>
                        <h3 className="font-black text-base text-slate-900 group-hover:text-[#ff3838] transition-colors leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Price & Action Button */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-black text-[#ff3838] block tabular-nums">
                          {formatCurrency(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-slate-400 line-through tabular-nums">
                            {formatCurrency(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="px-5 py-2.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-black text-xs rounded-xl shadow-md shadow-red-200 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <span>Grab Deal</span>
                        <i className="fas fa-arrow-right text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Food Customization Modal */}
      <FoodCustomizationModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Toast popup */}
      <Toast message={toastMsg} onClose={() => setToastMsg("")} />
    </div>
  );
};

export default DealsPage;
