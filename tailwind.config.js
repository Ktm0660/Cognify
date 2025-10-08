/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          light: "#ffffff",
          dark: "#0b1020"
        }
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(2,6,23,0.15)"
      }
    },
  },
  plugins: [],
};
