/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        navy: '#042C53',
        blue: '#185FA5',
        'blue-light': '#378ADD',
        grow: '#04342C',
        portal: '#26215C',
        'erp-muted': '#555555',
        'erp-gray': '#F5F5F5'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        premium: '0 18px 50px rgba(4, 44, 83, 0.11)',
        card: '0 16px 30px rgba(4, 44, 83, 0.08)'
      },
      borderRadius: {
        card: '12px',
        soft: '18px'
      }
    }
  },
  plugins: []
};
