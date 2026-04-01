import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        floatDown: {
          '0%': { transform: 'translateY(-20px)' },
          '50%': { transform: 'translateY(20px)' },
          '100%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        floatDown: 'floatDown 8s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
