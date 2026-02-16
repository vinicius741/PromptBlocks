/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'block-role': '#3b82f6',
        'block-task': '#10b981',
        'block-context': '#f59e0b',
        'block-constraints': '#ef4444',
        'block-tone': '#8b5cf6',
        'block-output-format': '#06b6d4',
        'block-examples': '#ec4899',
      },
    },
  },
  plugins: [],
}
