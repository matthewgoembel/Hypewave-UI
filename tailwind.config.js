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
        DEFAULT: "1rem", // rounded by default
        xl: "1.25rem",
        '2xl': "1.5rem",
      },
       spacing: {
        // “33” here makes “w-33” → 8.25 rem (i.e. 132px), or whatever you choose
        // Adjust the value until it’s exactly the pixel size you want (e.g. “33px”: “33px”).
        '34': '34px',
        '129': '129px',
      }
    },
  },
  plugins: [],

  
};
