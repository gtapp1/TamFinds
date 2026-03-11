/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#003829',
        accent: '#FFB81C',
        surface: '#FFFFFF',
        muted: '#F5F5F5',
        border: '#E5E7EB',
        'text-secondary': '#6B7280',
        error: '#DC2626',
        success: '#16A34A',
      },
    },
  },
  plugins: [],
};


