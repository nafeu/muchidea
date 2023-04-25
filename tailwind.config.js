/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      primary: '#d2dae2',
      secondary: '#1e272e'
    },
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
