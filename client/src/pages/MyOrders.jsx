import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { CartContext } from "../store/cartContext";
import { orderApi } from "../api/order.api";
import { formatCurrency } from "../utils/formatCurrency";

const statusConfig = {
  pending: { label: "Order Placed", color: "bg-amber-50 text-amber-800 border-amber-200/60" },
  confirmed: { label: "Confirmed", color: "bg-blue-50 text-blue-800 border-blue-200/60" },
  preparing: { label: "Kitchen Cooking", color: "bg-purple-50 text-purple-800 border-purple-200/60" },
  shipping: { label: "Out for Delivery", color: "bg-indigo-50 text-indigo-800 border-indigo-200/60" },
  completed: { label: "Delivered", color: "bg-emerald-50 text-emerald-800 border-emerald-200/60" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-800 border-red-200/60" },
};

const MyOrders = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { reorder } = useContext(CartContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lookupCode, setLookupCode] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (isAuthenticated) {
      orderApi
        .getMyOrders()
        .then((res) => {
          setOrders(res.data?.data || []);
        })
        .catch((err) => {
          console.error("Failed to load user orders:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (lookupCode.trim()) {
      navigate(`/orders/track/${lookupCode.trim()}`);
    }
  };

  const handleReorder = (orderItems) => {
    reorder(orderItems);
    navigate("/cart");
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter((ord) => {
    if (activeTab === "active") return ["pending", "confirmed", "preparing", "shipping"].includes(ord.orderStatus);
    if (activeTab === "completed") return ord.orderStatus === "completed";
    if (activeTab === "cancelled") return ord.orderStatus === "cancelled";
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-16 px-4 font-sans selection:bg-red-500 selection:text-white">
        <div className="max-w-md mx-auto bg-white rounded-[28px] p-8 sm:p-9 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] border border-slate-200/80 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-[#ff3838] rounded-3xl flex items-center justify-center mx-auto text-2xl border border-red-100 shadow-inner">
            <i className="fas fa-receipt"></i>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order History</h2>
            <p className="text-slate-500 text-xs mt-1 font-medium leading-relaxed">
              Sign in to view your complete order history or enter a tracking code below.
            </p>
          </div>

          {/* Quick Lookup by Order Code */}
          <form onSubmit={handleLookupSubmit} className="space-y-3 pt-2">
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="e.g. LF-20260825-1001"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-mono text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-bold"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl text-xs transition active:scale-95 shadow-sm"
            >
              Track Order Code
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4">
            <Link
              to="/login"
              className="block w-full py-3.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-black rounded-2xl text-xs shadow-md shadow-red-200 transition active:scale-[0.98]"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-8 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff3838] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
              Meal Logs & Receipts
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              My <span className="text-[#ff3838]">Orders</span>
            </h1>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              Track active delivery status, review previous meals, and 1-click reorder ({orders.length} orders total).
            </p>
          </div>

          {/* Search by Code Bar */}
          <form onSubmit={handleLookupSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="Track code..."
              className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-mono text-slate-800 outline-none focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-bold"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-2xl text-xs shadow-sm active:scale-95 transition"
            >
              Find
            </button>
          </form>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: "all", label: "All Orders" },
            { key: "active", label: "Active Delivery" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 animate-pulse space-y-3">
                <div className="h-5 bg-slate-100 rounded w-1/3"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-9 bg-slate-100 rounded-xl w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 space-y-3">
            <div className="w-20 h-20 bg-red-50 text-[#ff3838] rounded-3xl flex items-center justify-center mx-auto text-3xl border border-red-100">
              <i className="fas fa-box-open"></i>
            </div>
            <h3 className="text-lg font-black text-slate-800">
              No orders found in this tab
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
              Explore our chef specialties and place your next order today!
            </p>
            <Link
              to="/menu"
              className="inline-block px-7 py-3 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-black rounded-2xl transition shadow-md shadow-red-200 text-xs active:scale-95 mt-2"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const statusInfo = statusConfig[order.orderStatus] || {
                label: order.orderStatus,
                color: "bg-slate-100 text-slate-800 border-slate-200",
              };

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all border border-slate-200/80 space-y-4"
                >
                  {/* Top Order Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-base text-slate-900 tracking-tight">
                          #{order.orderCode}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-medium">
                        {new Date(order.createdAt).toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                        Total Payment
                      </span>
                      <span className="text-xl font-black text-[#ff3838] tabular-nums">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="space-y-2 py-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600">
                            {item.quantity}x
                          </span>
                          <span className="font-semibold text-slate-800">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 tabular-nums">
                          {formatCurrency(item.itemTotal || item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Address Snapshot */}
                  <div className="bg-slate-50 rounded-2xl p-3 text-xs text-slate-600 font-medium flex items-center gap-2 border border-slate-100">
                    <i className="fas fa-map-pin text-[#ff3838] text-xs"></i>
                    <span>
                      <b className="text-slate-900">Delivered to:</b> {order.shippingAddress}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleReorder(order.items)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 font-bold rounded-xl text-xs transition active:scale-95 flex items-center gap-1.5"
                    >
                      <i className="fas fa-redo text-[10px]"></i>
                      <span>1-Click Reorder</span>
                    </button>
                    <Link
                      to={`/orders/track/${order.orderCode}`}
                      className="px-5 py-2 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-black rounded-xl text-xs transition shadow-md shadow-red-200 flex items-center gap-1.5 active:scale-95"
                    >
                      <i className="fas fa-truck-fast text-[10px]"></i>
                      <span>Track Order</span>
                    </Link>
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

export default MyOrders;
