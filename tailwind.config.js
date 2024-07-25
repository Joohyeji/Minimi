/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' }
        }
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite'
      },
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
