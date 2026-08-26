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
              Menu & <span className="text-[#ff3838]">Stock Availability</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/orders"
              className="px-5 py-2.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-red-200"
            >
              <i className="fas fa-fire-burner"></i> Kitchen POS Orders
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3">
          <i className="fas fa-search text-gray-400 pl-2"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish by name or category..."
            className="w-full text-sm font-semibold text-gray-800 outline-none"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Dish</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Unit Price</th>
                  <th className="py-4 px-6">Total Sold</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6 text-center">Stock Status</th>
                  <th className="py-4 px-6 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <div className="w-8 h-8 border-2 border-red-200 border-t-[#ff3838] rounded-full animate-spin mx-auto mb-2"></div>
                      <span>Loading menu items...</span>
                    </td>
                  </tr>
                ) : products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition">
                    {/* Dish name & image */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={p.imageUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-sm text-gray-900">{p.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {p.toppings?.length || 0} add-on toppings
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 font-semibold text-gray-600">
                      {p.category?.name || p.category}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-bold text-sm text-[#ff3838]">
                      {formatCurrency(p.price)}
                    </td>

                    {/* Sold count */}
                    <td className="py-4 px-6 font-bold text-gray-700">
                      {p.soldCount} sold
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-6 font-bold text-amber-500">
                      ★ {p.ratingAvg || "5.0"}
                    </td>

                    {/* Stock Status */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          p.isAvailable
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.isAvailable ? "In Stock (Active)" : "Out of Stock"}
                      </span>
                    </td>

                    {/* Toggle Button */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStock(p.id)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                          p.isAvailable
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {p.isAvailable ? "Mark Out of Stock" : "Make Available"}
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
