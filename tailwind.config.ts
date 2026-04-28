import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:        '#FAFAF8',
        surface:   '#FFFFFF',
        'surface-2':'#F5F3F0',
        accent:    '#FF4757',
        'accent-2': '#FF7B54',
        'accent-bg':'#FFF0F0',
        text:      '#1C1C1E',
        'text-2':  '#6B6B70',
        'text-mut': '#AEAEB2',
        border:    '#E8E5E0',
        'border-2': '#F0EDE8',
      },
      fontFamily: {
        display: ['DM Serif Display', 'Noto Serif SC', 'serif'],
        body:    ['Nunito Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-in': 'slideIn 0.4s ease forwards',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'accent': '0 4px 20px rgba(255,71,87,0.25)',
        'md':    '0 4px 16px rgba(0,0,0,0.08)',
        'lg':    '0 12px 40px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};
export default config;
