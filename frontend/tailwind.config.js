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
          500: '#505081', 
          700: '#272757',
          900: '#0F0E47',
        },
      },
    },
  },
  plugins: [],
}