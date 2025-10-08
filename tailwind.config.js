/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#6366F1",
          600: "#4F46E5",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          900: "#0F172A",
        },
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
