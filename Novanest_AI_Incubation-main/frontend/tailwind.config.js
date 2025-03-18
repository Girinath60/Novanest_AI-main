module.exports = {
  content: [
    "./src/**/*.{js,jsx,css}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#5B21B6', // Dark Purple (Creativity & AI)
          light: '#7C3AED',
          dark: '#4C1D95',
        },
        secondary: {
          DEFAULT: '#2563EB', // Neon Blue (Tech & Innovation)
          light: '#3B82F6',
          dark: '#1D4ED8',
        },
        accent: {
          DEFAULT: '#06B6D4', // Bright Cyan (Energy & Vision)
          light: '#22D3EE',
          dark: '#0891B2',
        },
        background: {
          DEFAULT: '#1F2937', // Dark Gray (Sleek & Modern)
          light: '#374151',
          dark: '#111827',
          card: '#283141',
        },
        success: '#10B981', // Green for success states
        warning: '#F59E0B', // Amber for warning states
        error: '#EF4444', // Red for error states
        info: '#3B82F6', // Blue for info states
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Montserrat', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'primary': '0 4px 14px 0 rgba(91, 33, 182, 0.39)',
        'secondary': '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
        'accent': '0 4px 14px 0 rgba(6, 182, 212, 0.39)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      height: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
      // Add custom button styles
      button: {
        base: 'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
        primary: 'bg-primary hover:bg-primary-dark text-white shadow-primary hover:shadow-lg',
        secondary: 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white',
        small: 'px-3 py-1.5 text-xs',
        regular: 'px-4 py-2 text-sm',
        large: 'px-6 py-3 text-base',
      }
    },
  },
  plugins: [
    // Add a plugin to generate button variants
    function({ addComponents }) {
      addComponents({
        '.btn': {
          '@apply inline-flex items-center justify-center rounded-full text-[0.65rem] font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 w-28': {},
        },
        '.btn-primary': {
          '@apply bg-primary text-white shadow-sm hover:bg-primary-dark hover:text-white hover:shadow-md transform hover:-translate-y-0.5': {},
        },
        '.btn-secondary': {
          '@apply bg-white text-gray-800 border-2 border-gray-800 hover:bg-gray-100 hover:text-gray-800 transform hover:-translate-y-0.5': {},
        },
        '.btn-small': {
          '@apply px-2 py-0.5 text-[0.65rem]': {}, // Even smaller text and padding
        },
        '.btn-regular': {
          '@apply px-2.5 py-1 text-[0.7rem]': {},
        },
        '.btn-large': {
          '@apply px-3 py-1.5 text-xs': {},
        },
      })
    }
  ],
  // Add component customization
  corePlugins: {
    container: false
  },
}