import { pipeline, env } from '@xenova/transformers';

// Evita intentar cargar el modelo desde el servidor local
env.allowLocalModels = false;

let embedderInstance = null;
let isLoading = false;
let loadPromise = null;

export async function getEmbedder() {
    if (embedderInstance) return embedderInstance;
    if (loadPromise) return loadPromise;

    isLoading = true;
    loadPromise = pipeline(
        'feature-extraction',
        'Xenova/paraphrase-multilingual-MiniLM-L12-v2'
    ).then(instance => {
        embedderInstance = instance;
        isLoading = false;
        return instance;
    });

    return loadPromise;
}

export async function embedText(text) {
    const embedder = await getEmbedder();
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}
