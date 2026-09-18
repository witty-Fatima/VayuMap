/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#00E400',
          moderate: '#FFE400',
          unhealthySG: '#FFA500',
          unhealthy: '#FF0000',
          veryUnhealthy: '#8B0000',
          hazardous: '#4B0082',
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}
