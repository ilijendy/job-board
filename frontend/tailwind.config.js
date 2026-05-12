/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfaf7",
          100: "#d0f3ec",
          200: "#a3e6d9",
          300: "#6dd1c0",
          400: "#3ab8a3",
          500: "#1fa08d",
          600: "#158274",
          700: "#14695f",
          800: "#13554e",
          900: "#144742",
          950: "#072b29",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 4px 12px rgba(15, 23, 42, 0.08), 0 16px 40px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
}
