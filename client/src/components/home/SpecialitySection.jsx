import React from "react";
import { useNavigate } from "react-router-dom";

const specialityItems = [
  {
    img: "/images/s-img-1.jpg",
    icon: "/images/s-1.png",
    title: "Classic Beef Burger",
    desc: "Juicy grilled beef, melted cheddar, crisp lettuce and our signature house sauce. One bite and you’re hooked.",
  },
  {
    img: "/images/s-img-2.jpg",
    icon: "/images/s-2.png",
    title: "Italian Supreme Pizza",
    desc: "Golden crispy crust layered with rich tomato sauce, premium toppings and stretchy mozzarella. Served hot and irresistible.",
  },
  {
    img: "/images/s-img-3.jpg",
    icon: "/images/s-3.png",
    title: "Fresh Strawberry Ice Cream",
    desc: "Creamy, smooth and naturally sweet with real strawberry flavor. The perfect cool treat for any moment.",
  },
  {
    img: "/images/s-img-4.jpg",
    icon: "/images/s-4.png",
    title: "Fresh Mix Mocktail",
    desc: "Handcrafted blend of fresh fruits and sparkling refreshment. Light, vibrant and instantly uplifting.",
  },
  {
    img: "/images/s-img-5.jpg",
    icon: "/images/s-5.png",
    title: "Premium Chocolate Bites",
    desc: "Rich, velvety chocolate with a perfectly balanced sweetness. A luxurious finish to every meal.",
  },
  {
    img: "/images/s-img-6.jpg",
    icon: "/images/s-6.png",
    title: "Morning Coffee Combo",
    desc: "Bold aromatic coffee paired with a buttery flaky croissant. The perfect start to your day.",
  },
];

const SpecialitySection = () => {
  const navigate = useNavigate();

  return (
    <section className="px-[9%] py-[20px] bg-[#f7f7f7]" id="speciality">
      <div className="text-center mb-10">
        <h1 className="text-[50px] font-['Nunito'] font-extrabold text-[#0d1b2a]">
          Our <span className="text-[#ff3838]">Speciality</span>
        </h1>
        <div className="w-[100px] h-[4px] bg-[#ff3838] mx-auto rounded-full my-[10px]"></div>
        <p className="text-[16px] text-[#666] mt-2 font-['Nunito'] max-w-[600px] mx-auto">
          Explore our wide variety of categories and find your favorite meal of
          the day.
        </p>
      </div>

      <div className="flex flex-wrap gap-[15px]">
        {specialityItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate("/menu")}
            className="flex-[1_1_300px] relative overflow-hidden shadow-[0_.5rem_1rem_rgba(0,0,0,.1)] border-[1px] border-[rgba(0,0,0,.3)] cursor-pointer rounded-[5px] group bg-white"
          >
            <div className="absolute top-[-100%] left-0 h-full w-full group-hover:top-0 transition-all duration-200">
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center bg-white p-[20px] group-hover:translate-y-[100%] transition-transform duration-200 h-full flex flex-col justify-center items-center">
              <img
                src={item.icon}
                alt="icon"
                className="my-[15px] h-[64px] w-[64px] object-contain"
              />

              <h3 className="text-[25px] text-[#333] font-['Nunito'] font-semibold">
                {item.title}
              </h3>

              <p className="text-[16px] text-[#666] py-[10px] font-['Nunito']">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialitySection;
