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
    setTimeout(() => setToastMsg(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[#ff3838] font-black uppercase text-xs tracking-widest bg-red-100 px-3.5 py-1.5 rounded-full inline-block">
            Delicious & Fresh
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1b2a]">
            Explore Our <span className="text-[#ff3838]">Full Menu</span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Handcrafted burgers, artisan stone-baked pizzas, refreshing boba milk teas, and delicious snacks.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="w-full md:w-96 relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchParams(e.target.value ? { search: e.target.value } : {});
              }}
              placeholder="Search dish name, ingredients..."
              className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white transition rounded-2xl py-2.5 pl-11 pr-4 text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-100 border border-transparent focus:border-red-200"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-gray-500 shrink-0">Sort By:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-2xl py-2.5 px-4 outline-none border border-gray-200 cursor-pointer focus:ring-2 focus:ring-red-100"
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
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shrink-0 ${
              selectedCategory === "all"
                ? "bg-[#ff3838] text-white shadow-md shadow-red-200 scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            🍔 All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shrink-0 flex items-center gap-2 ${
                selectedCategory === cat.slug
                  ? "bg-[#ff3838] text-white shadow-md shadow-red-200 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
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
              <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-pulse space-y-3">
                <div className="w-full h-44 bg-gray-200 rounded-2xl"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <i className="fas fa-utensils text-5xl text-gray-300 mb-3"></i>
            <h3 className="text-lg font-bold text-gray-700">No dishes found</h3>
            <p className="text-xs text-gray-400 mt-1">
              Try searching with another keyword or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                    <div className="absolute top-2.5 left-2.5 bg-[#ff3838] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      SAVE {formatCurrency(Number(item.originalPrice) - Number(item.price))}
                    </div>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="text-amber-400">★</span>
                    <span>{item.ratingAvg || "5.0"}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {item.category?.name || "Dish"}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-[#ff3838] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-[#ff3838] block">
                        {formatCurrency(item.price)}
                      </span>
                      {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="px-3.5 py-2 bg-red-50 hover:bg-[#ff3838] text-[#ff3838] hover:text-white font-extrabold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                    >
                      <i className="fas fa-plus text-[10px]"></i> Add
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
