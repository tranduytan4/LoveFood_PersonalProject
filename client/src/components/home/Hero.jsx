import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="min-h-[100vh] flex flex-wrap items-center gap-[20px] pt-[130px] pb-[40px] px-[9%] bg-[#f7f7f7]"
      id="home"
    >
      <div className="flex-[1_1_400px] flex flex-col items-start text-left">
        {/* Badge */}
        <div className="bg-[#ffe8cc] text-[#ff7b00] px-[20px] py-[10px] rounded-full font-bold text-[16px] mb-[10px]  inline-flex items-center gap-2 animate-bounce-slow">
          Best in Town 🍔
        </div>

        {/* Title */}
        <h3 className="font-['Nunito'] font-black leading-[0.9] mb-[15px] tracking-tight">
          <span className="block text-[65px] md:text-[80px] text-[#0d1b2a]">
            Food Made
          </span>
          <span className="block text-[65px] md:text-[80px] text-[#ff3838]">
            With Love
          </span>
        </h3>

        {/* Description */}
        <p className="text-[17px] text-[#666] py-[10px] leading-relaxed font-['Nunito'] max-w-[500px]">
          Satisfy your cravings with our handcrafted meals delivered straight to
          your doorstep. Every bite is a journey of flavors prepared with
          passion and the finest ingredients.
        </p>

        {/* Button */}
        <Link
          to="/menu"
          className="inline-block mt-[20px] px-[35px] py-[12px] bg-[#ff3838] text-white text-[18px] font-bold rounded-full shadow-lg hover:bg-[#e62e2e] hover:scale-105 transition-all duration-300 font-['Nunito']"
        >
          Order Now
        </Link>
      </div>

      <div className="flex-[1_1_400px] flex justify-center">
        <img
          src="/images/home-img.png"
          alt="home"
          className="w-full max-w-[500px] animate-floaty drop-shadow-2xl"
        />
      </div>
    </section>
  );
};

export default Hero;
