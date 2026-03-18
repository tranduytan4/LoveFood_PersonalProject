import { useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../store/cartContext";
import {
  FiShoppingCart,
  FiChevronRight,
  FiChevronLeft,
  FiArrowRight,
} from "react-icons/fi";

const PAGE_SIZE = 3;

const PopularSection = () => {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const popularItems = useMemo(
    () => [
      // Page 1
      {
        id: "p1",
        name: "Supreme Italian Pizza",
        price: 15.99,
        rating: 4.6,
        desc: "Loaded with fresh veggies, spicy pepperoni, and double cheese.",
        image: "/images/p-img-1.jpg",
      },
      {
        id: "p2",
        name: "Classic Bacon Burger",
        price: 12.5,
        rating: 4.4,
        desc: "Crispy bacon, caramelized onions, cheddar, and juicy beef patty.",
        image: "/images/p-img-2.jpg",
      },
      {
        id: "p3",
        name: "Strawberry Gelato",
        price: 6.99,
        rating: 4.2,
        desc: "Silky gelato with real strawberry swirls and creamy finish.",
        image: "/images/p-img-3.jpg",
      },

      // Page 2
      {
        id: "p4",
        name: "Salmon Sushi Set",
        price: 18.99,
        rating: 4.7,
        desc: "Fresh salmon nigiri & rolls, served with soy sauce and wasabi.",
        image: "/images/p-img-4.jpg",
      },
      {
        id: "p5",
        name: "Crispy Fried Chicken",
        price: 10.99,
        rating: 4.5,
        desc: "Golden crispy chicken with signature seasoning and dip sauce.",
        image: "/images/p-img-5.jpg",
      },
      {
        id: "p6",
        name: "Tonkotsu Ramen Bowl",
        price: 13.99,
        rating: 4.6,
        desc: "Rich pork broth, ramen noodles, chashu, egg, and scallions.",
        image: "/images/p-img-6.jpg",
      },

      // Page 3
      {
        id: "p7",
        name: "Grilled Steak Plate",
        price: 22.99,
        rating: 4.8,
        desc: "Tender grilled steak, butter herbs, and roasted side veggies.",
        image: "/images/p-img-7.jpg",
      },
      {
        id: "p8",
        name: "Chicken Tacos Trio",
        price: 9.49,
        rating: 4.3,
        desc: "Soft tortillas, seasoned chicken, salsa, and fresh guacamole.",
        image: "/images/p-img-8.jpg",
      },
      {
        id: "p9",
        name: "Honey Chrysanthemum Tea",
        price: 4.99,
        rating: 4.4,
        desc: "Refreshing chrysanthemum tea infused with natural honey, lightly sweet and soothing.",
        image: "/images/p-img-9.jpg",
      },
    ],
    [],
  );

  const totalPages = Math.ceil(popularItems.length / PAGE_SIZE);
  const isLastPage = page === totalPages - 1;

  const visibleItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    return popularItems.slice(start, start + PAGE_SIZE);
  }, [page, popularItems]);

  const nextPage = () => setPage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setPage((prev) => (prev - 1 + totalPages) % totalPages);

  const renderStars = (rating) => {
    const full = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < full ? "text-orange-400" : "text-gray-300"}`}
            title={rating}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-12">
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
        <div className="relative">
          {/* Prev / Next (desktop overlay) */}
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
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative p-5">
                  <div className="relative w-full h-52 rounded-2xl bg-gray-50 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Price badge */}
                  <div className="absolute top-8 left-8 bg-white text-[#ff3838] font-bold text-sm px-3 py-1 rounded-full shadow">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-2">
                    {renderStars(item.rating)}
                    <span className="text-xs text-gray-500">
                      ({item.rating.toFixed(1)})
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-extrabold text-gray-800">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>

                  <button
                    type="button"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#ff3838] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
                    onClick={() => {
                      addItem({
                        slug: item.id,
                        name: item.name,
                        price: item.price,
                        category: "Popular Category",
                        img: item.image,
                      });
                      navigate("/cart");
                    }}
                  >
                    <FiShoppingCart size={18} />
                    Add to cart
                  </button>
                </div>
              </article>
            ))}

            {/* View All card (chỉ page cuối) - Minimal Style */}
            {isLastPage && (
              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="flex flex-col items-center justify-center gap-3 transition hover:scale-105 active:scale-95 group"
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
      </div>
    </section>
  );
};

export default PopularSection;