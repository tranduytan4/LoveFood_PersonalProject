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
  pending: { next: "confirmed", actionLabel: "Accept & Confirm Order", btnClass: "bg-blue-600 hover:bg-blue-700" },
  confirmed: { next: "preparing", actionLabel: "Send to Kitchen Cook", btnClass: "bg-purple-600 hover:bg-purple-700" },
  preparing: { next: "shipping", actionLabel: "Dispatch to Driver", btnClass: "bg-indigo-600 hover:bg-indigo-700" },
  shipping: { next: "completed", actionLabel: "Mark as Delivered", btnClass: "bg-emerald-600 hover:bg-emerald-700" },
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/admin" className="text-xs font-bold text-gray-500 hover:text-[#ff3838]">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-black text-[#0d1b2a] mt-1">
              Kitchen & <span className="text-[#ff3838]">Live Orders POS</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-sm transition"
            >
              <i className="fas fa-sync-alt"></i> Refresh Data
            </button>
            <Link
              to="/admin/menu"
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2"
            >
              <i className="fas fa-utensils"></i> Menu & Inventory
            </Link>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-3xl border border-gray-100 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all ${
                activeTab === tab.key
                  ? "bg-[#ff3838] text-white shadow-md shadow-red-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading && orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-red-200 border-t-[#ff3838] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 font-bold text-sm">Loading live orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-6">
            <i className="fas fa-clipboard-check text-4xl text-gray-300 mb-3"></i>
            <h3 className="text-lg font-bold text-gray-800">No Orders in this queue</h3>
            <p className="text-xs text-gray-400 mt-1">
              There are currently no active orders with this status.
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
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-3 mb-3">
                      <div>
                        <span className="font-mono font-black text-sm text-gray-900">
                          #{order.orderCode}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          {new Date(order.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <span className="text-xs uppercase font-extrabold px-2.5 py-1 rounded-full bg-red-50 text-[#ff3838]">
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* Customer info */}
                    <div className="text-xs text-gray-600 space-y-1 mb-4 bg-gray-50 p-3 rounded-2xl">
                      <p>
                        <b className="text-gray-900">Customer:</b> {order.recipientName} ({order.recipientPhone})
                      </p>
                      <p className="line-clamp-2">
                        <b className="text-gray-900">Address:</b> {order.shippingAddress}
                      </p>
                      {order.note && (
                        <p className="text-amber-600 italic">
                          <b>Instructions:</b> "{order.note}"
                        </p>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 border-t pt-3">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
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
                            className="flex items-start justify-between text-xs py-1 border-b border-gray-50 last:border-0"
                          >
                            <div>
                              <span className="font-bold text-gray-800">
                                {item.quantity}x {item.name}
                              </span>
                              {options.size && options.size !== "Standard" && (
                                <span className="text-[10px] text-blue-600 ml-1">
                                  ({options.size})
                                </span>
                              )}
                              {options.toppings?.length > 0 && (
                                <p className="text-[10px] text-gray-400">
                                  +{options.toppings.join(", ")}
                                </p>
                              )}
                              {options.itemNote && (
                                <p className="text-[10px] text-amber-600 italic">
                                  "{options.itemNote}"
                                </p>
                              )}
                            </div>
                            <span className="font-bold text-gray-900 shrink-0">
                              {formatCurrency(item.itemTotal || item.price * item.quantity)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-500">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                      <span className="text-xl font-black text-[#ff3838]">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {nextAction && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, nextAction.next)}
                          disabled={isLoading}
                          className={`flex-1 py-3 text-white font-extrabold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5 ${nextAction.btnClass}`}
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
                          className="px-3 py-3 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 font-bold rounded-xl text-xs transition"
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
