import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin.api";
import { formatCurrency } from "../../utils/formatCurrency";
import Toast from "../../components/ui/Toast";

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending ⏳" },
  { key: "confirmed", label: "Confirmed ✅" },
  { key: "preparing", label: "Cooking 🔥" },
  { key: "shipping", label: "Delivering 🛵" },
  { key: "completed", label: "Completed 🎉" },
  { key: "cancelled", label: "Cancelled ❌" },
];

const nextStatusMap = {
  pending: { next: "confirmed", actionLabel: "Accept & Confirm", btnClass: "bg-blue-600 hover:bg-blue-700 shadow-blue-200" },
  confirmed: { next: "preparing", actionLabel: "Send to Kitchen", btnClass: "bg-purple-600 hover:bg-purple-700 shadow-purple-200" },
  preparing: { next: "shipping", actionLabel: "Dispatch Driver", btnClass: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" },
  shipping: { next: "completed", actionLabel: "Mark Delivered", btnClass: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    adminApi
      .getOrders({ status: activeTab === "all" ? "" : activeTab })
      .then((res) => setOrders(res.data?.data || []))
      .catch((err) => console.error("Error loading admin orders:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
    // Auto poll orders every 8 seconds for real-time kitchen feel
    const interval = setInterval(loadOrders, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoadingId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus, `Updated to ${newStatus}`);
      setToast({ type: "success", message: `Order status updated to: ${newStatus}` });
      loadOrders();
    } catch (err) {
      setToast({ type: "error", message: "Failed to update order status." });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 md:px-8 font-sans selection:bg-red-500 selection:text-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <Link to="/admin" className="text-xs font-bold text-slate-400 hover:text-[#ff3838] transition inline-flex items-center gap-1.5">
              <i className="fas fa-arrow-left text-[10px]"></i>
              <span>Back to Operations Dashboard</span>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Kitchen & <span className="text-[#ff3838]">Live Orders POS</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <i className="fas fa-sync-alt text-[10px]"></i>
              <span>Refresh Queue</span>
            </button>
            <Link
              to="/admin/menu"
              className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition active:scale-95 shadow-sm"
            >
              <i className="fas fa-utensils text-[11px]"></i>
              <span>Menu & Stock</span>
            </Link>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition-all ${
                activeTab === tab.key
                  ? "bg-[#ff3838] text-white shadow-md shadow-red-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading && orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-red-100 border-t-[#ff3838] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-400 font-bold text-xs">Loading live POS queue...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-2">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 text-2xl mx-auto">
              <i className="fas fa-clipboard-check"></i>
            </div>
            <h3 className="text-base font-black text-slate-800">No Orders in this queue</h3>
            <p className="text-xs text-slate-400">
              There are currently no active orders matching this status filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => {
              const nextAction = nextStatusMap[order.orderStatus];
              const isLoading = actionLoadingId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 flex flex-col justify-between space-y-4 hover:border-slate-300 transition group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <span className="font-mono font-black text-sm text-slate-900">
                          #{order.orderCode}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {new Date(order.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-red-50 text-[#ff3838] border border-red-100">
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* Customer Info Box */}
                    <div className="text-xs text-slate-600 space-y-1 mb-4 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 font-medium">
                      <p>
                        <b className="text-slate-900">Customer:</b> {order.recipientName} ({order.recipientPhone})
                      </p>
                      <p className="line-clamp-2">
                        <b className="text-slate-900">Address:</b> {order.shippingAddress}
                      </p>
                      {order.note && (
                        <p className="text-amber-600 italic">
                          <b className="text-slate-900 not-italic">Instructions:</b> "{order.note}"
                        </p>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Dishes Ordered ({order.items?.length || 0})
                      </p>
                      {order.items?.map((item, idx) => {
                        const options =
                          typeof item.options === "string"
                            ? JSON.parse(item.options)
                            : item.options || {};

                        return (
                          <div
                            key={idx}
                            className="flex items-start justify-between text-xs py-1 border-b border-slate-50 last:border-0"
                          >
                            <div>
                              <span className="font-bold text-slate-800">
                                {item.quantity}x {item.name}
                              </span>
                              {options.size && options.size !== "Standard" && (
                                <span className="text-[10px] text-blue-600 ml-1 font-bold">
                                  ({options.size})
                                </span>
                              )}
                              {options.toppings?.length > 0 && (
                                <p className="text-[10px] text-slate-400">
                                  +{options.toppings.join(", ")}
                                </p>
                              )}
                              {options.itemNote && (
                                <p className="text-[10px] text-amber-600 italic">
                                  "{options.itemNote}"
                                </p>
                              )}
                            </div>
                            <span className="font-bold text-slate-900 shrink-0 tabular-nums">
                              {formatCurrency(item.itemTotal || item.price * item.quantity)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-400 font-medium">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                      <span className="text-xl font-black text-[#ff3838] tabular-nums">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {nextAction && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, nextAction.next)}
                          disabled={isLoading}
                          className={`flex-1 py-3 text-white font-black rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] ${nextAction.btnClass}`}
                        >
                          {isLoading ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <>
                              <i className="fas fa-arrow-right text-[10px]"></i>
                              <span>{nextAction.actionLabel}</span>
                            </>
                          )}
                        </button>
                      )}

                      {order.orderStatus !== "completed" && order.orderStatus !== "cancelled" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "cancelled")}
                          disabled={isLoading}
                          className="px-3.5 py-3 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 font-bold rounded-xl text-xs transition active:scale-95"
                          title="Cancel Order"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
