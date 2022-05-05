module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ibm: ["IBM Plex Mono"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
