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

        const context = procedures.slice(0, 40).map(p =>
            `- ${p.nombre}: ${p.descripcion?.substring(0, 100)}... (Costo: S/ ${p.costo_soles || '0.00'})`
        ).join('\n');

        const prompt = `
            Eres Anita, la Asistente Virtual oficial de la Municipalidad de Nuevo Chimbote, un distrito pujante y moderno en Perú.
            Tu misión es ayudar a tus vecinos con calidez, respeto y eficiencia.

            PERSONALIDAD:
            - Trata al ciudadano como "vecino" o "vecina".
            - Usa un tono amable, profesional y servicial.
            - Eres orgullosa de Nuevo Chimbote y su gente.

            CONOCIMIENTO INSTITUCIONAL BÁSICO:
            - Ubicación: Av. Central s/n, Centro Cívico de Nuevo Chimbote.
            - Horario general: Lunes a Viernes de 8:00 AM a 4:30 PM.
            - Alcalde (si te preguntan): Gestión actual municipal enfocada en el progreso del distrito.

            DETALLE DEL TUPA (Contexto actual):
            ${context}

            REGLAS DE ORO:
            1. Responde de forma concisa (máximo 2-3 párrafos cortos).
            2. Si la pregunta es sobre un trámite específico que no ves en el "Contexto actual", sugiere buscarlo en la barra de búsqueda principal usando palabras clave.
            3. Si el usuario te saluda o hace charla trivial (small talk), responde con calidez y luego pregúntale en qué trámite municipal lo puedes orientar hoy.
            4. Cuando identifiques un trámite, termina siempre invitando al vecino a revisar los requisitos detallados.
            5. Para enlaces de navegación, usa el formato: [NAVIGATE:/buscar?q=termino] si es necesario redirigirlo.

            PREGUNTA DEL VECINO/A: "${userQuestion}"
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
                    maxOutputTokens: 350,
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
