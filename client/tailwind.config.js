/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandRed: "#ff3838",
        brandRed: "#ff4b4b",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0rem)" },
          "50%": { transform: "translateY(3rem)" },
        },
      },
      animation: {
        floaty: "floaty 3s linear infinite",
      },
    },
  },
  plugins: [],
};
