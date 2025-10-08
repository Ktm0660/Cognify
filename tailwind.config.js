/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/layouts/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        surface: {
          DEFAULT: "#0b1020",
          50: "#f6f7fb",
          100: "#eef0f7",
        }
      },
      boxShadow: {
        float: "0 10px 30px rgba(2,6,23,.08)",
        glow: "0 10px 30px rgba(99,102,241,.25)",
      }
    },
  },
  plugins: [],
  safelist: [
    "from-violet-500","via-fuchsia-500","to-amber-400",
    "from-indigo-500","to-cyan-400",
    "from-sky-500","to-emerald-400"
  ]
};
