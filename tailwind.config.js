/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './header.php',
        './footer.php',
        './templates/*.php',
        './functions/**/*.php',
        './classes/**/*.php',
        './assets/**/*.{php,svg}',
        './safelist.txt',
    ],
    safelist: ['editor-styles-wrapper'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#8B5CF6',
                    50: '#25066C',
                    100: '#F9F7FF',
                    200: '#DED0FC',
                    300: '#C2A9FA',
                    400: '#A783F8',
                    500: '#8B5CF6',
                    600: '#6527F3',
                    700: '#4A0CD6',
                    800: '#3709A1',
                    900: '#25066C',
                    950: '#1C0451'
                },
                secondary: {
                    DEFAULT: '#F59E0B',
                    50: '#FCE4BB',
                    100: '#FBDCA8',
                    200: '#FACD81',
                    300: '#F8BD59',
                    400: '#F7AE32',
                    500: '#F59E0B',
                    600: '#C07C08',
                    700: '#8A5906',
                    800: '#543603',
                    900: '#1E1401',
                    950: '#030200'
                }
            },
            fontFamily: {
                'primary': ['Lato', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
            }
        },
    },
    plugins: [
        require('tailwind-safelist-generator')({
            path: 'safelist.txt',
            patterns: [],
        }),
    ],
}
