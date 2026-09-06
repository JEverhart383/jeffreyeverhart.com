/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1d58a6',
          yellow: '#f2b502',
          'light-blue': '#75a6e7',
          dark: '#303434',
        },
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        brand: ['Yellowtail', 'cursive'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.serif').join(', '),
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: theme('colors.gray.800'),
            a: { color: theme('colors.brand.blue') },
            h1: { fontFamily: theme('fontFamily.sans').join(', ') },
            h2: { fontFamily: theme('fontFamily.sans').join(', ') },
            h3: { fontFamily: theme('fontFamily.sans').join(', ') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
