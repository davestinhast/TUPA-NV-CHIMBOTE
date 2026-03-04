/**
 * Extract TUPA procedures from raw text file into procedimientos.json
 */
const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync('C:\\Users\\daves\\.gemini\\antigravity\\brain\\2137c4a5-a98d-4885-9050-debd67d4412a\\tupa_raw_text.txt', 'utf-8');

// Categories from the index (pages 5-18)
const categoryMap = {
    'Transparencia y acceso a la información': ['PE123299E43'],
    'Recursos y denuncias': ['PA4070E914', 'PA40702804', 'PA40701A33', 'PA40704EE6'],
    'Registro Civil': ['PA40703BB6', 'PA407032E3', 'PA4070B80C', 'PA4070CA25', 'PA4070686B', 'PA40709A51', 'PA4070FBE8', 'PA4070E1DA', 'PA40701E8B', 'PA4070CB4E', 'PA4070A97E', 'PA4070DDB3', 'PA407050C8', 'PA40706C32', 'PA4070A2C1'],
    'Tributación': ['PA4070A4CF', 'PA407083B4', 'PA407090D3', 'PA40701CC7', 'PA40706A6C', 'PA4070D3C8', 'PA4070EFA7', 'PA40703A4F', 'PA4070FF02', 'PA4070B1C6', 'PA4070D0AB', 'PA40702CCE', 'PA40700B4D', 'PA4070EA5E', 'PA4070EC47', 'PA40708A30', 'PA40705A5E', 'PA40701DE2', 'PA40709DBB', 'PA40704773', 'PA4070D267', 'PA40703CDF'],
    'Publicidad exterior': ['PA40704D1A'],
    'Infraestructura y servicios públicos': ['PA4070D7D9', 'PA4070CEDF', 'PA40709EF3', 'PA407011F1', 'PA40700E5D', 'PA40708CC8', 'PA40700FCA', 'PA40702BD8'],
    'Licencias de edificación': [],  // Will be populated dynamically
    'Habilitación urbana': [],  // Will be populated dynamically
    'Licencias de funcionamiento': ['PA4070E7B0', 'PA40700AF3', 'PA4070FFB0', 'PA4070815F', 'PA40706E66', 'PA4070F75A', 'PA4070D2FD', 'PA407087D7', 'PA4070ADD8', 'PA40704AC7', 'PA4070FE3C', 'PA40703DF8'],
    'Espectáculos públicos': ['PA4070C163', 'PA4070BA3E', 'PA4070CD75', 'PA4070F879', 'PA407019EE', 'PA40704F2F', 'PA4070CF05'],
    'Transporte': ['PA4070BD30', 'PA407044CD', 'PA4070C5F0', 'PA407001DA', 'PA4070E69D', 'PA4070D553', 'PA40703BDD', 'PA4070E8C1', 'PA40704C7A'],
    'Seguridad en edificaciones (ITSE)': ['PA4070DD56', 'PA4070DE17', 'PA40709C39', 'PA407036A7', 'PA407096DF', 'PA4070ABC7', 'PA407020B5', 'PA4070F69D', 'PA407087C1'],
    'Medio ambiente': ['PA407026B0', 'PA407055B9', 'PA4070EC97', 'PA40703131', 'PA407077BB'],
    'Organizaciones sociales': ['PA4070A7EF', 'PA407020CB', 'PA4070AFD3'],
    'Fiscalización': ['PA4070AFBB', 'PA40709FC7', 'PA407029C3', 'PA4070CCDE', 'PA40709BF9', 'PA4070E41D'],
    'Servicios exclusivos - Registro Civil': ['PA40708DA1', 'PA40703CE2', 'PA4070BFED', 'PA4070E5BE', 'PA4070EC6C'],
    'Servicios exclusivos - Tributación': ['PA40704EA1', 'PA40703A38', 'PA407043C5', 'PA4070E7B1', 'PA40702F19', 'PA407062E3', 'PA40706E99', 'PA40700D35'],
    'Servicios exclusivos - Urbanismo': ['PA4070D79C', 'PA4070AA78', 'PA4070D1BB', 'PA4070ABD0', 'PA4070AE2E', 'PA40708F56', 'PA40703FCD', 'PA40707AA4', 'PA4070EF53', 'PA40702660', 'PA4070E10C', 'PA4070A5CB', 'PA4070F1FF', 'PA40709688'],
    'Servicios exclusivos - Otros': ['PA4070E87C', 'PA40709ED6', 'PA4070DCFE', 'PA4070FE3D', 'PA4070BA26', 'PA4070BC69', 'PA4070DE93', 'PA40704C0B', 'PA40706B97', 'PA4070F1E4'],
};

