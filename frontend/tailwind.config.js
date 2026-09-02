/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // "teal" now holds the deep indigo brand color from the E-connect logo
        teal: { DEFAULT: "#241C5E", dark: "#171142", light: "#3A2F8C" },
        // "ochre" now holds the violet-blue accent from the logo mark
        ochre: { DEFAULT: "#6D5DFB", dark: "#4F3FE0", light: "#9B8CFF" },
        ivory: "#F6F5FB",
        ink: "#1B1730",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #9B8CFF 0%, #6D5DFB 45%, #4F3FE0 100%)",
      },
    },
  },
  plugins: [],
};