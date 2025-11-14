// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#8686AC',
          100: '#7272A3',
          200: '#5E5E9A', // Added
          300: '#4A4A91', // Added
          400: '#363688', // Added
          500: '#505081', 
          600: '#3A3A6B', // Added
          700: '#272757',
          800: '#1A1A43', // Added
          900: '#0F0E47',
        },
      },
    },
  },
  plugins: [],
}