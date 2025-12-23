// tailwind.config.js — نسخه نهایی
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        vazir: ['Vazir', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f0f7ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#4a90e2', // رنگ اصلی روشن
          600: '#357abd', // رنگ اصلی دارک + avatar دارک
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
      },
      boxShadow: {
        glow: '0 0 25px rgba(74, 144, 226, 0.5)',
        'glow-lg': '0 0 40px rgba(74, 144, 226, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}