/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0b1020',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(167, 139, 250, 0.2), 0 10px 35px rgba(10, 15, 30, 0.45)',
      },
    },
  },
  plugins: [],
}
