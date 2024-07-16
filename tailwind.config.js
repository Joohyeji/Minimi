/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'minimi-green': '#B3F289'
      },
      fontFamily: {
        sans: ['pretendard', 'Noto Sans KR', 'sans-serif']
      }
    }
  },
  plugins: []
}
