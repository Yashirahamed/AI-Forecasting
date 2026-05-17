import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#0a0f1e',
        navy2: '#0d1526',
        navy3: '#111827',
        glass: 'rgba(255,255,255,0.07)',
        glow: 'rgba(56,189,248,0.15)',
        blue: '#38bdf8',
        purple: '#a78bfa',
        emerald: '#34d399',
        amber: '#fbbf24',
        rose: '#f87171',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'meteor': 'meteor 3s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        meteor: {
          '0%': { transform: 'translate(300px, -300px) scale(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translate(-300px, 300px) scale(1)', opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow-blue': '0 0 30px rgba(56,189,248,0.2), 0 0 60px rgba(56,189,248,0.1)',
        'glow-purple': '0 0 30px rgba(167,139,250,0.2), 0 0 60px rgba(167,139,250,0.1)',
      },
    },
  },
  plugins: [],
}

export default config
