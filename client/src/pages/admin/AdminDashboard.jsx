import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin.api";
import { formatCurrency } from "../../utils/formatCurrency";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then((res) => setData(res.data?.data))
      .catch((err) => console.error("Error loading admin stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-red-200 border-t-[#ff3838] rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const topProducts = data?.topProducts || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header - Clean non-duplicate Admin Portal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff3838] bg-red-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <i className="fas fa-shield-alt text-[10px]"></i>
                <span>Admin Operations Portal</span>
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#0d1b2a] mt-2">
              Store Performance & <span className="text-[#ff3838]">Live Analytics</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Real-time revenue metrics, order pipeline status, and inventory summary.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/orders"
              className="px-5 py-2.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-red-200 transition active:scale-95"
            >
              <i className="fas fa-fire-burner"></i> Kitchen POS Orders
            </Link>
            <Link
              to="/admin/menu"
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition active:scale-95"
            >
              <i className="fas fa-utensils"></i> Menu & Inventory
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="text-2xl font-black text-[#0d1b2a] mt-1">
                {formatCurrency(stats.totalRevenue || 0)}
              </h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">
                <i className="fas fa-arrow-up mr-1"></i> Steady Sales
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
              <i className="fas fa-sack-dollar"></i>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Total Orders
              </p>
              <h3 className="text-2xl font-black text-[#0d1b2a] mt-1">
                {stats.totalOrders || 0} orders
              </h3>
              <p className="text-[11px] text-blue-600 font-bold mt-1">
                {stats.completedOrders || 0} completed
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
              <i className="fas fa-clipboard-list"></i>
            </div>
          </div>

          {/* Preparing Orders (Kitchen) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Kitchen Active
              </p>
              <h3 className="text-2xl font-black text-[#ff3838] mt-1">
                {stats.preparingOrders || 0} orders
              </h3>
              <p className="text-[11px] text-amber-600 font-bold mt-1">
                {stats.pendingOrders || 0} pending confirmation
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#ff3838] flex items-center justify-center text-2xl">
              <i className="fas fa-fire-burner"></i>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Registered Users
              </p>
              <h3 className="text-2xl font-black text-[#0d1b2a] mt-1">
                {stats.totalUsers || 0} users
              </h3>
              <p className="text-[11px] text-purple-600 font-bold mt-1">
                Active member accounts
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>

        {/* 2 Column Layout: Recent Orders & Top Selling Dishes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Orders */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5 border-b pb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <i className="fas fa-clock text-[#ff3838]"></i>
                <span>Recent Live Orders</span>
              </h2>
              <Link to="/admin/orders" className="text-xs font-bold text-[#ff3838] hover:underline">
                View all orders →
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl border border-gray-100 hover:bg-gray-50 flex items-center justify-between transition text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900">
                        #{ord.orderCode}
                      </span>
                      <span className="font-semibold text-gray-700">
                        ({ord.recipientName})
                      </span>
                    </div>
                    <p className="text-gray-400 text-[11px] mt-0.5">
                      {new Date(ord.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} • {ord.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-[#ff3838] block text-sm">
                      {formatCurrency(ord.totalAmount)}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Top Selling Dishes */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5 border-b pb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <i className="fas fa-crown text-amber-400"></i>
                <span>Top Selling Dishes</span>
              </h2>
            </div>

            <div className="space-y-4">
              {topProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-50 text-[#ff3838] font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={p.imageUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-1">
                        {p.name}
                      </h4>
                      <span className="text-[11px] text-gray-400">{p.category}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-xs text-gray-900 block">
                      {formatCurrency(p.price)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {p.soldCount} sold
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
