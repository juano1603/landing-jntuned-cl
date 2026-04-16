/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base
        surface: {
          DEFAULT: '#020617', // slate-950
          50:  '#0f172a', // slate-900
          100: '#1e293b', // slate-800
          200: '#334155', // slate-700
        },
        // Acento principal
        electric: {
          DEFAULT: '#2563eb', // blue-600
          light:   '#3b82f6', // blue-500
          bright:  '#60a5fa', // blue-400
          glow:    '#93c5fd', // blue-300
        },
        // Acento secundario (para detalles críticos)
        volt: {
          DEFAULT: '#facc15', // yellow-400
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['"Roboto Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.25), transparent)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      boxShadow: {
        'glow-blue': '0 0 24px rgba(37,99,235,0.4)',
        'glow-sm':   '0 0 12px rgba(37,99,235,0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up':    'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
