/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7E8E1C",
        bgMain: "#F5F5F5",
        dimText: "#34352A",
        bgDimWhite: "#F9F9F9",
      },
    },
    fontFamily: {
      open_sans: ["Open Sans"],
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
