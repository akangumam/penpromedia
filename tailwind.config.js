/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f6fb',
          100: '#e7edf6',
          200: '#cbd9ea',
          300: '#9dbfdb',
          400: '#699ec6',
          500: '#4582b2',
          600: '#336894',
          700: '#2a5378',
          800: '#254764',
          900: '#233c53',
          950: '#172738',
        },
        accent: {
          500: '#F97316', // Orange-500
          600: '#EA580C', // Orange-600
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
