import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../store/cartContext";
import { productApi } from "../../api/product.api";
import { formatCurrency } from "../../utils/formatCurrency";
import FoodCustomizationModal from "../food/FoodCustomizationModal";
import Toast from "../ui/Toast";
import {
  FiShoppingCart,
  FiChevronRight,
  FiChevronLeft,
  FiArrowRight,
} from "react-icons/fi";

const PAGE_SIZE = 3;

const PopularSection = () => {
  const [popularItems, setPopularItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    productApi
      .getPopular(9)
      .then((res) => {
        setPopularItems(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Error loading popular dishes:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(popularItems.length / PAGE_SIZE) || 1;
  const isLastPage = page === totalPages - 1;

  const visibleItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    return popularItems.slice(start, start + PAGE_SIZE);
  }, [page, popularItems]);

  const nextPage = () => setPage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setPage((prev) => (prev - 1 + totalPages) % totalPages);

  const handleAddToCart = (product, options) => {
    addItem(product, options);
    setToastMsg(`Added "${product.name}" to your cart!`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const renderStars = (rating) => {
    const full = Math.round(rating || 5);
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < full ? "text-orange-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 bg-white font-['Nunito']" id="popular">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[50px] font-['Nunito'] font-extrabold text-[#0d1b2a]">
            Most <span className="text-[#ff3838]">Popular</span> Dishes
          </h2>
          <div className="w-[100px] h-[4px] bg-[#ff3838] mx-auto rounded-full my-[10px]" />
          <p className="text-[16px] text-[#666] mt-2 font-['Nunito'] max-w-[600px] mx-auto">
            Our customer favorites that keep everyone coming back for more.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-5 animate-pulse space-y-4"
              >
                <div className="w-full h-52 bg-gray-200 rounded-2xl"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Desktop Navigation Arrows */}
            <button
              type="button"
              onClick={prevPage}
              disabled={page === 0}
              className={`hidden md:inline-flex items-center justify-center absolute -left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow border border-gray-100 transition hover:shadow-md ${
                page === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous popular dishes"
              title="Previous"
            >
              <FiChevronLeft className="text-gray-700" size={20} />
            </button>

            <button
              type="button"
              onClick={nextPage}
              disabled={isLastPage}
              className={`hidden md:inline-flex items-center justify-center absolute -right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow border border-gray-100 transition hover:shadow-md ${
                isLastPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Next popular dishes"
              title="Next"
            >
              <FiChevronRight className="text-gray-700" size={20} />
            </button>

            {/* Cards */}
            <div
              className={[
                "grid gap-7",
                "grid-cols-1 sm:grid-cols-2",
                isLastPage ? "lg:grid-cols-4" : "lg:grid-cols-3",
              ].join(" ")}
            >
              {visibleItems.map((item) => (
                <article
                  key={item.id || item.slug}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="relative p-5">
                    <div className="relative w-full h-52 rounded-2xl bg-gray-50 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.imageUrl || item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Price badge */}
                    <div className="absolute top-8 left-8 bg-white text-[#ff3838] font-bold text-sm px-3 py-1 rounded-full shadow">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-6 pb-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2">
                      {renderStars(item.ratingAvg || item.rating)}
                      <span className="text-xs text-gray-500">
                        ({(item.ratingAvg || item.rating || 5.0).toFixed(1)})
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-extrabold text-gray-800">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2 flex-grow">
                      {item.description}
                    </p>

                    <button
                      type="button"
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#ff3838] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition active:scale-95"
                      onClick={() => setSelectedProduct(item)}
                    >
                      <FiShoppingCart size={18} />
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}

              {/* View All card (only on last page) - Original Minimal Style */}
              {isLastPage && (
                <button
                  type="button"
                  onClick={() => navigate("/menu")}
                  className="flex flex-col items-center justify-center gap-3 transition hover:scale-105 active:scale-95 group bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 p-8 min-h-[300px]"
                  aria-label="View all menu"
                  title="View all"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-[#ff3838] flex items-center justify-center shadow-md group-hover:bg-[#ff3838] transition-colors duration-300">
                    <FiArrowRight
                      className="text-[#ff3838] group-hover:text-white transition-colors duration-300"
                      size={20}
                    />
                  </div>
                  <span className="text-base text-[#ff3838] font-bold font-['Nunito']">
                    View All
                  </span>
                </button>
              )}
            </div>

            {/* Mobile controls */}
            <div className="md:hidden mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={prevPage}
                disabled={page === 0}
                className={`inline-flex items-center justify-center w-11 h-11 rounded-full bg-white shadow border border-gray-100 ${
                  page === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Previous popular dishes"
              >
                <FiChevronLeft className="text-gray-700" size={20} />
              </button>

              <div className="text-sm text-gray-500">
                {page + 1} / {totalPages}
              </div>

              <button
                type="button"
                onClick={nextPage}
                disabled={isLastPage}
                className={`inline-flex items-center justify-center w-11 h-11 rounded-full bg-white shadow border border-gray-100 ${
                  isLastPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Next popular dishes"
              >
                <FiChevronRight className="text-gray-700" size={20} />
              </button>
            </div>
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

      {/* Toast */}
      <Toast message={toastMsg} onClose={() => setToastMsg("")} />
    </section>
  );
};

export default PopularSection;
