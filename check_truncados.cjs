const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./public/data/procedimientos.json', 'utf8'));

const truncados = data.filter(p => p.descripcion && p.descripcion.trim().endsWith('...'));
const sinDesc = data.filter(p => !p.descripcion || p.descripcion.trim() === '');
const cortasOdd = data.filter(p => p.descripcion && !p.descripcion.trim().endsWith('...') && p.descripcion.trim().length < 80);

console.log(`Total trámites: ${data.length}`);
console.log(`Descripciones truncadas (terminan en ...): ${truncados.length}`);
console.log(`Sin descripción: ${sinDesc.length}`);
console.log(`Descripción muy corta (<80 chars, no truncada): ${cortasOdd.length}`);
console.log('\n--- TRUNCADAS (primeras 10) ---');
truncados.slice(0, 10).forEach(p => {
    console.log(`[${p.slug}]`);
    console.log(`  Desc (${p.descripcion.length} chars): ...${p.descripcion.slice(-120)}`);
    console.log('');
});
