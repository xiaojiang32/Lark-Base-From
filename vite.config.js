import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { semiTheming } from "vite-plugin-semi-theming";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        semiTheming({
            theme: "@semi-bot/semi-theme-feishu-dashboard",
        }),
    ],
    server: {
        host: "0.0.0.0",
        proxy: {
            '/api': {
                target: 'https://trip.larkenterprise.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
                configure: (proxy, options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        console.log('Proxying request:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        console.log('Received response:', proxyRes.statusCode, req.url);
                    });
                }
            }
        }
    },
});
