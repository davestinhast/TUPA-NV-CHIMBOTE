const fs = require('fs');
const path = require('path');

const RAW_TEXT_PATH = 'C:\\Users\\daves\\.gemini\\antigravity\\brain\\2137c4a5-a98d-4885-9050-debd67d4412a\\tupa_raw_text.txt';
const JSON_PATH = 'C:\\Users\\daves\\Desktop\\XD\\tupa-portal\\public\\data\\procedimientos.json';

const rawText = fs.readFileSync(RAW_TEXT_PATH, 'utf8');
const procedimientos = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

console.log('--- Iniciando extracción mejorada de requisitos ---');

// Split by procedure denomination
const blocks = rawText.split(/Denominación del Procedimiento Administrativo/i);
const requirementsMap = {};

blocks.forEach(block => {
    // Extract Code
    const codeMatch = block.match(/Código:\s+([A-Z0-9]+)/i);
    if (!codeMatch) return;
    const code = codeMatch[1].trim();

    // Extract Requirements section
    // Pattern: everything between 'Requisitos' and ('Notas:' or 'Formularios')
    const reqSection = block.match(/Requisitos\s+([\s\S]*?)(?=\s+Notas:|\s+Formularios\s|\s+Canales de atención)/i);

    if (reqSection) {
        let text = reqSection[1].trim();

        // Clean up text
        // Remove page numbers like "pág. 21" or "Lima, martes 11 de marzo de 2025" or header chunks
        text = text.replace(/pág\.\s+\d+/gi, '');
        text = text.replace(/Texto Único de Procedimientos Administrativos ".*?"/gi, '');
        text = text.replace(/Lima, martes 11 de marzo de 2025 NORMAS LEGALES \d+ Op\. \d+-\d+/gi, '');
        text = text.replace(/--- Página \d+ ---/g, '');

        // Find numbered items: 1.-, 2.-, etc.
        const items = [];
        const itemRegex = /(\d{1,2})\.-/g;
        let match;
        let lastIndex = 0;
        let lastNum = 0;

        while ((match = itemRegex.exec(text)) !== null) {
            const currentNum = parseInt(match[1]);
            const currentIndex = match.index;

            if (items.length > 0) {
                // Add text of previous item
                const prevText = text.substring(lastIndex, currentIndex).replace(/\s+/g, ' ').trim();
                if (prevText) {
                    items[items.length - 1].text = prevText;
                }
            }

            items.push({ num: currentNum, text: '' });
            lastIndex = currentIndex + match[0].length;
            lastNum = currentNum;
        }

        // Add last item text
        if (items.length > 0) {
            const lastText = text.substring(lastIndex).replace(/\s+/g, ' ').trim();
            if (lastText) {
                items[items.length - 1].text = lastText;
            }
        }

        // Map items to array of strings
        if (items.length > 0) {
            requirementsMap[code] = items.map(it => `${it.num}.- ${it.text}`);
        } else if (text.length > 10) {
            // Fallback for non-numbered but present text
            requirementsMap[code] = [text.replace(/\s+/g, ' ').trim()];
        }
    }
});

let updatedCount = 0;
procedimientos.forEach(proc => {
    if (requirementsMap[proc.codigo]) {
        proc.requisitos = requirementsMap[proc.codigo];
        updatedCount++;
    }
});

fs.writeFileSync(JSON_PATH, JSON.stringify(procedimientos, null, 2));

console.log(`--- Proceso terminado ---`);
console.log(`Procedimientos totales: ${procedimientos.length}`);
console.log(`Requisitos actualizados: ${updatedCount}`);
