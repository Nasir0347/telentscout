/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2557a7',
          hover: '#164081',
          light: '#e8f0fe',
        },
        gray: {
          50: '#fcfcfc',
          100: '#f2f2f2',
          200: '#e4e2e0',
          300: '#d4d2d0',
          400: '#9d9d9d',
          500: '#767676',
          600: '#595959',
          700: '#2d2d2d',
          800: '#1a1a1a',
          900: '#000000',
        },
        accent: {
          orange: '#ff5a1f',
          green: '#007f21',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.14)',
        'card-hover': '0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0.18)',
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
      }
    },
  },
  plugins: [],
}
