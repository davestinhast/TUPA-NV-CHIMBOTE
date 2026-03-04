const fs = require('fs');
const dataPath = './public/data/procedimientos.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const PALABRAS_MENORES = new Set([
    'de', 'del', 'la', 'las', 'lo', 'los', 'el', 'y', 'o', 'a', 'en', 'con', 'por', 'para',
    'sin', 'ni', 'se', 'al', 'un', 'una', 'unos', 'unas', 'e', 'u', 'sobre', 'ante', 'bajo',
    'tras', 'entre', 'mediante', 'según', 'contra', 'desde', 'hasta', 'hacia', 'durante'
]);

function toTitleCase(str) {
    if (!str) return str;
    const allUpper = str.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ]/g, '');
    const upperCount = str.replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '').length;
    const ratio = allUpper.length > 0 ? upperCount / allUpper.length : 0;
    if (ratio < 0.8) return str;

    return str.toLowerCase().split(' ').map((word, idx) => {
        const clean = word.replace(/[()\/,.-]/g, '').toLowerCase();
        if (idx > 0 && PALABRAS_MENORES.has(clean)) return word;
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

let corregidos = 0;
const updated = data.map(p => {
    const original = p.nombre;
    const nuevo = toTitleCase(original);
    if (nuevo !== original) {
        corregidos++;
        return { ...p, nombre: nuevo };
    }
    return p;
});

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf-8');
console.log(`✅ Nombres corregidos a Title Case: ${corregidos} de ${data.length}`);
console.log('\nEjemplos:');
updated.filter((p, i) => data[i].nombre !== p.nombre).slice(0, 8).forEach(p => {
    const orig = data.find(d => d.codigo === p.codigo).nombre;
    console.log(`  "${orig.substring(0, 50)}" → "${p.nombre.substring(0, 50)}"`);
});
