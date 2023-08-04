import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path'


const input = ['assets/scss/main.scss', "assets/js/plugins.js"]
if (existsSync(`blocks`)) {
    for (const dir of readdirSync('blocks')) {
        const files = readdirSync(`blocks/${dir}`)
        for (const file of files) {
            if (file === `${dir}.scss` || file === `${dir}.js`) {
                input[dir] = `blocks/${dir}/${file}`
            }
        }
    }
}

const ASSETS = {
    images: ['svg', 'png'],
    fonts: ['woff', 'woff2'],
    css: ['css']
}

export default defineConfig({
    base: './',
    css: {
        postcss: {
            plugins: [autoprefixer()],
        },
    },
    build: {
        manifest: false,
        rollupOptions: {
            input,
            output: {
                entryFileNames: "js/[name].min.js",
                assetFileNames: (assetInfo) => {
                    let res = '[name][extname]'
                    for (const [key, value] of Object.entries(ASSETS)) {
                        if (value.includes(getFileExtension(assetInfo.name))) {
                            res = `${key}/[name].min[extname]`
                            break;
                        }
                    }
                    return res
                }
            },
        },
    },
    resolve: {
        alias: {
            '@fonts': resolve(__dirname, '/fonts'),
            '@images': resolve(__dirname, '/images')
        }
    }
});

const getFileExtension = (file) => file.split('.').pop()