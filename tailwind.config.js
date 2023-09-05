const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */

const themeColors = {
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
    },
    lightgray: {
        DEFAULT: '#F5F5F5',
        50: '#FFFFFF',
        100: '#FFFFFF',
        200: '#FDFDFD',
        300: '#FAFAFA',
        400: '#F8F8F8',
        500: '#F5F5F5',
        600: '#E8E8E8',
        700: '#DCDCDC',
        800: '#CFCFCF',
        900: '#C2C2C2',
        950: '#BCBCBC'
    },
    darkgray: {
        DEFAULT: '#2E2E2E',
        50: '#8A8A8A',
        100: '#808080',
        200: '#6B6B6B',
        300: '#575757',
        400: '#424242',
        500: '#2E2E2E',
        600: '#121212',
        700: '#000000',
        800: '#000000',
        900: '#000000',
        950: '#000000'
    },
    'accent-primary': {
        DEFAULT: '#FFD700',
        50: '#FFF4B8',
        100: '#FFF1A3',
        200: '#FFEA7A',
        300: '#FFE452',
        400: '#FFDD29',
        500: '#FFD700',
        600: '#C7A800',
        700: '#8F7800',
        800: '#574900',
        900: '#1F1A00',
        950: '#030200'
    },
    'accent-secondary': {
        DEFAULT: '#A8E6CE',
        50: '#FFFFFF',
        100: '#F7FDFB',
        200: '#E3F7EF',
        300: '#D0F1E4',
        400: '#BCECD9',
        500: '#A8E6CE',
        600: '#7CD9B5',
        700: '#51CD9D',
        800: '#33B281',
        900: '#278762',
        950: '#207152'
    }
}

// Generate an array of color names
const extendedColors = Object.keys(themeColors);

// Generate an array of unique shades from all color objects
const allShades = [...new Set(
    Object.values(themeColors)
        .flatMap(color => Object.keys(color))
)];

const safelistAttributes = [
    'text',
    'border',
    'hover:text',
    'hover:bg',
    'placeholder:text',
    'bg',
    'ring',
    'focus:ring',
    'focus-visible:outline',
    'outline'
]

const patterns = extendedColors.reduce((acc, color) => {
    allShades.forEach(shade => {
        safelistAttributes.forEach(attribute => {
            if (shade === 'DEFAULT') {
                acc.push(`${attribute}-${color}`);
            }
            acc.push(`${attribute}-${color}-${shade}`);
        });
    });
    return acc;
}, []);


module.exports = {
    content: [
        './header.php',
        './footer.php',
        './templates/**/*.php',
        './woocommerce/**/*.php',
        './functions/**/*.php',
        './blocks/**/*.php',
        './classes/**/*.php',
        './assets/**/*.{php,svg}',
        './safelist.txt'
    ],
    safelist: [
        'editor-styles-wrapper',
        'text-center',
        'text-left',
        'text-right',
    ],
    theme: {
        extend: {
            colors: themeColors,
            fontFamily: {
                'primary': ['Lato', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
                'secondary': ['Lato', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
            }
        },

    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),
        require('tailwind-safelist-generator')({
            path: 'safelist.txt',
            patterns: patterns,
        }),
        plugin(function ({ addBase, theme }) {
            const colors = theme('colors', {});
            const cssVariables = {};

            Object.keys(colors).forEach(colorName => {
                if (typeof colors[colorName] === 'object') {
                    Object.keys(colors[colorName]).forEach(shade => {
                        const variableName = `--color-${colorName}-${shade}`;
                        cssVariables[variableName] = colors[colorName][shade];
                    });
                } else {
                    const variableName = `--color-${colorName}`;
                    cssVariables[variableName] = colors[colorName];
                }
            });
            addBase({
                ':root': cssVariables,
            });
        }),
    ],
}

