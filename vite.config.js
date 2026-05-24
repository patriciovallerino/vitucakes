import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Vercel setea VERCEL=1 en build automáticamente. En Vercel servimos desde
// root '/', en GitHub Pages desde '/vitucakes/'. Esto mantiene ambos deploys
// funcionando: Vercel como principal, GH Pages como backup.
const isVercel = process.env.VERCEL === '1'
const base = isVercel ? '/' : '/vitucakes/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'logo.jpg',
        'apple-touch-icon.png',
        'precarga.json',
        'precios_sugeridos.json',
        'recetas_v2.json',
      ],
      manifest: {
        name: 'Vitucakes',
        short_name: 'Vitucakes',
        description: 'Calculadora de costos y precios de venta para Vitucakes',
        theme_color: '#F4A4A4',
        background_color: '#FFF5F5',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        lang: 'es-AR',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // El JSON de precios sugeridos cambia con el cron semanal: que se
        // refresque en background pero sirva la copia cacheada al toque.
        runtimeCaching: [
          {
            urlPattern: /precios_sugeridos\.json$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'precios-sugeridos' },
          },
        ],
      },
    }),
  ],
})
