/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-smoke': '#fef7f0',
        'brand-cream': '#fef3e8',
        'brand-dusk': '#1a1a2e',
        'brand-sand': '#f4e4d7',
        'brand-saffron': '#d84315',
        'brand-slate': '#64748b',
        'brand-teal': '#14b8a6',
        'brand-orange-dark': '#bf360c',
        'brand-orange': '#d84315',
        'brand-orange-light': '#ff6f3c',
        'brand-gold-dark': '#b8860b',
        'brand-gold': '#daa520',
        'brand-gold-light': '#ffd700',
        'brand-maroon-dark': '#5d1f1f',
        'brand-maroon': '#800020',
        'brand-maroon-light': '#a52a2a',
        'brand-temple-red': '#c41e3a',
        'brand-temple-gold': '#daa520',
        'brand-temple-cream': '#fff8dc',
        'brand-temple-brown': '#8b4513',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

