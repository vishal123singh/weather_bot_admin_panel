export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
   animation: {
    scaleIn: 'scaleIn 0.25s ease-out',
  },
  keyframes: {
    scaleIn: {
      '0%': { opacity: 0, transform: 'scale(0.9)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
  }
}