// Split raw text by page markers, capturing page number
const parts = raw.split(/---\s*P[^\d]+(\d+)\s*---/);
const pagesInfo = [];
for (let i = 1; i < parts.length; i += 2) {
    const pageNum = parseInt(parts[i], 10);
    const pageText = parts[i + 1];
    if (pageText.trim().length > 100) {
        pagesInfo.push({ pageNum, text: pageText });
    }
}

// Find all procedure blocks by looking for "Código:" pattern
const procedures = [];
let currentProc = null;

for (let i = 0; i < pagesInfo.length; i++) {
    const pageInfo = pagesInfo[i];
    const page = pageInfo.text;

    // Check for procedure header
    const codeMatch = page.match(/Código:\s*([A-Z0-9]+)/);
    const nameMatch = page.match(/Denominación del Procedimiento Administrativo\s*"([^"]+)"/);

    if (codeMatch && nameMatch) {
        // Save previous procedure
        if (currentProc) {
            procedures.push(finalize(currentProc));
        }

        currentProc = {
            codigo: codeMatch[1].trim(),
            nombre: nameMatch[1].trim(),
            pdf_pagina: pageInfo.pageNum,
            rawPages: [page],
        };
    } else if (currentProc) {
        // Continuation page for current procedure
        currentProc.rawPages.push(page);
    }
}

// Don't forget last procedure
if (currentProc) {
    procedures.push(finalize(currentProc));
}

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 80);
}

