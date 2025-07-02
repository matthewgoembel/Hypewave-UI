// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3dadff",
        secondary: "#99ffff",
        base: "#0a1f4a",
        panel: "#061738",
        chat: "#07183b",
      },
      borderRadius: {
        DEFAULT: "1rem",
        xl: "1.25rem",
        '2xl': "1.5rem",
      },
      spacing: {
        '34': '34px',
        '129': '129px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),  // ✅ Added this line
  ],
};
