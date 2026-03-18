import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CartContext } from "../store/cartContext";
import Footer from "../components/home/Footer";

const categories = ["All", "Burger", "Pizza", "Drink", "Dessert"];

const mockMenu = [
  { slug: "classic-burger", name: "Classic Beef Burger", category: "Burger", price: 5.99, rating: 4.5, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400&h=300" },
  { slug: "cheese-burger", name: "Double Cheese Burger", category: "Burger", price: 7.99, rating: 4.8, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400&h=300" },
  { slug: "chicken-burger", name: "Crispy Chicken Burger", category: "Burger", price: 6.49, rating: 4.6, img: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },
  { slug: "bacon-burger", name: "Smoky Bacon Burger", category: "Burger", price: 8.99, rating: 4.7, img: "https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },

  { slug: "pepperoni-pizza", name: "Pepperoni Pizza", category: "Pizza", price: 12.99, rating: 4.7, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400&h=300" },
  { slug: "margherita-pizza", name: "Margherita Pizza", category: "Pizza", price: 10.99, rating: 4.6, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400&h=300" },
  { slug: "bbq-chicken-pizza", name: "BBQ Chicken Pizza", category: "Pizza", price: 14.50, rating: 4.8, img: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },
  { slug: "veggie-Supreme-pizza", name: "Veggie Supreme", category: "Pizza", price: 11.99, rating: 4.5, img: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },

  { slug: "coca-cola", name: "Coca Cola", category: "Drink", price: 1.99, rating: 4.2, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400&h=300" },
  { slug: "lemonade", name: "Fresh Lemonade", category: "Drink", price: 2.49, rating: 4.5, img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400&h=300" },
  { slug: "iced-coffee", name: "Iced Caramel Coffee", category: "Drink", price: 3.99, rating: 4.7, img: "https://images.pexels.com/photos/1193335/pexels-photo-1193335.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },
  { slug: "orange-juice", name: "100% Orange Juice", category: "Drink", price: 2.99, rating: 4.3, img: "https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },

  { slug: "chocolate-cake", name: "Chocolate Cake", category: "Dessert", price: 4.99, rating: 4.9, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400&h=300" },
  { slug: "ice-cream", name: "Vanilla Ice Cream", category: "Dessert", price: 3.49, rating: 4.4, img: "https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },
  { slug: "cheesecake", name: "New York Cheesecake", category: "Dessert", price: 5.50, rating: 4.8, img: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },
  { slug: "brownie", name: "Walnut Fudge Brownie", category: "Dessert", price: 3.99, rating: 4.7, img: "https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },
  { slug: "vegan-burger", name: "Vegan Plant Burger", category: "Burger", price: 7.49, rating: 4.6, img: "https://images.pexels.com/photos/1639556/pexels-photo-1639556.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },
  { slug: "hawaiian-pizza", name: "Hawaiian Pizza", category: "Pizza", price: 13.99, rating: 4.4, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400&h=300" },
  { slug: "mango-smoothie", name: "Mango Smoothie", category: "Drink", price: 4.99, rating: 4.8, img: "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1" },
  { slug: "tiramisu", name: "Classic Tiramisu", category: "Dessert", price: 6.99, rating: 4.9, img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=400&h=300" },
];

const MenuPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const { addItem } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Switch back to "All" category if a new search is performed
  useEffect(() => {
    if (searchQuery) {
      setActiveTab("All");
      setCurrentPage(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredMenu = mockMenu.filter((item) => {
    const matchesCategory = activeTab === "All" || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredMenu.length / ITEMS_PER_PAGE);
  const currentItems = filteredMenu.slice(
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
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0d1b2a] mb-4">
            Our <span className="text-[#ff3838]">Menu</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Discover our delicious meals and drinks crafted just for you
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2 rounded-full font-bold text-sm md:text-base border-2 transition-all duration-300 ${
                activeTab === cat
                  ? "bg-[#ff3838] border-[#ff3838] text-white shadow-md shadow-red-200 scale-105"
                  : "bg-white border-transparent text-gray-600 hover:border-[#ff3838] hover:text-[#ff3838]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="text-center mb-8 bg-red-50 py-4 px-6 rounded-2xl mx-auto w-fit border border-red-100">
            <p className="text-gray-700 text-lg">
              Showing results for: <span className="font-bold text-[#ff3838]">"{searchQuery}"</span>
            </p>
            <button 
              onClick={() => setSearchParams({})} 
              className="mt-2 text-sm text-gray-500 underline hover:text-gray-800 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Menu Grid */}
        {filteredMenu.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No items found</h3>
            <p className="text-gray-500">
              We couldn't find any items matching "{searchQuery}".
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentItems.map((item) => (
            <div
              key={item.slug}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full shadow text-sm font-bold text-yellow-500 flex items-center gap-1">
                  <i className="fas fa-star" /> {item.rating}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.name}
                </h3>
                <div className="text-gray-500 text-sm mb-4 bg-gray-100 w-fit px-2 py-1 rounded">
                  {item.category}
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-black text-[#ff3838]">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="w-10 h-10 rounded-full bg-[#ff3838] hover:bg-[#e62e2e] text-white flex items-center justify-center transition-colors shadow-lg shadow-red-200 active:scale-95"
                    title="Add to Cart"
                  >
                    <i className="fas fa-cart-plus" />
                  </button>
                </div>
              </div>
            </div>
            ))}
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
          </>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default MenuPage;
