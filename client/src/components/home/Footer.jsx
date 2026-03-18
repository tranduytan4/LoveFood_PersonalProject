import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#ff3838] text-white pt-14 font-['Nunito'] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-b border-[#ff8080]/30 pb-10 mb-0 px-4 md:px-[9%]">
        {/* Brand & Social Section */}
        <div className="flex flex-col items-center justify-center h-full gap-4 lg:pr-8">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-[40px] font-black text-white hover:scale-105 transition-transform origin-left"
          >
            <i className="fas fa-utensils text-[36px]" />
            <span className="tracking-tight">LoveFood</span>
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <a
              href="https://www.facebook.com/DuyTan2107"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#ff3838] hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <i className="fab fa-facebook-f text-[20px]"></i>
            </a>
            <a
              href="https://www.instagram.com/t.dtan_/"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#ff3838] hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <i className="fab fa-instagram text-[20px]"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/tdtan21/"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#ff3838] hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <i className="fab fa-linkedin-in text-[20px]"></i>
            </a>
          </div>
        </div>

        {/* Contact Info Section 1 */}
        <div className="flex flex-col gap-3">
          <div>
            <h4 className="font-extrabold text-[1.15rem] mb-2 text-white">
              Address
            </h4>
            <p className="text-red-50 text-[15px] leading-relaxed">
              556 Hoang Dieu, Binh Thuan, Hai Chau, Đa Nang
            </p>
          </div>
          <div className="mt-1">
            <h4 className="font-extrabold text-[1.15rem] mb-2 text-white">
              Hotline
            </h4>
            <a
              href="tel:0793946182"
              className="text-white font-bold text-[17px] hover:text-gray-200 transition-colors block"
            >
              0793 946 182
            </a>
          </div>
          <div className="mt-1">
            <h4 className="font-extrabold text-[1.15rem] mb-2 text-white">
              Email
            </h4>
            <a
              href="mailto:tranduytannd13@gmail.com"
              className="text-red-50 text-[15px] hover:text-white hover:underline transition-colors"
            >
              tranduytannd13@gmail.com
            </a>
          </div>
        </div>

        {/* Contact Info Section 2 */}
        <div className="flex flex-col gap-5">
          <div>
            <h4 className="font-extrabold text-[1.15rem] mb-2 text-white">
              LoveFood Platform
            </h4>
            <p className="text-red-50 text-[15px] mb-1.5 leading-relaxed">
              <span className="font-semibold text-white">Owner:</span> Tran Duy
              Tan
            </p>
            <p className="text-red-50 text-[15px] leading-relaxed">
              The smartest, fastest, and most convenient online food ordering
              platform.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-[1.15rem] mb-2 text-white">
              Opening Hours
            </h4>
            <p className="text-red-50 text-[15px] leading-relaxed">
              Everyday: 9:00 AM - 12:00 PM
            </p>
          </div>
        </div>
      </div>

      {/* Modern E-commerce Bottom Bar */}
      <div className="bg-[#ba1818] py-5 mt-6 border-t border-[#d32f2f]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-red-50 text-[15px] px-4 md:px-[9%] font-medium">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white font-extrabold tracking-wide">
              LoveFood
            </span>{" "}
            by Trần Duy Tân.
          </p>
          <div className="flex gap-6">
            <Link
              to="/"
              className="hover:text-white hover:-translate-y-[1px] transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bg-white after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="hover:text-white hover:-translate-y-[1px] transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bg-white after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
