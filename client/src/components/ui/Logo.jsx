import React from "react";
import { Link } from "react-router-dom";

const Logo = ({
  variant = "default", // 'default' | 'light' | 'iconOnly'
  size = "md", // 'sm' | 'md' | 'lg' | 'xl'
  clickable = true,
  className = "",
}) => {
  const sizeConfig = {
    sm: {
      img: "w-9 h-9",
      text: "text-lg",
      subtitle: "text-[8px]",
    },
    md: {
      img: "w-11 h-11",
      text: "text-2xl",
      subtitle: "text-[10px]",
    },
    lg: {
      img: "w-14 h-14",
      text: "text-3xl",
      subtitle: "text-xs",
    },
    xl: {
      img: "w-16 h-16",
      text: "text-4xl",
      subtitle: "text-xs",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
    >
      {/* 🍔 Real Artisan Burger Image Badge */}
      <div className="relative flex items-center justify-center shrink-0">
        <img
          src="/images/logo.png"
          alt="LoveFood Logo"
          className={`${currentSize.img} object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 pointer-events-none`}
        />
      </div>

      {/* Brand Typography */}
      {variant !== "iconOnly" && (
        <div className="flex flex-col leading-none">
          <div
            className={`font-black tracking-tight ${currentSize.text} flex items-center font-['Nunito']`}
          >
            <span
              className={
                variant === "light"
                  ? "text-white drop-shadow-sm tracking-tight"
                  : "text-slate-900 tracking-tight"
              }
            >
              Love
            </span>
            <span className="text-[#ff3838] ml-0.5 tracking-tight">Food</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7b00] ml-1.5 self-center"></span>
          </div>

          <span
            className={`font-black uppercase tracking-[0.16em] font-['Nunito'] mt-0.5 ${
              currentSize.subtitle
            } ${
              variant === "light"
                ? "text-red-100"
                : "text-slate-400 group-hover:text-slate-600"
            } transition-colors`}
          >
            Food Made With Love
          </span>
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link
        to="/"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="inline-block hover:opacity-95 transition-opacity focus:outline-none"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
