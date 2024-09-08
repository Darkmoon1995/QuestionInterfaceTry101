/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx,html}',  // Source files
        './public/index.html',              // Public HTML file
        './vercel/path0/**/*.{js,jsx,ts,tsx}',  // Vercel's deployment path (if needed)
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
