/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: (theme) => ({
        "login-bg": "url('/login-background.jpg')",
      }),
      fontFamily: {
        sans: ['"Open Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
