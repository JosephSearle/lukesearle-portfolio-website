import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          100: 'var(--color-slate-100)',
          200: 'var(--color-slate-200)',
          300: 'var(--color-slate-300)',
          400: 'var(--color-slate-400)',
          500: 'var(--color-slate-500)',
          900: 'var(--color-slate-900)',
          950: 'var(--color-slate-950)',
        },
        sky: { 300: 'var(--color-sky-300)', 400: 'var(--color-sky-400)' },
      },
      fontFamily: { display: ['var(--font-display)'] },
      boxShadow: { menu: 'var(--shadow-xl)' },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
