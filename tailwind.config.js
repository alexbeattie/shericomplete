module.exports = {
  darkMode: ['selector', '[data-mode="dark"]'],
  
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['EB Garamond', 'serif'],
        secondary: ['Alegreya Sans', 'sans-serif'],
        third: ['Urbanist', 'sans-serif'],
        fourth: ['source-sans-3', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};