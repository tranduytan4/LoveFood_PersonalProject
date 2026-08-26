import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { CartContext } from "../store/cartContext";
import { orderApi } from "../api/order.api";
import { formatCurrency } from "../utils/formatCurrency";

const statusConfig = {
  pending: { label: "Order Placed", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  preparing: { label: "Cooking", color: "bg-purple-100 text-purple-800" },
  shipping: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800" },
  completed: { label: "Delivered", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

const MyOrders = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { reorder } = useContext(CartContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lookupCode, setLookupCode] = useState("");

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 font-sans">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-[#ff3838] rounded-full flex items-center justify-center mx-auto text-2xl">
            <i className="fas fa-receipt"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            <p className="text-gray-500 text-xs mt-1">
              Sign in to view your complete order history or track an order by code below.
            </p>
          </div>

          {/* Quick Lookup by Order Code */}
          <form onSubmit={handleLookupSubmit} className="space-y-3 pt-2">
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="Enter order code (e.g. LF-20260825-1001)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-mono text-gray-800 outline-none focus:border-[#ff3838]"
              required
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-gray-900 hover:bg-[#ff3838] text-white font-bold rounded-xl text-xs transition"
            >
              Track Order
            </button>
          </form>

          <div className="border-t pt-4">
            <Link
              to="/login"
              className="block w-full py-3 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-2xl text-xs shadow-md shadow-red-200"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#0d1b2a]">
              My <span className="text-[#ff3838]">Orders</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track and manage all your meals ordered at LoveFood.
            </p>
          </div>

          {/* Search by code */}
          <form onSubmit={handleLookupSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="Track code..."
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-800 outline-none focus:border-[#ff3838]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#ff3838] text-white font-bold rounded-xl text-xs shadow-sm hover:bg-[#e02d2d]"
            >
              Find
            </button>
          </form>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded-xl w-1/4"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="w-20 h-20 bg-red-50 text-[#ff3838] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <i className="fas fa-box-open"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              You Have No Orders Yet
            </h3>
            <p className="text-gray-500 text-xs mb-6 max-w-sm mx-auto">
              Explore our menu and place your first delicious order today!
            </p>
            <Link
              to="/menu"
              className="px-8 py-3.5 bg-[#ff3838] text-white font-extrabold rounded-full hover:bg-[#e02d2d] transition shadow-md shadow-red-200 text-sm"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.orderStatus] || {
                label: order.orderStatus,
                color: "bg-gray-100 text-gray-800",
              };

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition border border-gray-100 space-y-4"
                >
                  {/* Top order bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-gray-900">
                          #{order.orderCode}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Ordered at:{" "}
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
                      <span className="text-xs text-gray-400 block">Total Payment</span>
                      <span className="text-xl font-black text-[#ff3838]">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-2 py-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-600">
                            {item.quantity}
                          </span>
                          <span className="font-semibold">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(item.itemTotal || item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Address Snapshot */}
                  <div className="bg-gray-50 rounded-2xl p-3 text-xs text-gray-600">
                    <i className="fas fa-map-marker-alt text-[#ff3838] mr-1.5"></i>
                    <b>Delivered to:</b> {order.shippingAddress}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleReorder(order.items)}
                      className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                    >
                      <i className="fas fa-redo text-[10px]"></i> Re-order
                    </button>
                    <Link
                      to={`/orders/track/${order.orderCode}`}
                      className="px-5 py-2 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-xl text-xs transition shadow-md shadow-red-200 flex items-center gap-1.5"
                    >
                      <i className="fas fa-truck-fast text-[10px]"></i> Track Order
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
