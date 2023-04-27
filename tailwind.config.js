/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        dokdo: ['Dokdo', 'sans-serif'],
        lavishly_yours: ['Lavishly Yours', 'cursive'],
        rock_salt: ['Rock Salt', 'cursive'],
        tangerine: ['Tangerine', 'cursive'],
      },
    },
  },
  plugins: [],
}
