/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Fondos
        ink: {
          DEFAULT: '#07090d',
          50:  '#0d1117',
          100: '#151a22',
          200: '#232a36',
        },
        // Acento
        electric: {
          DEFAULT: '#2563eb',
          light:   '#3b82f6',
          bright:  '#60a5fa',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
