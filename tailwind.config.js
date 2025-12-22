/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    'fa-solid', 'fa-globe', 'fa-map-marker-alt', 'fa-users', 'fa-calendar-alt'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

