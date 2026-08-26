import React, { useState, useEffect, useContext } from "react";
import { productApi } from "../api/product.api";
import { CartContext } from "../store/cartContext";
import { formatCurrency } from "../utils/formatCurrency";
import FoodCustomizationModal from "../components/food/FoodCustomizationModal";
import Toast from "../components/ui/Toast";

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    productApi
      .getDeals()
      .then((res) => {
        setDeals(res.data?.data || []);
      })
      .catch((err) => console.error("Error loading deals:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product, options) => {
    addItem(product, options);
    setToastMsg(`Added combo "${product.name}" to cart!`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#ff3838] via-orange-500 to-[#ff7b00] rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              ⚡ Super Savings Combos
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Exclusive Deals & Party Combos
            </h1>
            <p className="text-red-50 text-xs md:text-sm leading-relaxed">
              Order delicious meal bundles with friends and family to save up to 30% on every single order.
            </p>
          </div>
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center text-6xl shadow-inner animate-bounce-slow shrink-0">
            🎁
          </div>
        </div>

        {/* Combos Grid */}
        <div>
          <h2 className="text-xl font-black text-[#0d1b2a] mb-6 flex items-center gap-2">
            <i className="fas fa-fire text-[#ff3838]"></i>
            <span>Featured Combos on Sale Today</span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse space-y-4">
                  <div className="w-full h-48 bg-gray-200 rounded-2xl"></div>
                  <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <i className="fas fa-gift text-5xl text-gray-300 mb-3"></i>
              <h3 className="text-lg font-bold text-gray-700">No active combo deals right now</h3>
              <p className="text-xs text-gray-400 mt-1">Please check back again soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((item) => {
                const discountAmount =
                  item.originalPrice && Number(item.originalPrice) > Number(item.price)
                    ? Number(item.originalPrice) - Number(item.price)
                    : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {discountAmount > 0 && (
                          <div className="absolute top-3 left-3 bg-[#ff3838] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                            SAVE {formatCurrency(discountAmount)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#ff3838] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-black text-[#ff3838] block">
                          {formatCurrency(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="px-5 py-2.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-200 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <span>Grab Deal</span>
                        <i className="fas fa-arrow-right text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
    </div>
  );
};

export default DealsPage;
