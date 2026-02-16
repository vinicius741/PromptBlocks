/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(14, 165, 233, 0.2), 0 15px 35px -20px rgba(14, 165, 233, 0.6)',
      },
    },
  },
  plugins: [],
}
