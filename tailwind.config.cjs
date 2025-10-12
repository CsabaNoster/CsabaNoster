/**** Tailwind Config ****/
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
    './content/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        // Beige theme (light + deep warm dark counterpart)
        beige: 'rgba(233, 211, 204, 1)',
        beigeDark: 'rgba(209, 199, 187, 1)'
      }
    }
  },
  plugins: []
};