function findCategory(codigo, nombre) {
    const n = nombre.toUpperCase();

    if (/ACCESO A LA INFORMACI[OÓ]N|TRANSPARENCIA/.test(n)) return 'Transparencia y Acceso a la Información';
    if (/RECURSO|APELACI[OÓ]N|RECLAMACI[OÓ]N|DENUNCIA VECINAL|DESISTIMIENTO|QUEJA/.test(n)) return 'Recursos Administrativos';
    if (/MATRIMONIO|DEFUNCI[OÓ]N|NACIMIENTO|DIVORCIO|REGISTRO CIVIL|RECONSTITUC|FILIACI|SEPARACI[OÓ]N CONVENCIONAL|DIVORCIO ULTERIOR|ADOPCI[OÓ]N|REPOSICION DE PARTIDA|ANOTACI[OÓ]N|INSCRIPCI[OÓ]N.*NACIMIENTO|INSCRIPCI[OÓ]N.*DEFUNCI|INSCRIPCI[OÓ]N ORDINARIA|INSCRIPCI[OÓ]N EXTEMPORANEA/.test(n)) return 'Registro Civil';
    if (/TERCER[IÍ]A|COBRANZA|EMBARGO|PRESCRIPCI[OÓ]N.*TRIBUTARIA|IMPUESTO PREDIAL|PREDIO.*REGISTRO|ACTUALIZACION.*BASE|INAFECTACI|IMPUTACI[OÓ]N|DACI[OÓ]N DE PAGO|BENEFICIO.*TRIBUTAR|DEDUCCI[OÓ]N.*UIT|RECURSO.*MULTA TRIBUTARIA|EXONERACI[OÓ]N.*ARBITRI|AMPLIACI[OÓ]N.*BENEFICIO|DESCARGA DE PREDIO|RECTIFICACI[OÓ]N.*BASE|DEVOLUCION.*CEDULA|SOLICITUD DE PRESCRIPCI[OÓ]N DE DEUDA/.test(n)) return 'Tributación';
    if (/LICENCIA DE EDIFICACI[OÓ]N|CONFORMIDAD DE OBRA|DECLARATORIA|PREDECLARATORIA|MODIFICACI[OÓ]N.*PROYECTO.*EDIFICACI|ANTEPROYECTO|REGULARIZACI[OÓ]N DE EDIFICACI|LICENCIA DE REGULARIZACI[OÓ]N|PROYECTO INTEGRAL DE EDIFICACI/.test(n)) return 'Licencias de Edificación';
    if (/HABILITACI[OÓ]N URBANA|INDEPENDIZACI[OÓ]N|PARCELACI[OÓ]N|SUBDIVISIÓN|RECEPCI[OÓ]N DE OBRAS|REURBANIZACI[OÓ]N|REGULARIZACI[OÓ]N DE HABILITACI|PROYECTO INTEGRAL DE HABILITACI|SUBDIVI/.test(n)) return 'Habilitación Urbana';
    if (/LICENCIA DE FUNCIONAMIENTO|CESE DE ACTIVIDAD|CAMBIO DE GIRO|TRANSFERENCIA DE LICENCIA|LICENCIA PROVISIONAL|DECLARACION JURADA.*ACTIVIDAD|ACTIVIDADES SIMULT/.test(n)) return 'Licencias de Funcionamiento';
    if (/PUBLICIDAD EXTERIOR|LETRERO|PANEL|TOTEM|TOLDO|AFICHE|LUMINOSO|ILUMINADO/.test(n)) return 'Publicidad Exterior';
    if (/ESPECT[AÁ]CULO|EVENTO/.test(n)) return 'Espectáculos Públicos';
    if (/TRANSPORTE|VEH[IÍ]CULO|PARADERO|FLOTA VEHICULAR|CREDENCIAL.*CONDUCTOR|STICKER|LIBERACI[OÓ]N.*VEH|PAPELETA|CERTIFICADO DE OPERACI|HABILITACION DEL CONDUCTOR|REGISTRO.*EMPADRONAMIENTO|CONSTATACI[OÓ]N.*CARACTER[IÍ]STICA/.test(n)) return 'Transporte y Vehículos';
    if (/INSPECCI[OÓ]N T[EÉ]CNICA|ITSE|SEGURIDAD EN EDIFICACI/.test(n)) return 'Inspección Técnica de Seguridad (ITSE)';
    if (/INFRAESTRUCTURA.*SERVICIO|TELECOMUNICACI|INSTALACI[OÓ]N.*INFRAESTRUCTURA|REMODELACI[OÓ]N.*[AÁ]REA.*P[UÚ]BLIC|CERTIFICADO.*CONFORMIDAD.*OBRA.*[AÁ]REA|AGUA.*DESAG|ENERG[IÍ]A|RADIOCOMUNICACI|MOBILIARIO URBANO/.test(n)) return 'Infraestructura y Servicios Públicos';
    if (/RESIDUO|RECICLADOR|SEGREGACI[OÓ]N|MEDIO AMBIENTE|COMERCIALIZADORA/.test(n)) return 'Medio Ambiente';
    if (/ORGANIZACI[OÓ]N SOCIAL|ELECCIONES VECINALES|PROGRAMA SOCIAL|CREDENCIAL.*MIEMBRO|VEEDUR[IÍ]A/.test(n)) return 'Organizaciones Sociales';
    if (/DEVOLUCI[OÓ]N.*BIENES|MERCADER[IÍ]A|MULTA.*ADMINISTRATIVA|NOTIFICACI[OÓ]N PREVENTIVA|PRESCRIPCI[OÓ]N.*MULTA|FRACCIONAMIENTO.*MULTA|LEVANTAMIENTO.*MULTA|CLAUSURA|DESCARGO/.test(n)) return 'Fiscalización y Sanciones';
    if (/REJA.*BATIENTE|PLUMA.*LEVADIZA|CASETA.*VIGILANCIA|SEGURIDAD.*[AÁ]REA/.test(n)) return 'Seguridad Ciudadana';
    if (/AUTOAVALUÓ|CUPONERA|CONTRIBUYENTE|NO ADEUDO.*TRIBUTAR|ESTADO DE CUENTA|ALCABALA|APLAZAMIENTO|FRACCIONAMIENTO.*DEUDA.*TRIBUTAR|INDEPENDIZACION.*INMOBILIARIA|DUPLICADO.*AUTOVALUO/.test(n)) return 'Servicios Tributarios';
    if (/CERTIFICADO DE NUMERACI|ALINEAMIENTO|SECCIONES VIALES|CATASTRO|POSESI[OÓ]N|VERIFICACI[OÓ]N CATASTRAL|PAR[AÁ]METROS URBAN|FICHA CATASTRAL|PLANO.*HABILITACI|TERRENO.*EXPANSI[OÓ]N|COMPATIBILIDAD.*USO|ACUMULACION.*LOTE|JURISDICCI[OÓ]N|NOMENCLATURA|DEMARCACION|CAMBIO DE ZONIFICACI|PLANEAMIENTO INTEGRAL|VISACI[OÓ]N DE PLANO|ASIGNACI[OÓ]N DE NUMERACI/.test(n)) return 'Urbanismo y Catastro';
    if (/AUTENTICACI[OÓ]N|FEDATARIO|CONSTANCIA DE EXPEDIENTE|COPIA CERTIFICADA|RETIRO.*DESGLOSE|DUPLICADO/.test(n)) return 'Servicios Documentarios';
    if (/ESTADO CIVIL|SOLTER[IÍ]A|PRE MATRIMONIAL|VIUDEZ|NEGATIVO DE NACIMIENTO|DISPENSA.*EDICTO|MODIFICACI[OÓ]N.*FECHA.*CEREMONI|EXPEDICI[OÓ]N.*ACTA|PARTIDA|CERTIFICACI[OÓ]N.*CONSTANCIA/.test(n)) return 'Servicios de Registro Civil';
    if (/CAN[EE]S|IDENTIFICACI[OÓ]N CANINA|TENENCIA/.test(n)) return 'Registro de Canes';
    if (/NO ADEUDO.*NO TRIBUTAR|CONSTANCIA.*POSESI[OÓ]N.*SANEAMIENTO|SANEAMIENTO F[IÍ]SICO/.test(n)) return 'Otros Servicios';
    if (/PRÓRROGA|REVALIDACI[OÓ]N/.test(n) && /EDIFICACI/.test(n)) return 'Licencias de Edificación';
    if (/PRÓRROGA|REVALIDACI[OÓ]N/.test(n) && /HABILITACI/.test(n)) return 'Habilitación Urbana';

    return 'General';
}

