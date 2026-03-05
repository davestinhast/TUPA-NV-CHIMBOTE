// API configuration and service
const API_BASE_URL = typeof process !== 'undefined' && process.env.VITE_API_URL
    ? process.env.VITE_API_URL
    : 'http://localhost:3000/api';

// Transform backend data to match frontend consumption
const normalizeProcedure = (p) => ({
    ...p,
    nombre: p.nombre_oficial || p.nombre,
    codigo: p.codigo_tupa || p.codigo,
    costo: p.costo_soles ? `S/ ${p.costo_soles}` : (p.costo || 'Gratuito'),
    plazo: p.plazo_dias ? `${p.plazo_dias} días hábiles` : (p.plazo || 'Ver detalle')
});

export const api = {
    async getProcedures() {
        try {
            // First try to fetch from local JSON as fallback (fast)
            const localResponse = await fetch(`${import.meta.env.BASE_URL}data/procedimientos.json`);
            if (!localResponse.ok) throw new Error('Local JSON not found');
            const localData = await localResponse.json();

            // Then attempt to background-update from real server if available
            try {
                const apiResponse = await fetch(`${API_BASE_URL}/procedimientos?limit=500`);
                if (apiResponse.ok) {
                    const result = await apiResponse.json();
                    if (result.success && result.data) {
                        return result.data.map(normalizeProcedure);
                    }
                }
            } catch (err) {
                console.warn('Backend API not reachable, using local data:', err.message);
            }

            return localData;
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    async getProcedureBySlug(slug) {
        // Fallback search logic if we only have the full list
        const all = await this.getProcedures();
        const found = all.find(p => p.slug === slug || p.codigo === slug || p.codigo_tupa === slug);

        if (found) return found;

        // Try specific API call
        try {
            const response = await fetch(`${API_BASE_URL}/procedimientos/${slug}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) return normalizeProcedure(result.data);
            }
        } catch (err) {
            console.warn('Backend detail API failed');
        }

        return null;
    }
};
