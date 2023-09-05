const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const fs = require('fs');
const dotenv = require('dotenv');
const glob = require('glob');

dotenv.config();

// Dynamic entries for TypeScript and SCSS
const tsEntries = glob.sync('./assets/ts/*.ts').reduce((acc, filePath) => {
    const entry = path.basename(filePath, '.ts');
    acc[`ts_${entry}`] = `./${filePath}`;
    return acc;
}, {});

const scssEntries = glob.sync('./assets/scss/*.scss').reduce((acc, filePath) => {
    const entry = path.basename(filePath, '.scss');
    acc[`scss_${entry}`] = `./${filePath}`;
    return acc;
}, {});


function getTailwindConfig() {
    const configFile = fs.readFileSync(path.resolve(__dirname, 'tailwind.config.js'), 'utf8');
    return eval(configFile);
}

const plugins = [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
        filename: ({ chunk }) => {
            return chunk.name.startsWith('scss_') ?
                `css/${chunk.name.replace('scss_', '')}.css` :
                undefined
        },
    }),
    {
        apply: (compiler) => {
            compiler.hooks.watchRun.tapAsync('FileSpecificHook', (compilation, callback) => {
                const changedFiles = compilation.modifiedFiles;
                if (!changedFiles || changedFiles.has(path.resolve(__dirname, 'tailwind.config.js'))) {
                    const config = getTailwindConfig();
                    const colors = config.theme.extend.colors;
                    const phpOutput =
                        `
// === START: Webpack Generated Block ===
if (!defined('TAILWIND_COLORS')) {
    define('TAILWIND_COLORS', json_decode('${JSON.stringify(colors)}', true));
}
// === END: Webpack Generated Block ===
`;
                    const constantsPath = path.resolve(__dirname, 'functions/constants.php');
                    let fileContent = fs.readFileSync(constantsPath, 'utf8');

                    const regex = /\/\/ === START: Webpack Generated Block ===[\s\S]*?\/\/ === END: Webpack Generated Block ===/;

                    if (regex.test(fileContent)) {
                        const modifiedContent = fileContent.replace(regex, phpOutput.trim());
                        fs.writeFileSync(constantsPath, modifiedContent, 'utf8');
                    } else {
                        fs.appendFileSync(constantsPath, phpOutput);
                    }
                }

                callback();
            });

        }
    }
]

if (typeof process.env.WORDPRESS_SITE_URL === 'string') {
    plugins.push(
        new BrowserSyncPlugin({
            https: {
                key: 'docker/ssl/server.key',
                cert: 'docker/ssl/server.crt',
            },
            host: process.env.WORDPRESS_SITE_URL.replace('https://', ''),
            open: "external",
            port: 3000,
            proxy: process.env.WORDPRESS_SITE_URL + '/',
            files: [
                './header.php',
                './footer.php',
                './templates/*.php',
                './functions/**/*.php',
                './classes/**/*.php',
                './assets/**/*.{php,svg}'
            ],
            reloadDelay: 0,
            injectChanges: true,
            notify: false
        })
    )
}

module.exports = {
    entry: { ...tsEntries, ...scssEntries },
    output: {
        filename: ({ chunk }) => {
            return chunk.name.startsWith('ts_') ?
                `js/${chunk.name.replace('ts_', '')}.js` :
                'js/[name].js';
        },
        path: path.resolve(__dirname, 'dist')
    },
    watchOptions: {
        ignored: /functions\/constants\.php/
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('tailwindcss'),
                                    require('autoprefixer'),
                                    ...(process.env.NODE_ENV === 'production' ? [require('cssnano')] : [])
                                ],
                            },
                        },
                    },
                    'sass-loader'
                ]
            },

        ]
    },
    plugins,
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
    },
};
