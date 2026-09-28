/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FBF7F0',
        forest: {
          DEFAULT: '#1F4B3F',
          dark: '#16372E',
          light: '#285F51',
        },
        mustard: {
          DEFAULT: '#C9973B',
          hover: '#B3832F',
          light: '#E5BF71',
        },
        charcoal: {
          DEFAULT: '#2B2B28',
          light: '#4A4A45',
          muted: '#6E6E69',
        },
        sand: {
          DEFAULT: '#DCD3C0',
          light: '#F4EFE6',
          dark: '#BDB198',
        }
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      borderWidth: {
        'hairline': '1px',
      }
    },
  },
  plugins: [],
}
