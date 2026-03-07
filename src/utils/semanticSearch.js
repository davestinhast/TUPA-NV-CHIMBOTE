// Carga lazy desde public/data/ (sin import estático)
let embeddingsData = null;

async function loadEmbeddings() {
    if (embeddingsData) return embeddingsData;
    const res = await fetch('/data/tupa_embeddings.json');
    embeddingsData = await res.json();
    return embeddingsData;
}

// Expande la query con sinónimos del dominio municipal
function expandQuery(text) {
    const textLower = text.toLowerCase();
    const expansions = [text];
    const synonyms = {
        "construir": "edificación construcción obra licencia edificar",
        "casa": "vivienda edificación predio inmueble",
        "remodelar": "remodelación ampliación modificación edificación",
        "negocio": "funcionamiento establecimiento comercial apertura",
        "bodega": "licencia funcionamiento establecimiento comercial tienda abarrotes",
        "restaurante": "funcionamiento establecimiento comercial alimentos",
        "casarme": "matrimonio civil registro unión conyugal",
        "casar": "matrimonio civil registro",
        "partida": "registro civil nacimiento certificado acta",
        "nacimiento": "registro civil partida certificado inscripción",
        "multa": "fiscalización sanción infracción papeleta",
        "predial": "tributación impuesto predio autovalúo",
        "arbitrios": "tributación pago municipal servicios",
        "pensionista": "tributación descuento beneficio adulto mayor",
        "letrero": "publicidad exterior anuncio panel autorización",
        "defensa civil": "inspección técnica seguridad ITSE",
        "perro": "canes registro mascota",
        "demoler": "demolición edificación licencia",
        "terreno": "habilitación urbana predio lotización",
    };

    Object.entries(synonyms).forEach(([keyword, expansion]) => {
        if (textLower.includes(keyword)) {
            expansions.push(expansion);
        }
    });
    return expansions.join(' ');
}

// Similitud coseno
function cosineSim(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot   += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

// Fallback sin modelo
function tfidfFallback(query, procedures, topK) {
    const stopwords = new Set(['de','la','el','en','y','a','los','las','un','una',
        'para','por','con','del','al','se','que','es','su','lo','mi','me']);
    const tokenize = (str) => str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopwords.has(w));

    const qTokens = new Set(tokenize(query));
    return procedures
        .map(p => {
            const text = `${p.nombre} ${p.categoria} ${p.descripcion || ''}`;
            const tokens = tokenize(text);
            const matches = tokens.filter(t => qTokens.has(t)).length;
            return { ...p, score: matches / (tokens.length + 1) };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

// Búsqueda principal con embeddings
export async function searchByEmbedding(queryEmbedding, procedures, topK = 3) {
    const data = await loadEmbeddings();
    const { codigos, embeddings } = data;

    const scores = embeddings.map((emb, i) => ({
        index: i,
        score: cosineSim(queryEmbedding, emb)
    }));

    scores.sort((a, b) => b.score - a.score);

    return scores
        .slice(0, topK)
        .filter(s => s.score > 0.35)
        .map(s => procedures.find(p => p.codigo === codigos[s.index]))
        .filter(Boolean);
}

// Búsqueda fallback sin modelo
export async function searchFallback(query, procedures, topK = 3) {
    const expanded = expandQuery(query);
    return tfidfFallback(expanded, procedures, topK);
}

export { expandQuery };
