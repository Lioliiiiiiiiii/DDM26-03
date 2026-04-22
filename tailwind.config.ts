import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#080B11',
        charcoal: '#0F141D',
        navy: '#111725',
        gold: '#FFBC47',
        amber: '#FF940F'
      },
      boxShadow: {
        glow: '0 0 40px rgba(245, 158, 11, 0.20)',
        panel: '0 18px 45px rgba(0, 0, 0, 0.40)'
      },
      backgroundImage: {
        'hero-aurora': 'radial-gradient(circle at 15% 20%, rgba(255, 123, 26, 0.25), transparent 42%), radial-gradient(circle at 80% 0%, rgba(245, 158, 11, 0.18), transparent 35%), linear-gradient(120deg, #070A10 0%, #0C121B 40%, #111725 100%)',
        'section-fade': 'linear-gradient(180deg, rgba(245, 158, 11, 0.04) 0%, rgba(8, 11, 17, 0) 100%)'
      }
    }
  },
  plugins: []
};

export default config;
