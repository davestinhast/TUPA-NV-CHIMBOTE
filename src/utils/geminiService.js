import { api } from '../api';

const GEMINI_API_KEY = "AIzaSyAn5Uf8yRhk6Ta2_MTLtFadxb3WF_-htIw";
const MODEL = "gemini-1.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/**
 * Servicio para conectar con la IA de Google (Gemini)
 */
export async function askAnita(userQuestion) {
    try {
        let procedures = [];
        try {
            procedures = await api.getProcedures();
        } catch (e) {
            console.warn("No se pudieron cargar trámites para el contexto", e);
        }

        const context = procedures.slice(0, 30).map(p =>
            `- ${p.nombre} (S/ ${p.costo_soles || '0.00'})`
        ).join('\n');

        const prompt = `
            Eres Anita, la guía oficial de la Municipalidad de Nuevo Chimbote.
            
            CONOCIMIENTO (TUPA):
            ${context}

            REGLAS CRÍTICAS:
            1. Responde en español, amable y directo.
            2. Si vas a sugerir una búsqueda o sección, termina el mensaje con [NAVIGATE:/buscar?q=termino] o [NAVIGATE:/buscar] para mover al usuario.
            3. Limítate a 2 párrafos.

            PREGUNTA: "${userQuestion}"
        `;

        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 250,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const retryResponse = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!retryResponse.ok) {
                const errorData = await retryResponse.json();
                console.error("Gemini API Error Final:", errorData);
                throw new Error("API Failure");
            }

            const data = await retryResponse.json();
            return data.candidates[0].content.parts[0].text;
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error en Anita IA:", error);
        return "Disculpa vecino, tengo un pequeño problema técnico con mi conexión de IA. Por favor, intenta buscar lo que necesitas en el buscador principal mientras lo soluciono.";
    }
}
