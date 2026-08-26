import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productApi } from "../../api/product.api";
import { adminApi } from "../../api/admin.api";
import { formatCurrency } from "../../utils/formatCurrency";
import Toast from "../../components/ui/Toast";

const AdminMenu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    productApi
      .getList({ search })
      .then((res) => setProducts(res.data?.data || []))
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleToggleStock = async (id) => {
    try {
      const res = await adminApi.toggleProductStock(id);
      const updated = res.data?.data;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isAvailable: updated.isAvailable } : p))
      );
      setToast({
        type: "success",
        message: `Dish is now marked as ${updated.isAvailable ? "In Stock" : "Out of Stock"}!`,
      });
    } catch (err) {
      setToast({ type: "error", message: "Failed to update stock status." });
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
              Menu & <span className="text-[#ff3838]">Stock Availability</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/orders"
              className="px-5 py-2.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-red-200 transition active:scale-95"
            >
              <i className="fas fa-fire-burner text-[11px]"></i>
              <span>Kitchen POS Orders</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3">
          <i className="fas fa-search text-slate-400 pl-2 text-xs"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish by name, ingredients or category..."
            className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 pr-2 text-xs">
              <i className="fas fa-times-circle"></i>
            </button>
          )}
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Dish Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Total Sold</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6 text-center">Stock Status</th>
                  <th className="py-4 px-6 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      <div className="w-8 h-8 border-2 border-red-100 border-t-[#ff3838] rounded-full animate-spin mx-auto mb-2"></div>
                      <span>Loading menu catalog...</span>
                    </td>
                  </tr>
                ) : products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    {/* Dish name & thumbnail */}
                    <td className="py-4 px-6 flex items-center gap-3.5">
                      <img
                        src={p.imageUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                        alt={p.name}
                        className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                      />
                      <div>
                        <p className="font-black text-xs text-slate-900 leading-snug">{p.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {p.toppings?.length || 0} custom toppings
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 font-bold text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[11px] border border-slate-200/60 font-semibold">
                        {p.category?.name || p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-black text-xs text-[#ff3838] tabular-nums">
                      {formatCurrency(p.price)}
                    </td>

                    {/* Sold count */}
                    <td className="py-4 px-6 font-bold text-slate-700 tabular-nums">
                      {p.soldCount} sold
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-6 font-black text-amber-500">
                      ★ {p.ratingAvg || "5.0"}
                    </td>

                    {/* Stock Status */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          p.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {p.isAvailable ? "In Stock (Active)" : "Out of Stock"}
                      </span>
                    </td>

                    {/* Toggle Button */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStock(p.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 border ${
                          p.isAvailable
                            ? "bg-red-50 text-red-600 border-red-200/60 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-200/60 hover:bg-emerald-100"
                        }`}
                      >
                        {p.isAvailable ? "Set Out of Stock" : "Set In Stock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminMenu;
