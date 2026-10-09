import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.svg'],
      workbox: {
        // index.html wird nicht vorgehalten: Seitenaufrufe gehen zuerst ans Netz,
        // damit nach einem Deploy niemand auf einer alten App-Hülle hängen bleibt.
        globPatterns: ['**/*.{js,css,svg,png,woff2}'],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: { cacheName: 'pages', networkTimeoutSeconds: 4 },
          },
        ],
      },
      manifest: {
        id: '/',
        name: '__TITLE__',
        short_name: '__TITLE__',
        description: '__TAGLINE__',
        lang: 'de',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#1f5fbf',
        icons: [{ src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      devOptions: { enabled: false },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: {
    // `pnpm dev` zeigt das Frontend; die API kommt von `pnpm dev:worker` (Port 8787).
    proxy: { '/api': 'http://localhost:8787' },
  },
});
