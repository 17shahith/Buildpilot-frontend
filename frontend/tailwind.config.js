import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5722',
          light: '#FF7043',
          dark: '#E64A19',
          glow: 'rgba(255, 87, 34, 0.15)',
        },
        brandDark: {
          black: '#050505',
          charcoal: '#0F0F11',
          panel: '#16161A',
          border: '#24242B',
        },
        brandLight: {
          white: '#FFFFFF',
          slate: '#F4F4F6',
          panel: '#FAFAFC',
          border: '#E2E2E8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 87, 34, 0.25)',
        'glow-lg': '0 0 35px rgba(255, 87, 34, 0.4)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('light-theme', '.light-theme &')
    })
  ],
}
