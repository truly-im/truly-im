import { defineConfig, loadEnv } from 'vite'
import PackageJSON from "./package.json"
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            nodePolyfills({ include: ['node_modules/eccrypto/browser.js'], }),
        ],
        envPrefix: ["VITE_", "TRULY_"],
        assetsInclude: ["**/*.bmp"]
    };
})