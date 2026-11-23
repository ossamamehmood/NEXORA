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
        brand: {
          mint: '#02FEDC',
          indigo: '#5A5CFF',
          magenta: '#F502FD',
        },
        dark: {
          primary: '#08090D',
          secondary: '#11131A',
          surface: '#171A23',
          elevated: '#1F2330',
          border: '#232838',
          text: '#F5F7FA',
          muted: '#969BAA',
        },
        light: {
          primary: '#F4F6FB',
          secondary: '#FFFFFF',
          surface: '#EAEFF8',
          border: '#D3DAE6',
          text: '#0D111C',
          muted: '#525B75',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
