/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B4FE9",
        secondary: "#8B7FF7",
        accent: "#FF6B6B",
        success: "#4ECDC4",
        warning: "#FFE66D",
        info: "#4A90E2"
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}