function extractRequirements(text) {
    const reqs = [];
    // Find numbered requirements like "1.-" or "1."
    const reqMatches = text.match(/\d+\.-\s*[^\.][^\n]+/g);
    if (reqMatches) {
        reqMatches.forEach(r => {
            const clean = r.replace(/^\d+\.-\s*/, '').trim();
            if (clean.length > 10 && clean.length < 800) {
                reqs.push(clean);
            }
        });
    }
    return reqs.length > 0 ? reqs : ['Consultar en ventanilla'];
}

function extractCosto(text) {
    const montoMatch = text.match(/Monto\s*-\s*S\/\s*([\d,.]+)/);
    if (montoMatch) return `S/ ${montoMatch[1]}`;
    if (/Gratuito/i.test(text)) return 'Gratuito';
    return 'Consultar';
}

function extractPlazo(text) {
    const plazoMatch = text.match(/(\d+)\s*días?\s*hábiles/i);
    if (plazoMatch) return `${plazoMatch[1]} días hábiles`;
    if (/Aprobación automática/i.test(text)) return 'Automático';
    if (/Inmediato/i.test(text)) return 'Inmediato';
    return 'Consultar';
}

function extractCalificacion(text) {
    if (/Aprobación automática/i.test(text)) return 'Aprobación automática';
    if (/Silencio Administrativo Positivo/i.test(text)) return 'Evaluación previa - Silencio Positivo';
    if (/Silencio Administrativo Negativo/i.test(text)) return 'Evaluación previa - Silencio Negativo';
    return 'Evaluación previa';
}

function extractUnidad(text) {
    // Look for common patterns: OFICINA DE X, GERENCIA DE X, SUB GERENCIA DE X, SECRETARIA X
    const patterns = [
        /(?:SUB\s*GERENCIA\s+DE\s+[A-ZÁÉÍÓÚÑ\s,]+)/,
        /(?:GERENCIA\s+DE\s+[A-ZÁÉÍÓÚÑ\s,]+)/,
        /(?:OFICINA\s+DE\s+[A-ZÁÉÍÓÚÑ\s,]+)/,
        /(?:SECRETARIA\s+[A-ZÁÉÍÓÚÑ\s]+)/,
    ];

    for (const pat of patterns) {
        const m = text.match(pat);
        if (m) {
            // Clean up and limit length
            let name = m[0].trim()
                .replace(/\s+/g, ' ')
                .replace(/\s*Teléfono.*$/i, '')
                .replace(/\s*Correo.*$/i, '')
                .replace(/\s*Lima.*$/i, '')
                .replace(/\s*Lunes.*$/i, '');
            if (name.length > 80) name = name.substring(0, 80).trim();
            if (name.length > 10) return name;
        }
    }
    return 'Oficina de Trámite Documentario';
}

function extractDescription(text) {
    const stopperRegex = /(?=\s+Atención Presencial:|\s+Atención Virtual:|\s+Monto -|\s+Aprobación automática:|\s+Evaluación previa|\s+Requisitos\s+1\.-|\s+Requisitos\s+1\.|\s+Notas:\s+1\.-|\s+Base Legal\s|\s+Formularios\s+Canales|$)/i;

    const pat1 = new RegExp(`(Procedimiento(?: Administrativo)? (?:mediante|por|a trav[eé]s)[\\s\\S]*?)${stopperRegex.source}`, 'i');
    const pat2 = new RegExp(`(Es el procedimiento[\\s\\S]*?)${stopperRegex.source}`, 'i');

    const patterns = [pat1, pat2];

    for (const pattern of patterns) {
        const m = text.match(pattern);
        if (m && m[1].length > 30) {
            return m[1].trim().replace(/\s+/g, ' ');
        }
    }

    // Fallback if no specific trigger word
    const fallback = text.match(/Denominación del Procedimiento Administrativo.*?"(?:[^"]+)"([\s\S]*?)(?=\s+Requisitos\s+1\.-|\s+Requisitos\s+1\.|\s+Condiciones|\s+Base Legal|\s+Formularios\s+Canales|\s+Notas:\s+1\.-|\s+Procedimiento administrativo mediante|$)/i);
    if (fallback && fallback[1].trim().length > 30) {
        let clean = fallback[1].trim().replace(/\s+/g, ' ');
        if (!clean.startsWith('Código') && clean.length < 1500) {
            return clean;
        }
    }

    return '';
}

