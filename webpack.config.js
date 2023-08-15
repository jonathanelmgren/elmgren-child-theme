const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

function getTailwindConfig() {
    const configFile = fs.readFileSync(path.resolve(__dirname, 'tailwind.config.js'), 'utf8');
    return eval(configFile);
}

const plugins = [
    new MiniCssExtractPlugin({
        filename: 'css/[name].css'
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
            ],
            reloadDelay: 0,
            injectChanges: true,
            notify: false
        })
    )
}

module.exports = {
    entry: {
        main: ['./assets/ts/plugins.ts', './assets/scss/main.scss']
    },
    output: {
        filename: 'js/[name].js',
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
                                    require('autoprefixer')
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