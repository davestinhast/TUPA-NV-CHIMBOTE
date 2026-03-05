import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'logo-tupa.svg', 'data/procedimientos.json', 'tupa-capturas/*.png'],
            manifest: {
                name: 'TUPA Digital - Nuevo Chimbote',
                short_name: 'TUPA Digital',
                description: 'Plataforma Oficial de Consulta del TUPA 2025 de la MDNCH',
                theme_color: '#C62828',
                background_color: '#F5F5F5',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
})
