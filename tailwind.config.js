/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-green': '#4CAF50', // Add your custom green
        'custom-green-hover': '#3E8E41', // Hover color for the green button
        'custom-orange': '#FF9800',
        'custom-orange-hover': '#FB8C00',
        'custom-blue': '#2196F3',
        'custom-blue-hover': '#1976D2',
        'custom-purple': '#9C27B0',
        'custom-purple-hover': '#7B1FA2'
      },
    },
  },
  plugins: [],
};
