/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',    // Bleu bancaire
        secondary: '#059669',   // Vert
      }
    },
  },
  plugins: [],
}