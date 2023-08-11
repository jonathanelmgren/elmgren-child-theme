/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './header.php',
        './footer.php',
        './templates/*.php',
        './functions/**/*.php',
        './classes/**/*.php',
        './assets/**/*.{php,svg}',
        './woocommerce/**/*.php',
    ],
    theme: {
        extend: {
        },
    },
    plugins: [],
}