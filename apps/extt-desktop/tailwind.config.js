/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        ibm: ["IBM Plex Mono"],
        mono: ["JetBrains Mono"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
