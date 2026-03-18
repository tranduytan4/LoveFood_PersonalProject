import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../store/cartContext";

const ShoppingCart = () => {
  const { items, updateQty, removeItem } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-20 font-sans">
        <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center mb-8 animate-pulse text-[#ff3838]">
          <i className="fas fa-shopping-basket text-6xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Your cart is empty!
        </h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Looks like you haven't added any delicious food to your cart yet. Let's
          change that!
        </p>
        <Link
          to="/menu"
          className="px-8 py-4 bg-[#ff3838] text-white font-bold rounded-full hover:bg-[#e62e2e] transition shadow-lg hover:shadow-2xl"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] mb-8">
          Shopping <span className="text-[#ff3838]">Cart</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold border-b pb-4 mb-4 text-gray-800">
              Items ({items.reduce((acc, item) => acc + item.qty, 0)})
            </h2>

            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-gray-50 hover:shadow-md transition bg-gray-50/50"
                >
                  {/* Image */}
                  <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-white shadow-sm">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-[#ff3838] font-bold mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center bg-white border rounded-full shadow-sm overflow-hidden">
                      <button
                        onClick={() => updateQty(item.slug, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-[#ff3838] transition"
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="w-8 font-semibold text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.slug, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-[#ff3838] transition"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.slug)}
                      className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition"
                      title="Remove Item"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-28">
              <h2 className="text-xl font-bold border-b pb-4 mb-6 text-gray-800">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span className="font-semibold text-gray-800">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-green-500">Free</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-[#ff3838]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/orders")}
                className="w-full py-4 bg-[#ff3838] text-white font-bold rounded-xl text-lg hover:bg-[#e62e2e] hover:shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2"
              >
                Proceed to Checkout <i className="fas fa-arrow-right"></i>
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                <i className="fas fa-shield-alt mr-1"></i> Secure checkout powered
                by LoveFood
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
