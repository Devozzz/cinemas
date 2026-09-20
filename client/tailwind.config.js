/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theatre: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#e11d48', // vibrant crimson
          600: '#dc2626', // primary red
          700: '#b91c1c', // deep ruby
          800: '#991b1b', // velvet red
          900: '#7f1d1d', // dark velvet
          950: '#450a0a',
          gold: '#D97706',
          dark: '#0F172A',
          cream: '#FCFAF7',
          surface: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 25px -5px rgba(220, 38, 38, 0.35)',
        'red-sm': '0 0 12px -2px rgba(220, 38, 38, 0.25)',
        'gold-glow': '0 0 20px -3px rgba(217, 119, 6, 0.35)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'float': '0 20px 40px -15px rgba(220, 38, 38, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        'screen-glow': 'screenGlow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        screenGlow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(220, 38, 38, 0.3))' },
          '100%': { opacity: '0.8', filter: 'drop-shadow(0 0 28px rgba(220, 38, 38, 0.55))' },
        }
      }
    },
  },
  plugins: [],
}
