import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../api/product.api";
import { categoryApi } from "../api/category.api";
import { CartContext } from "../store/cartContext";
import { formatCurrency } from "../utils/formatCurrency";
import FoodCustomizationModal from "../components/food/FoodCustomizationModal";
import Toast from "../components/ui/Toast";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  // Customization modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const { addItem } = useContext(CartContext);

  // Fetch categories on mount
  useEffect(() => {
    categoryApi
      .getAll()
      .then((res) => {
        setCategories(res.data?.data || []);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    setLoading(true);
    productApi
      .getList({
        category: selectedCategory === "all" ? "" : selectedCategory,
        search,
        sort: selectedSort,
      })
      .then((res) => {
        setProducts(res.data?.data || []);
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedSort, search]);

  const handleAddToCart = (product, options) => {
    addItem(product, options);
    setToastMsg(`Added "${product.name}" to your cart!`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-8 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Section */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-[#ff3838] font-black uppercase text-[10px] tracking-widest bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <i className="fas fa-utensils text-[9px]"></i>
            <span>Artisan Kitchen Menu</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Explore Our <span className="text-[#ff3838]">Full Menu</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
            Handcrafted double-patty burgers, artisan stone-baked pizzas, bubble milk teas, and delicious sides.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white rounded-3xl p-3.5 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 flex flex-col md:flex-row gap-3.5 items-center justify-between">
          {/* Search Bar with Icon and Shortcut Badge */}
          <div className="w-full md:w-96 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchParams(e.target.value ? { search: e.target.value } : {});
              }}
              placeholder="Search dish name, ingredients..."
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white transition rounded-2xl py-2.5 pl-9 pr-12 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-red-100 border border-slate-200/70 focus:border-[#ff3838]"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setSearchParams({});
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
              >
                <i className="fas fa-times-circle"></i>
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0">
              Sort By:
            </span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-2xl py-2.5 px-4 outline-none border border-slate-200/80 cursor-pointer focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shrink-0 active:scale-95 ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-105"
                : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/70"
            }`}
          >
            🍔 All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shrink-0 flex items-center gap-2 active:scale-95 ${
                selectedCategory === cat.slug
                  ? "bg-[#ff3838] text-white shadow-md shadow-red-200 scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/70"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/60 animate-pulse space-y-3">
                <div className="w-full h-44 bg-slate-100 rounded-2xl"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="h-9 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-2xl mx-auto">
              <i className="fas fa-utensils"></i>
            </div>
            <h3 className="text-base font-black text-slate-800">No dishes match your query</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching with another keyword, clearing the search box, or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Save Badge */}
                  {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                    <div className="absolute top-2.5 left-2.5 bg-[#ff3838] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      SAVE {formatCurrency(Number(item.originalPrice) - Number(item.price))}
                    </div>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="text-amber-400">★</span>
                    <span>{item.ratingAvg || "5.0"}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {item.category?.name || "Signature"}
                    </span>
                    <h3 className="font-black text-sm text-slate-900 line-clamp-1 group-hover:text-[#ff3838] transition-colors mt-0.5">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mt-0.5 font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-[#ff3838] block tabular-nums">
                        {formatCurrency(item.price)}
                      </span>
                      {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                        <span className="text-[10px] text-slate-400 line-through tabular-nums">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="px-4 py-2 bg-red-50 hover:bg-[#ff3838] text-[#ff3838] hover:text-white font-black text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-sm hover:shadow-red-200"
                    >
                      <i className="fas fa-plus text-[10px]"></i>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default MenuPage;
