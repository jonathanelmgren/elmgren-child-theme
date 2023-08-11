import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import dotenv from 'dotenv';

// If these are CommonJS modules, you can import them like this
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const plugins = [
    new MiniCssExtractPlugin({
        filename: 'css/[name].css'
    })
];

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
            reloadDelay: 0,
            injectChanges: true,
            notify: false
        })
    );
}

export default {
    entry: {
        main: ['./assets/ts/plugins.ts', './assets/scss/main.scss']
    },
    output: {
        filename: 'js/[name].js',
        path: resolve(__dirname, 'dist')
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
                                    tailwindcss,
                                    autoprefixer
                                ],
                            },
                        },
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    plugins,
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
    },
};
