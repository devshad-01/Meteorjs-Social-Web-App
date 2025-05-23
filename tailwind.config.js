/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './imports/ui/**/*.{js,jsx,ts,tsx}',
    './client/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
};