/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        'content': '1980px',
      },
      colors: {
        // Dark theme colors
        'dark-bg': '#0f0f0f',
        'dark-card': '#1a1a1a',
        'dark-hover': '#2a2a2a',
        
        // Light theme colors
        'light-bg': '#ffffff',
        'light-card': '#f8f9fa',
        'light-hover': '#e9ecef',
        
        // Common colors
        'accent-red': '#dc2626',
        'accent-red-hover': '#b91c1c',
        
        // Text colors
        'text-primary-dark': '#ffffff',
        'text-secondary-dark': '#a3a3a3',
        'text-primary-light': '#000000',
        'text-secondary-light': '#6b7280',
        
        // Theme colors
        'theme-primary': 'var(--theme-primary)',
        'theme-secondary': 'var(--theme-secondary)',
        'theme-background': 'var(--theme-background)',
        'theme-card': 'var(--theme-card)',
        'theme-hover': 'var(--theme-hover)',
        'theme-border': 'var(--theme-border)',
        'theme-text': 'var(--theme-text)',
        'theme-text-secondary': 'var(--theme-text-secondary)',
      },
      fontFamily: {
        'sans': ['Roboto', 'system-ui', 'sans-serif']
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} 