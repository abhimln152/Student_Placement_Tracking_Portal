/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Blue-800
        secondary: "#3B82F6", // Blue-500
        accent: "#F59E0B", // Amber-500
      }
    },
  },
  plugins: [],
}
