import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(),
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['fonts/*.woff2', 'icons/*.png', 'content/*.md', 'content-manifest.json'],
      manifest: {
        name: 'هانا عايشين — Hana 3aychin',
        short_name: 'هانا عايشين',
        description: 'دليل الصمود أمام أزمة الكهرباء والماء والحرّ في تونس — يعمل دون اتصال.',
        lang: 'ar',
        dir: 'rtl',
        display: 'standalone',
        start_url: './',
        scope: './',
        theme_color: '#2b1703',
        background_color: '#f5efe3',
        icons: [
          { src: './icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable any' },
          { src: './icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' },
        ],
      },
      workbox: {
        clientsClaim: true,
        // Precache the full shell + fonts + every guide: offline after first visit.
        // Infographics (img/**) are intentionally excluded from the offline cache
        // to keep the precache light; articles stay fully readable without them.
        globPatterns: ['**/*.{js,css,html,woff2,md,json}'],
        globIgnores: ['img/**'],
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