function extractBaseLegal(text) {
    const bases = [];
    const lawPatterns = [
        /Ley\s*(?:N[°º])?\s*\d+/gi,
        /Decreto\s*(?:Supremo|Legislativo)\s*(?:N[°º])?\s*[\d\-]+/gi,
        /Ordenanza\s*(?:Municipal)?\s*(?:N[°º])?\s*[\d\-]+/gi,
    ];

    const seen = new Set();
    for (const pattern of lawPatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const clean = match[0].trim();
            if (!seen.has(clean)) {
                seen.add(clean);
                bases.push(clean);
            }
        }
    }

    return bases.length > 0 ? bases : ['Ley N° 27444'];
}

function extractNotas(text) {
    const notas = [];
    const notasSection = text.match(/Notas:\s*([\s\S]*?)(?=Formularios|Canales de atención|Base Legal)/);
    if (notasSection) {
        const noteMatches = notasSection[1].match(/\d+\.-\s*[^\d][^]*?(?=\d+\.-|$)/g);
        if (noteMatches) {
            noteMatches.forEach(n => {
                const clean = n.replace(/^\d+\.-\s*/, '').trim().replace(/\s+/g, ' ');
                if (clean.length > 10 && clean.length < 600) {
                    notas.push(clean);
                }
            });
        }
    }
    return notas;
}

function finalize(proc) {
    let fullText = proc.rawPages.join(' ');

    // Clean institutional pdf headers and footers
    fullText = fullText.replace(/Lima,\s*[a-z]+\s*\d+\s*de\s*[a-z]+\s*de\s*\d+\s*NORMAS\s*LEGALES\s*\d+\s*Op\.\s*[\d\-]+/gi, ' ');
    fullText = fullText.replace(/Plataforma Digital Oficial.*?Municipalidad Distrital de Nuevo Chimbote/gi, ' ');
    fullText = fullText.replace(/Portal TUPA Digital/gi, ' ');
    fullText = fullText.replace(/Texto Único de Procedimientos Administrativos/gi, ' ');
    fullText = fullText.replace(/\s+/g, ' '); // Normalize spaces after removing chunks

    return {
        codigo: proc.codigo,
        nombre: proc.nombre.replace(/\s+/g, ' '),
        slug: slugify(proc.nombre),
        categoria: findCategory(proc.codigo, proc.nombre),
        descripcion: extractDescription(fullText),
        requisitos: extractRequirements(fullText),
        notas: extractNotas(fullText),
        costo: extractCosto(fullText),
        plazo: extractPlazo(fullText),
        calificacion: extractCalificacion(fullText),
        unidad_responsable: extractUnidad(fullText),
        base_legal: extractBaseLegal(fullText),
        canales: {
            presencial: 'Plataformas de Atención al Ciudadano (Palacio Municipal)',
            virtual: 'https://facilita.gob.pe/t/4220 / tramite@muninuevochimbote.gob.pe',
            telefonico: '043-318289'
        },
        horario: 'Lunes a Viernes de 08:00 a 13:00 y de 14:00 a 15:30',
        pdf_pagina: proc.pdf_pagina,
        pdf_referencia_imagen: `/tupa-capturas/${proc.codigo}.png`
    };
}

// Ensure public/data directory exists
const outputDir = path.join(__dirname, 'public', 'data');
fs.mkdirSync(outputDir, { recursive: true });

// Write JSON
fs.writeFileSync(
    path.join(outputDir, 'procedimientos.json'),
    JSON.stringify(procedures, null, 2),
    'utf-8'
);

console.log(`✅ Extracted ${procedures.length} procedures`);

// Print category distribution
const catCount = {};
procedures.forEach(p => {
    catCount[p.categoria] = (catCount[p.categoria] || 0) + 1;
});
console.log('\nCategory distribution:');
Object.entries(catCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
});
