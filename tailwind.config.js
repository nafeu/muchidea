/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      primary: '#F8F4E3',
      secondary: '#2A2B2A',
      tertiary: '#FF8966',
      quaternary: '#E5446D',
      quinary: '#706C61'
    },
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
