import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            nodePolyfills({ include: ['node_modules/eccrypto/browser.js'], }),
        ],
        envPrefix: ["VITE_", "TRULY_"],
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    nested: resolve(__dirname, 'welcome.html')
                }
            }
        },
        assetsInclude: ["**/*.bmp"]
    };
})