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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-red-100 border-t-[#ff3838] rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const topProducts = data?.topProducts || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 md:px-8 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header - Refero SaaS Style */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ff3838] bg-red-50 border border-red-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <i className="fas fa-shield-alt text-[9px]"></i>
                <span>Admin Operations Portal</span>
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Store Performance & <span className="text-[#ff3838]">Live Analytics</span>
            </h1>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              Real-time revenue metrics, order pipeline status, and inventory summary.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/admin/orders"
              className="px-5 py-2.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-red-200 transition active:scale-95"
            >
              <i className="fas fa-fire-burner text-[11px]"></i>
              <span>Kitchen POS Orders</span>
            </Link>
            <Link
              to="/admin/menu"
              className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition active:scale-95 shadow-sm"
            >
              <i className="fas fa-utensils text-[11px]"></i>
              <span>Menu & Stock</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Revenue */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                {formatCurrency(stats.totalRevenue || 0)}
              </h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <i className="fas fa-arrow-up text-[9px]"></i>
                <span>Steady Growth</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl border border-emerald-100">
              <i className="fas fa-sack-dollar"></i>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                Total Orders
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                {stats.totalOrders || 0} orders
              </h3>
              <p className="text-[11px] text-blue-600 font-bold mt-1">
                {stats.completedOrders || 0} delivered
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl border border-blue-100">
              <i className="fas fa-clipboard-list"></i>
            </div>
          </div>

          {/* Preparing Orders (Kitchen) */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                Kitchen Active
              </p>
              <h3 className="text-2xl font-black text-[#ff3838] mt-1 tabular-nums">
                {stats.preparingOrders || 0} orders
              </h3>
              <p className="text-[11px] text-amber-600 font-bold mt-1">
                {stats.pendingOrders || 0} pending confirmation
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#ff3838] flex items-center justify-center text-xl border border-red-100">
              <i className="fas fa-fire-burner"></i>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                Registered Users
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                {stats.totalUsers || 0} users
              </h3>
              <p className="text-[11px] text-purple-600 font-bold mt-1">
                Active team members
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl border border-purple-100">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>

        {/* 2 Column Layout: Recent Orders & Top Selling Dishes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Orders */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
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
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 flex items-center justify-between transition text-xs group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900">
                        #{ord.orderCode}
                      </span>
                      <span className="font-semibold text-slate-700">
                        ({ord.recipientName})
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5 font-medium">
                      {new Date(ord.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} • {ord.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-[#ff3838] block text-sm tabular-nums">
                      {formatCurrency(ord.totalAmount)}
                    </span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Top Selling Dishes */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <i className="fas fa-crown text-amber-400"></i>
                <span>Top Selling Dishes</span>
              </h2>
            </div>

            <div className="space-y-4">
              {topProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-50 text-[#ff3838] font-black text-[11px] flex items-center justify-center shrink-0 border border-red-100">
                      {idx + 1}
                    </span>
                    <img
                      src={p.imageUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {p.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">{p.category}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-xs text-slate-900 block tabular-nums">
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
