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
          terracotta: 'var(--color-terracotta)',
        },
        ivory: '#F5F1E7',
        cream: {
          100: '#FFFDF8',
          200: '#EAE3D3',
        },
        beige: {
          100: '#E6DDCB',
          200: '#D8CCB5',
          300: '#C8BA9E',
        },
        sage: {
          100: '#E3E9DC',
          200: '#C7D4BD',
          300: '#9DAA8D',
          400: '#68745F',
          500: '#4A5443',
        },
        terracotta: {
          100: '#F4E5E0',
          200: '#DDB2A4',
          300: '#A85D4A',
          400: '#8C4B3A',
        },
        charcoal: {
          100: '#525048',
          200: '#3D3B35',
          300: '#292824',
          400: '#1E1D19',
          500: '#141311',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(41, 40, 36, 0.05), inset 0 0 0 1px rgba(255, 253, 248, 0.8)',
        'paper-hover': '0 8px 30px -4px rgba(41, 40, 36, 0.08)',
        'coin': '0 6px 16px -2px rgba(41, 40, 36, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
      },
      keyframes: {
        'coin-flip': {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(90deg) scale(1.1)' },
          '100%': { transform: 'rotateY(180deg) scale(1)' },
        },
      },
      animation: {
        'coin-flip': 'coin-flip 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      }
    },
  },
  plugins: [],
};
