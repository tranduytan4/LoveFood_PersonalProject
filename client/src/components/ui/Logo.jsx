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
      box: "w-8 h-8",
      emojiSize: "text-lg",
      text: "text-xl",
      subtitle: "text-[9px]",
    },
    md: {
      box: "w-11 h-11",
      emojiSize: "text-2xl",
      text: "text-2xl",
      subtitle: "text-[10px]",
    },
    lg: {
      box: "w-14 h-14",
      emojiSize: "text-3xl",
      text: "text-3xl",
      subtitle: "text-xs",
    },
    xl: {
      box: "w-16 h-16",
      emojiSize: "text-4xl",
      text: "text-4xl",
      subtitle: "text-sm",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* 🍔 3D Radiant Brand Badge with Burger Icon */}
      <div
        className={`${currentSize.box} rounded-2xl bg-gradient-to-tr from-[#e62e2e] via-[#ff3838] to-[#ff7b00] flex items-center justify-center shadow-lg shadow-red-300/60 ring-2 ring-white group-hover:scale-105 group-hover:shadow-red-400/80 transition-all duration-300 shrink-0 relative overflow-hidden`}
      >
        {/* Subtle glossy top specular highlight */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-white/25 rounded-full blur-[2px]"></div>

        {/* 🍔 Icon */}
        <span
          className={`${currentSize.emojiSize} leading-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] transition-transform group-hover:rotate-6`}
          role="img"
          aria-label="Burger Logo"
        >
          🍔
        </span>
      </div>

      {/* Brand Typography */}
      {variant !== "iconOnly" && (
        <div className="flex flex-col leading-none">
          <div
            className={`font-black font-['Nunito'] tracking-tight ${currentSize.text} flex items-center`}
          >
            <span
              className={
                variant === "light"
                  ? "text-white drop-shadow-sm"
                  : "text-[#0d1b2a]"
              }
            >
              Love
            </span>
            <span className="text-[#ff3838] drop-shadow-sm ml-0.5">Food</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7b00] ml-1 self-end mb-1 animate-pulse"></span>
          </div>
          <span
            className={`font-black uppercase tracking-widest font-['Nunito'] mt-1 ${
              currentSize.subtitle
            } ${
              variant === "light"
                ? "text-red-100"
                : "text-gray-400 group-hover:text-gray-600"
            } transition-colors`}
          >
            Fresh • Fast • Delicious
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
