const {heroui} = require('@heroui/theme');
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "// If using App Router\r\n    \"./pages/**/*.{js,ts,jsx,tsx}\"",
    "// If using Pages Router\r\n    \"./components/**/*.{js,ts,jsx,tsx}\"",
    "./node_modules/@heroui/theme/dist/components/pagination.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [heroui()],
};
