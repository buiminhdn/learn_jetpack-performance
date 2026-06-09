/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Android / Jetpack Compose palette
        android: {
          DEFAULT: '#3DDC84',
          50: '#e8fbf0',
          100: '#c6f5d9',
          200: '#90ecb6',
          300: '#5ee398',
          400: '#3DDC84',
          500: '#22c46c',
          600: '#16a058',
          700: '#147d47',
          800: '#13633a',
          900: '#0f4f30',
        },
        brand: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d4d8e0',
          300: '#aeb5c4',
          400: '#828ca3',
          500: '#636d86',
          600: '#4e576e',
          700: '#40475a',
          800: '#383d4d',
          900: '#0d1117',
          950: '#080b10',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99,102,241,0.2), 0 8px 30px -8px rgba(99,102,241,0.35)',
        'glow-android': '0 0 0 1px rgba(61,220,132,0.25), 0 8px 30px -8px rgba(61,220,132,0.4)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.5)' },
          '70%': { boxShadow: '0 0 0 12px rgba(99,102,241,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0)' },
        },
        'flash': {
          '0%': { backgroundColor: 'rgba(239,68,68,0.55)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'flash-green': {
          '0%': { backgroundColor: 'rgba(61,220,132,0.55)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1s ease-out',
        flash: 'flash 0.6s ease-out',
        'flash-green': 'flash-green 0.6s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
