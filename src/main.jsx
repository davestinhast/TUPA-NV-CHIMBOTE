import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'


const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('Nueva actualización disponible. ¿Recargar para aplicar cambios?')) {
            updateSW(true)
        }
    },
    onOfflineReady() {
        console.log('App lista para uso Offline.')
    },
})

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
