/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        notion: {
          bg: '#ffffff',
          surface: '#faf9f7',
          sidebar: '#f7f6f3',
          hover: '#efedea',
          border: '#e5e7eb',
          subtle: '#ebeae6',
          text: '#1a1a19',
          muted: '#6b7280',
          darkBg: '#191919',
          darkSurface: '#202020',
          darkSidebar: '#262626',
          darkBorder: '#333333',
        },
        bean: {
          orange: '#f97316',
          yellow: '#f59e0b',
          green: '#10b981',
          blue: '#0284c7',
          purple: '#a855f7',
          pink: '#ec4899',
          red: '#ef4444',
        }
      },
      boxShadow: {
        'notion': '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        'notion-lg': '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
        'pill': '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
        'bean': 'inset 2px 2px 5px rgba(255, 255, 255, 0.6), inset -2px -2px 5px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'pill': '9999px',
      }
    },
  },
  plugins: [],
}
