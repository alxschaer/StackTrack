/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ledger: {
          bg: '#12161d',
          surface: '#1a1f27',
          surfaceAlt: '#20262f',
          border: '#2a313c',
          borderSoft: '#232a33',
          text: '#eef1f5',
          textSoft: '#8b93a1',
          textFaint: '#5c6470',
          gold: '#c9a15a',
          sage: '#6fae7f',
          rust: '#c1666b',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
