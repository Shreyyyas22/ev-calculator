module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Ensure Tailwind scans your component files
  ],
  darkMode: 'class',  // This enables manual dark mode toggling using a CSS class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        background: '#1a1a2e', // Dark background color
      },
      // Add custom keyframe animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pieChart: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        lineChart: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      // Extend the animation utilities
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.7s ease-in-out',
        'pie-chart': 'pieChart 1s ease-in-out',
        'line-chart': 'lineChart 1s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui'),  // Adding DaisyUI for easy theming
  ],
  daisyui: {
    themes: [
      'dark',  // Setting dark theme as default
      'light',
      'cupcake',
    ],
  },
};
