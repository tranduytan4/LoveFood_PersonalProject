import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../store/cartContext";

const MyOrders = () => {
  const { items, clear } = useContext(CartContext);
  const [isPaid, setIsPaid] = useState(false);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePayment = () => {
    // Simulate payment process
    setTimeout(() => {
      setIsPaid(true);
      clear();
    }, 1500);
  };

  if (isPaid) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-20 font-sans">
        <div className="w-40 h-40 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <i className="fas fa-check-circle text-6xl"></i>
        </div>
        <h2 className="text-4xl font-extrabold text-[#0d1b2a] mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-500 mb-8 max-w-md text-center text-lg">
          Thank you for your order. Your delicious food is being prepared and
          will be on its way soon!
        </p>
        <Link
          to="/"
          className="px-8 py-4 bg-[#ff3838] text-white font-bold rounded-full hover:bg-[#e62e2e] transition shadow-lg hover:shadow-2xl"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-20 font-sans">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <i className="fas fa-receipt text-5xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          No Pending Orders
        </h2>
        <p className="text-gray-500 mb-8">
          You don't have any items waiting for payment.
        </p>
        <Link
          to="/menu"
          className="px-6 py-3 bg-[#ff3838] text-white font-bold rounded-full hover:bg-[#e62e2e] transition shadow-md"
        >
          Order Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#0d1b2a] mb-8">
          My <span className="text-[#ff3838]">Orders</span>
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-700">Order Summary #LF-{Math.floor(Math.random() * 10000)}</h2>
          </div>

          {/* List of items (Row by Row) */}
          <div className="px-6 py-2">
            {items.map((item, index) => (
              <div
                key={item.slug}
                className={`py-4 flex items-center justify-between ${
                  index !== items.length - 1 ? "border-b border-dashed border-gray-200" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qty: <span className="font-semibold text-gray-700">{item.qty}</span> x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-gray-800 text-lg">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2 text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-gray-600">
              <span>Tax (5%)</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-8">
              <span className="text-xl font-bold text-gray-800">Total to Pay</span>
              <span className="text-3xl font-black text-[#ff3838]">${total.toFixed(2)}</span>
            </div>

            {/* Payment Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                to="/cart"
                className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition text-center"
              >
                Edit Cart
              </Link>
              <button
                onClick={handlePayment}
                className="px-8 py-3 bg-gradient-to-r from-[#ff7b00] to-[#ff3838] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-credit-card"></i> Pay Now & Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
