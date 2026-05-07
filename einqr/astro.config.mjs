import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    server: {
      allowedHosts: true
    }
  },
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Gafete Virtual',
        short_name: 'Gafete',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone', // Esto oculta la barra del navegador para que parezca app nativa
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});