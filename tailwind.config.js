/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          primary: 'var(--color-primary)',
          accent: 'var(--color-accent)',
          border: 'var(--color-border)',
          highlight: 'var(--color-highlight)',
          seal: 'var(--color-seal)',
        },
        'pop-pink': {
          DEFAULT: '#FF3860',
          50: '#FFF0F3',
          100: '#FFE1E6',
          200: '#FFC8D3',
          300: '#FFA0B3',
          400: '#FF5C77',
          500: '#FF3860',
          600: '#E01E47',
          700: '#B81236',
        },
        'warm-green': {
          50: '#F4F9F4',
          100: '#E8F3E8',
          200: '#DCEDDC',
          300: '#CBE4CB',
          400: '#B2D8B2',
          500: '#8FC58F',
        },
        butter: {
          50: '#FFFFF0',
          100: '#FFFDE1',
          200: '#FDF0A6',
          300: '#FFE866',
          400: '#FFF275',
          500: '#F5DC38',
          600: '#D4B817',
        },
        strawberry: {
          50: '#FFF0F3',
          100: '#FFE1E6',
          200: '#FFC8D3',
          300: '#FFA0B3',
          400: '#FF6B8B',
          500: '#FF3860',
          600: '#E01E47',
          700: '#B81236',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'Georgia', 'serif'],
        handwritten: ['Caveat', 'Patrick Hand', 'cursive'],
      },
      boxShadow: {
        'stationery': '0 8px 30px -4px rgba(31, 46, 35, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'paper-card': '0 6px 24px -2px rgba(31, 46, 35, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.95)',
        'stamp': '0 2px 8px rgba(255, 56, 96, 0.3)',
        'butter': '0 10px 25px -3px rgba(255, 232, 102, 0.5), 0 4px 10px -2px rgba(245, 220, 56, 0.3)',
        'pop-pink': '0 10px 25px -3px rgba(255, 56, 96, 0.35)',
      },
      keyframes: {
        'coin-flip': {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(90deg) scale(1.15)' },
          '100%': { transform: 'rotateY(180deg) scale(1)' },
        },
        'mascot-wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-10deg) translateY(-2px)' },
          '75%': { transform: 'rotate(10deg) translateY(-1px)' },
        },
        'coin-drop': {
          '0%': { transform: 'translateY(-40px) scale(0.5)', opacity: '0' },
          '60%': { transform: 'translateY(10px) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        }
      },
      animation: {
        'coin-flip': 'coin-flip 0.7s ease-in-out forwards',
        'mascot-wave': 'mascot-wave 3s ease-in-out infinite',
        'coin-drop': 'coin-drop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
};
