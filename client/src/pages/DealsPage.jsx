import React, { useContext, useState } from "react";
import { CartContext } from "../store/cartContext";
import Footer from "../components/home/Footer";

const combos = [
  {
    slug: "combo-1-burger-meal",
    name: "Classic Burger Combo",
    description: "1 Classic Burger + 1 Fries + 1 Cola",
    originalPrice: 11.99,
    price: 8.99,
    rating: 4.8,
    img: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  },
  {
    slug: "combo-2-pizza-party",
    name: "Pizza Party Combo",
    description: "2 Large Pizzas + 1 Garlic Bread + 2 Drinks",
    originalPrice: 32.99,
    price: 24.99,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    slug: "combo-3-snack-time",
    name: "Snack Time Special",
    description: "Chicken Nuggets + Onion Rings + Lemonade",
    originalPrice: 14.99,
    price: 10.49,
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    slug: "combo-4-date-night",
    name: "Dinner for Two",
    description: "2 Premium Steaks + Salad + 2 Wine Glasses",
    originalPrice: 45.99,
    price: 38.99,
    rating: 4.9,
    img: "https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  },
  {
    slug: "combo-5-family-feast",
    name: "Weekend Family Feast",
    description: "1 Bucket Fried Chicken + 3 Sides + 4 Drinks",
    originalPrice: 42.00,
    price: 34.50,
    rating: 4.7,
    img: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  },
  {
    slug: "combo-6-healthy",
    name: "Healthy Balance",
    description: "Avocado Toast + Greek Salad + Fresh Smoothie",
    originalPrice: 20.50,
    price: 16.99,
    rating: 4.5,
    img: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  },
  {
    slug: "combo-7-student",
    name: "Student Saver Meal",
    description: "1 Cheeseburger + Med Fries + Soda",
    originalPrice: 10.50,
    price: 7.99,
    rating: 4.7,
    img: "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  },
  {
    slug: "combo-8-vegan",
    name: "Vegan Power Combo",
    description: "Plant Burger + Sweet Potato Fries + Detox Juice",
    originalPrice: 16.99,
    price: 13.99,
    rating: 4.8,
    img: "https://images.pexels.com/photos/1639556/pexels-photo-1639556.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  },
  {
    slug: "combo-9-dessert",
    name: "Sweet Tooth Box",
    description: "2 Slices Cake + 2 Ice Creams + 2 Coffees",
    originalPrice: 25.00,
    price: 19.99,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&q=80&w=600&h=400",
  },
];

const DealsPage = () => {
  const { addItem } = useContext(CartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const totalPages = Math.ceil(combos.length / ITEMS_PER_PAGE);
  const currentCombos = combos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#ffe8cc] text-[#ff7b00] px-4 py-2 rounded-full font-bold text-sm mb-4 animate-bounce-slow">
            <i className="fas fa-tag"></i> Hot Offers!
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0d1b2a] mb-4">
            Exclusive <span className="text-[#ff3838]">Deals & Combos</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Grab our delicious combos at unbeatable prices. Treat yourself and
            your friends without breaking the bank!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCombos.map((combo) => {
            const savings = (combo.originalPrice - combo.price).toFixed(2);
            return (
              <div
                key={combo.slug}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col relative group"
              >
                {/* Savings Badge */}
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#ff7b00] to-[#ff3838] text-white font-bold px-3 py-1 rounded-full shadow-md text-sm">
                  Save ${savings}
                </div>

                <div className="relative h-64 overflow-hidden">
                  <img
                    src={combo.img}
                    alt={combo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {combo.name}
                  </h3>
                  <p className="text-gray-500 mb-4 flex-grow">
                    {combo.description}
                  </p>

                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <span className="text-gray-400 line-through text-sm font-semibold block mb-1">
                        ${combo.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-3xl font-black text-[#ff3838]">
                        ${combo.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        addItem({
                          ...combo,
                          category: "Combo",
                        })
                      }
                      className="px-6 py-3 bg-[#ff3838] text-white font-bold rounded-full hover:bg-[#e62e2e] hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <i className="fas fa-cart-plus"></i> Grab Deal
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`min-w-[120px] px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#ff3838] text-white hover:bg-[#e62e2e] shadow-lg shadow-red-200"
              }`}
            >
              <i className="fas fa-arrow-left mr-2"></i> Prev
            </button>
            <div className="text-gray-600 font-semibold px-4">
              Page <span className="text-[#ff3838]">{currentPage}</span> of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`min-w-[120px] px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#ff3838] text-white hover:bg-[#e62e2e] shadow-lg shadow-red-200"
              }`}
            >
              Next <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default DealsPage;
