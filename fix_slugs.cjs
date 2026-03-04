const fs = require('fs');
const dataPath = './public/data/procedimientos.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function toSlug(str) {
    return str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 80)
        .replace(/-$/, '');
}

const slugCount = {};
data.forEach(p => { slugCount[p.slug] = (slugCount[p.slug] || 0) + 1; });
const duplicados = new Set(Object.keys(slugCount).filter(s => slugCount[s] > 1));

console.log(`Slugs duplicados a corregir: ${duplicados.size}`);

const slugsSeen = {};
let corregidos = 0;

const updated = data.map(p => {
    if (!duplicados.has(p.slug)) {
        slugsSeen[p.slug] = true;
        return p;
    }
    const codigoSufix = p.codigo.toLowerCase().replace(/[^a-z0-9]/g, '');
    const newSlug = `${p.slug.substring(0, 70)}-${codigoSufix}`.replace(/-+/g, '-').replace(/-$/, '');
    corregidos++;
    return { ...p, slug: newSlug };
});

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf-8');
console.log(`✅ Slugs únicos generados: ${corregidos}`);
console.log('\nVerificando duplicados restantes...');
const newSlugs = updated.map(p => p.slug);
const newDups = newSlugs.filter((s, i) => newSlugs.indexOf(s) !== i);
console.log(`Duplicados restantes: ${newDups.length} ${newDups.length === 0 ? '✅' : '❌'}`);
