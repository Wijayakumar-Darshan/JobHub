/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#0A2E1C', 50:'#E8F5EE', 100:'#C3E6D2', 500:'#1A6B50', 700:'#0A2E1C', 900:'#061A10' },
        accent:    { DEFAULT: '#E8A200', 50:'#FEF9E7', 100:'#FEF3C7', 500:'#E8A200', 700:'#B87D00' },
        success:   '#059669',
        danger:    '#DC2626',
        warning:   '#D97706',
        info:      '#2563EB',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: { xl: '14px', '2xl': '18px' },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.04)',
        modal: '0 20px 60px rgba(0,0,0,.22)',
      },
    },
  },
  plugins: [],
}

