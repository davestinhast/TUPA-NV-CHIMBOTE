const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./public/data/procedimientos.json', 'utf8'));

console.log('=== DIAGNÓSTICO COMPLETO DEL JSON ===\n');
console.log(`Total trámites: ${data.length}`);

const sinCosto = data.filter(p => !p.costo || p.costo.trim() === '');
const sinPlazo = data.filter(p => !p.plazo || p.plazo.trim() === '');
const sinRequisitos = data.filter(p => !p.requisitos || p.requisitos.length === 0);
const sinCategoria = data.filter(p => !p.categoria || p.categoria.trim() === '');
const sinSlug = data.filter(p => !p.slug || p.slug.trim() === '');
const slugsDuplicados = data.map(p => p.slug).filter((s, i, arr) => arr.indexOf(s) !== i);
const sinUnidad = data.filter(p => !p.unidad_responsable || p.unidad_responsable.trim() === '');
const sinCalif = data.filter(p => !p.calificacion || p.calificacion.trim() === '');
const sinCanales = data.filter(p => !p.canales);
const sinBaseLegal = data.filter(p => !p.base_legal || p.base_legal.length === 0);
const sinPdfPagina = data.filter(p => !p.pdf_pagina);
const conReqConsultar = data.filter(p => p.requisitos && p.requisitos.some(r => r.toLowerCase().includes('consultar en ventanilla')));
const nombresMayus = data.filter(p => p.nombre && p.nombre === p.nombre.toUpperCase());
const descCortas = data.filter(p => p.descripcion && p.descripcion.length < 80);

console.log('\n--- CAMPOS VACÍOS ---');
console.log(`Sin costo: ${sinCosto.length}`);
console.log(`Sin plazo: ${sinPlazo.length}`);
console.log(`Sin requisitos: ${sinRequisitos.length}`);
console.log(`Sin categoría: ${sinCategoria.length}`);
console.log(`Sin slug: ${sinSlug.length}`);
console.log(`Sin unidad responsable: ${sinUnidad.length}`);
console.log(`Sin calificación: ${sinCalif.length}`);
console.log(`Sin canales de atención: ${sinCanales.length}`);
console.log(`Sin base legal: ${sinBaseLegal.length}`);
console.log(`Sin referencia PDF: ${sinPdfPagina.length}`);

console.log('\n--- CALIDAD DE DATOS ---');
console.log(`Slugs duplicados: ${slugsDuplicados.length} → [${slugsDuplicados.slice(0, 3).join(', ')}...]`);
console.log(`Requisitos genéricos "Consultar en ventanilla": ${conReqConsultar.length}`);
console.log(`Nombres en MAYÚSCULAS (deberían estar en TitleCase): ${nombresMayus.length}`);
console.log(`Descripciones muy cortas (<80 chars): ${descCortas.length}`);

console.log('\n--- CATEGORÍAS EXISTENTES ---');
const categorias = {};
data.forEach(p => { categorias[p.categoria] = (categorias[p.categoria] || 0) + 1; });
Object.entries(categorias).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
});

console.log('\n--- SLUGS DUPLICADOS DETALLE ---');
if (slugsDuplicados.length > 0) {
    slugsDuplicados.forEach(s => {
        const dups = data.filter(p => p.slug === s);
        console.log(`  "${s}" → ${dups.length} coincidencias`);
        dups.forEach(d => console.log(`    - [${d.codigo}] ${d.nombre.substring(0, 60)}`));
    });
}

console.log('\n--- NOMBRES EN MAYÚSCULAS (primeros 10) ---');
nombresMayus.slice(0, 10).forEach(p => console.log(`  [${p.codigo}] ${p.nombre.substring(0, 70)}`));
