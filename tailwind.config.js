const { fontFamily } = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      primary: ['var(--roboto)', ...fontFamily.sans]
    },
    extend: {
      keyframes: {
        pulse: {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.5)",
            opacity: "0.5",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },

        ping: {
          "0%": {
            transform: "scale(1)",
            opacity: " 1",
          },
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
      animation: {
        "animate-pulse": {
          animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
        "animate-ping": {
          animation: "ping 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
      },
    },
  },
  plugins: [],
};
