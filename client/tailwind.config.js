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
        sports: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        brand: {
          blue: '#2563eb',
          cyan: '#06b6d4',
          purple: '#7c3aed',
          amber: '#f59e0b',
          rose: '#f43f5e',
          darkBg: '#0f172a',
          darkCard: '#1e293b',
          darkBorder: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(34, 197, 94, 0.3)',
        'glow-blue': '0 0 20px -5px rgba(37, 99, 235, 0.3)',
      }
    },
  },
  plugins: [],
}
