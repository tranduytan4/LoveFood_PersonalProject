import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { orderApi } from "../api/order.api";
import { reviewApi } from "../api/review.api";
import { CartContext } from "../store/cartContext";
import { formatCurrency } from "../utils/formatCurrency";
import Toast from "../components/ui/Toast";

const ORDER_STEPS = [
  { key: "pending", label: "Order Placed", icon: "fa-receipt", desc: "Received by restaurant" },
  { key: "confirmed", label: "Confirmed", icon: "fa-check-circle", desc: "Accepted by chef" },
  { key: "preparing", label: "Kitchen Cooking", icon: "fa-fire-burner", desc: "Preparing your hot meal" },
  { key: "shipping", label: "Out for Delivery", icon: "fa-motorcycle", desc: "Driver is on the way" },
  { key: "completed", label: "Delivered", icon: "fa-box-open", desc: "Enjoy your delicious food!" },
];

const OrderTrackingPage = () => {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Review modal state
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const { reorder } = useContext(CartContext);
  const navigate = useNavigate();

  const fetchOrder = () => {
    orderApi
      .trackByCode(orderCode)
      .then((res) => {
        setOrder(res.data?.data);
        setError("");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Order not found with this code.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    // Auto poll status every 10 seconds for real-time tracking feel
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode]);

  const handleReorder = () => {
    if (order?.items) {
      reorder(order.items);
      navigate("/cart");
    }
  };

  const handleOpenReview = (item) => {
    setReviewModalItem(item);
    setReviewRating(5);
    setReviewComment("");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModalItem?.productId) return;

    setReviewSubmitting(true);
    try {
      await reviewApi.create({
        orderId: order.id,
        productId: reviewModalItem.productId,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewModalItem(null);
      setToast({ type: "success", message: "Thank you for your rating & review!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to submit review. Please try again." });
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 border-4 border-red-200 border-t-[#ff3838] rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-bold text-sm">Loading order tracking data...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-20 px-4 font-sans text-center">
        <div className="w-20 h-20 bg-red-100 text-[#ff3838] rounded-full flex items-center justify-center mb-4 text-3xl">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md">{error}</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#ff3838] text-white font-bold rounded-full hover:bg-[#e02d2d] transition text-sm"
        >
          Return Home
        </Link>
      </div>
    );
  }

  // Calculate current step index
  const currentStepIdx = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff3838] bg-red-50 px-3 py-1 rounded-full">
                Live Order Tracking
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {new Date(order.createdAt).toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0d1b2a] mt-2 font-mono">
              #{order.orderCode}
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={fetchOrder}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <i className="fas fa-sync-alt text-[10px]"></i> Refresh
            </button>
            <button
              onClick={handleReorder}
              className="px-5 py-2 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition shadow-md shadow-red-200 active:scale-95"
            >
              <i className="fas fa-redo text-[10px]"></i> Re-order This
            </button>
          </div>
        </div>

        {/* 3D Smooth Real-time Status Timeline Stepper */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          {isCancelled ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600">
              <i className="fas fa-times-circle text-4xl mb-2"></i>
              <h3 className="text-lg font-bold">Order Cancelled</h3>
              <p className="text-xs text-red-500 mt-1">
                This order was cancelled by the customer or restaurant.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-8 flex items-center gap-2">
                <i className="fas fa-truck-fast text-[#ff3838]"></i>
                <span>Live Delivery Progress</span>
              </h2>

              {/* Stepper Progress Bar Container */}
              <div>
                {/* Desktop Stepper */}
                <div className="hidden sm:block relative">
                  {/* Horizontal Progress Track - perfectly centered vertically at top-[28px] */}
                  <div className="absolute top-[28px] left-[10%] right-[10%] -translate-y-1/2 h-2.5 bg-gray-100 rounded-full shadow-inner border border-gray-200/50 z-0">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-orange-400 to-[#ff3838] shadow-[0_2px_8px_rgba(255,56,56,0.35)] transition-all duration-700"
                      style={{
                        width: `${Math.min(100, Math.max(0, (currentStepIdx / (ORDER_STEPS.length - 1)) * 100))}%`,
                      }}
                    ></div>
                  </div>

                  {/* 5 Step Icons & Labels */}
                  <div className="grid grid-cols-5 gap-2 relative z-10">
                    {ORDER_STEPS.map((step, idx) => {
                      const isDone = currentStepIdx > idx;
                      const isCurrent = currentStepIdx === idx;
                      const isPassedOrCurrent = currentStepIdx >= idx;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center group">
                          {/* 3D Circular Bubble (56px high, exact vertical center is 28px) */}
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-black transition-all duration-300 shrink-0 ${
                              isCurrent
                                ? "bg-gradient-to-b from-[#ff5e5e] via-[#ff3838] to-[#d62828] text-white shadow-[0_10px_25px_rgba(255,56,56,0.45),inset_0_2px_4px_rgba(255,255,255,0.6)] border-2 border-white ring-8 ring-red-100/80 scale-110 animate-pulse"
                                : isDone
                                ? "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_6px_16px_rgba(16,185,129,0.35),inset_0_2px_4px_rgba(255,255,255,0.5)] border-2 border-white ring-4 ring-emerald-50"
                                : "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-400 shadow-inner border border-gray-200/60"
                            }`}
                          >
                            <i className={`fas ${step.icon} drop-shadow`}></i>
                          </div>

                          {/* Text labels */}
                          <div className="mt-3 space-y-0.5">
                            <p
                              className={`text-xs font-extrabold ${
                                isCurrent
                                  ? "text-[#ff3838]"
                                  : isPassedOrCurrent
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[11px] text-gray-400 line-clamp-1">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Stepper */}
                <div className="sm:hidden space-y-5">
                  {ORDER_STEPS.map((step, idx) => {
                    const isDone = currentStepIdx > idx;
                    const isCurrent = currentStepIdx === idx;
                    const isPassedOrCurrent = currentStepIdx >= idx;

                    return (
                      <div key={step.key} className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-black transition-all shrink-0 ${
                            isCurrent
                              ? "bg-gradient-to-b from-[#ff5e5e] via-[#ff3838] to-[#d62828] text-white shadow-lg ring-4 ring-red-100 scale-105"
                              : isDone
                              ? "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          }`}
                        >
                          <i className={`fas ${step.icon}`}></i>
                        </div>
                        <div>
                          <p
                            className={`text-xs font-extrabold ${
                              isCurrent
                                ? "text-[#ff3838]"
                                : isPassedOrCurrent
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] text-gray-400">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Items Breakdown */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4 border-b pb-3 flex items-center justify-between">
              <span>Dish Breakdown</span>
              <span className="text-xs text-gray-500 font-normal">
                {order.items?.length || 0} items
              </span>
            </h2>

            <div className="space-y-4">
              {order.items?.map((item, idx) => {
                const options =
                  typeof item.options === "string"
                    ? JSON.parse(item.options)
                    : item.options || {};

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:bg-gray-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        <img
                          src={
                            item.imageUrl ||
                            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                        <div className="text-[11px] text-gray-500 space-x-1">
                          <span>
                            {formatCurrency(item.price)} x {item.quantity}
                          </span>
                          {options.size && options.size !== "Standard" && (
                            <span className="font-bold text-blue-600">• Size: {options.size}</span>
                          )}
                        </div>
                        {options.toppings?.length > 0 && (
                          <p className="text-[10px] text-gray-400">
                            +{options.toppings.join(", ")}
                          </p>
                        )}
                        {options.itemNote && (
                          <p className="text-[10px] text-amber-600 italic">
                            Note: "{options.itemNote}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-sm text-gray-900 block">
                        {formatCurrency(item.itemTotal || item.price * item.quantity)}
                      </span>
                      {order.orderStatus === "completed" && item.productId && (
                        <button
                          onClick={() => handleOpenReview(item)}
                          className="text-[11px] font-bold text-[#ff3838] hover:underline mt-1 inline-block"
                        >
                          ⭐ Rate Dish
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Summary */}
            <div className="border-t pt-4 mt-6 space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900">{formatCurrency(order.shippingFee)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t">
                <span>Total Payment</span>
                <span className="text-xl font-black text-[#ff3838]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Delivery card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <i className="fas fa-map-pin text-[#ff3838]"></i>
                <span>Delivery Information</span>
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p>
                  <b className="text-gray-900">Recipient:</b> {order.recipientName}
                </p>
                <p>
                  <b className="text-gray-900">Phone:</b> {order.recipientPhone}
                </p>
                <p>
                  <b className="text-gray-900">Address:</b> {order.shippingAddress}
                </p>
                {order.note && (
                  <p className="text-amber-600 italic">
                    <b className="text-gray-900 not-italic">Instructions:</b> "{order.note}"
                  </p>
                )}
              </div>
            </div>

            {/* Payment card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <i className="fas fa-wallet text-[#ff3838]"></i>
                <span>Payment Details</span>
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-bold text-gray-900">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery (COD)"
                      : order.paymentMethod === "MOMO"
                      ? "E-Wallet (MoMo / PayPal / Apple Pay)"
                      : "Credit / Debit Card"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      order.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.paymentStatus === "paid" ? "Paid" : "Pending Payment"}
                  </span>
                </div>
              </div>
            </div>

            {/* Back button */}
            <Link
              to="/orders"
              className="block w-full py-3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs transition"
            >
              <i className="fas fa-list mr-1.5"></i> View All My Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative border border-gray-100 animate-in fade-in duration-200 font-sans">
            <button
              onClick={() => setReviewModalItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
            >
              <i className="fas fa-times"></i>
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Rate Your Meal ⭐
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              How did you like <b>{reviewModalItem.name}</b>?
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star rating selector */}
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`text-3xl transition ${
                      star <= reviewRating ? "text-amber-400 scale-110" : "text-gray-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Food was hot, delicious, delivered right on time..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs text-gray-800 focus:bg-white focus:border-[#ff3838] outline-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalItem(null)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="flex-1 py-2.5 bg-[#ff3838] text-white rounded-xl text-xs font-bold shadow-md shadow-red-200"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
