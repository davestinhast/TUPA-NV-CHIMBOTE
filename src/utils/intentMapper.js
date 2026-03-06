/**
 * Mapeo semántico de intenciones para usuarios no técnicos (ej. adultos mayores).
 * Conecta palabras coloquiales con términos oficiales del TUPA.
 */

const INTENT_MAPPING = {
    // Vivienda y Construcción
    'arreglar mi casa': ['Licencias de Edificación', 'edificación', 'remodelación'],
    'construir segundo piso': ['Licencias de Edificación', 'edificación', 'ampliación'],
    'poner mi techo': ['Licencias de Edificación', 'edificación'],
    'mi casita': ['Licencias de Edificación', 'vivienda'],
    'permiso para construir': ['Licencias de Edificación'],
    'modificar fachada': ['Licencias de Edificación'],
    'demoler': ['Licencias de Edificación', 'demolición'],

    // Negocios
    'abrir mi bodega': ['Licencias de Funcionamiento', 'negocio', 'bodega'],
    'vender pan': ['Licencias de Funcionamiento', 'panadería', 'comercio'],
    'mi tiendita': ['Licencias de Funcionamiento', 'negocio'],
    'poner un puesto': ['Licencias de Funcionamiento', 'comercio'],
    'vender comida': ['Licencias de Funcionamiento', 'restaurante'],
    'permiso para local': ['Licencias de Funcionamiento'],
    'anuncio publicitario': ['Publicidad Exterior', 'letrero', 'panel'],
    'quitar letrero': ['Publicidad Exterior'],

    // Familia y Civil
    'casarme': ['Registro Civil', 'matrimonio'],
    'matrimonio': ['Registro Civil'],
    'partida de nacimiento': ['Registro Civil', 'nacimiento'],
    'mi nieto': ['Registro Civil', 'nacimiento'],
    'divorcio': ['Registro Civil', 'separación'],
    'defunción': ['Registro Civil', 'fallecimiento'],
    'morir': ['Registro Civil', 'fallecimiento'],
    'enterrar': ['Registro Civil', 'cementerio'],

    // Pagos e Impuestos
    'pagar mis arbitrios': ['Tributación', 'pagos', 'arbitrios'],
    'deuda de casa': ['Tributación', 'predial'],
    'impuesto predial': ['Tributación'],
    'no tengo plata para pagar': ['Tributación', 'fraccionamiento'],
    'descuento': ['Tributación', 'beneficios'],
    'amnistía': ['Tributación'],

    // Seguridad y Defensa Civil
    'permiso de defensa civil': ['Inspección Técnica de Seguridad (ITSE)', 'itse'],
    'seguridad de mi local': ['Inspección Técnica de Seguridad (ITSE)'],
    'extintores': ['Inspección Técnica de Seguridad (ITSE)'],
    'riesgo': ['Inspección Técnica de Seguridad (ITSE)'],

    // Otros
    'queja': ['Libro de Reclamaciones', 'reclamo'],
    'denunciar vecino': ['Fiscalización y Sanciones', 'denuncia'],
    'ruido fuerte': ['Fiscalización y Sanciones', 'ruidos'],
    'basura': ['Medio Ambiente', 'limpieza'],
    'parque sucio': ['Medio Ambiente', 'áreas verdes'],
    'mi perrito': ['Registro de Canes', 'mascota'],
    'vacuna perro': ['Registro de Canes'],
};

/**
 * Función que analiza el texto del usuario y devuelve términos de búsqueda técnicos
 */
export const mapIntent = (text) => {
    if (!text) return '';
    const lowerText = text.toLowerCase().trim();

    // 1. Iniciar con el texto original
    let suggestedTerms = [lowerText];

    // 2. Buscar coincidencias en el mapa semántico
    for (const [key, values] of Object.entries(INTENT_MAPPING)) {
        if (lowerText.includes(key) || key.includes(lowerText)) {
            suggestedTerms = [...new Set([...suggestedTerms, ...values])];
        }
    }

    // Si la cadena es muy larga o no hay coincidencias, devolver el original
    return suggestedTerms.join(' ');
};

/**
 * Devuelve una lista de "Sugerencias Inteligentes" basadas en el contexto
 */
export const getSmartSuggestions = (text) => {
    const lowerText = text.toLowerCase().trim();
    const suggestions = [];

    for (const [key, values] of Object.entries(INTENT_MAPPING)) {
        if (lowerText.includes(key)) {
            suggestions.push({
                original: key,
                formal: values[0]
            });
        }
    }

    return suggestions.slice(0, 3);
};
