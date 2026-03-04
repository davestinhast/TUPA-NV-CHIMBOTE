
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'public', 'data', 'procedimientos.json');
const procs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
function cleanText(text) {
    if (!text) return '';
    return text
        .replace(/pág\.\s*\d+\s*"?MUNICIPALIDAD[^"]*"?/gi, '')
        .replace(/\bpág\.\s*\d+\b/gi, '')
        .replace(/Pago por derecho de tramitaci[oó]n[\s\S]*?Plazo m[aá]ximo de respuesta\s*\d+.*?d[ií]as h[aá]biles/gi, '')
        .replace(/Modalidad de pagos[\s\S]*?d[ií]as h[aá]biles/gi, '')
        .replace(/Sedes y horarios de atenci[oó]n[\s\S]{0,500}?d[ií]as h[aá]biles/gi, '')
        .replace(/Unidad de organizaci[oó]n[\s\S]*?d[ií]as h[aá]biles/gi, '')
        .replace(/SUBGERENCIA[\s\S]*?d[ií]as h[aá]biles/gi, '')
        .replace(/Instancias de resoluci[oó]n de recursos[\s\S]*/gi, '')
        .replace(/Reconsideraci[oó]n[\s\S]*/gi, '')
        .replace(/Las copias simples de los documentos citados[\s\S]*/gi, '')
        .replace(/4\.- Las copias simples[\s\S]*/gi, '')
        .replace(/conforme lo previsto en el art[ií]culo[\s\S]*/gi, '')
        .replace(/"MUNICIPALIDAD DISTRITAL DE NUEVO CHIMBOTE"/g, '')
        .replace(/\s{3,}/g, ' ')
        .replace(/\.\s*\./g, '.')
        .trim();
}
function toSentenceCase(str) {
    if (!str) return '';
    const letters = str.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ]/g, '');
    const uppers = str.replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '');
    if (letters.length > 0 && uppers.length / letters.length > 0.55) {
        return str.toLowerCase().replace(/(^|[.!?]\s+)([a-záéíóúüñ])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    }
    return str;
}
function buildCitizenDescription(proc) {
    const nombre = proc.nombre.trim();
    const cat = proc.categoria;
    const costo = proc.costo;
    const plazo = proc.plazo;
    const silencio = proc.silencio_administrativo;
    const cleaned = toSentenceCase(cleanText(proc.descripcion || ''));
    let desc = cleaned.length > 800
        ? cleaned.substring(0, 800).replace(/[,;:\s]+$/, '') + '.'
        : cleaned;
    if (!desc || desc.length < 30) {
        desc = generateBaseDescription(nombre, cat, costo, plazo);
    }
    const extras = [];
    if (costo && costo !== 'Gratuito' && !desc.toLowerCase().includes('gratuito') && !desc.includes(costo)) {
    }
    return desc;
}
function generateBaseDescription(nombre, categoria, costo, plazo) {
    const n = nombre.toLowerCase();
    if (categoria === 'Licencias de Edificación') {
        if (n.includes('modalidad a')) return 'Permite obtener la autorización municipal para realizar obras de construcción bajo la Modalidad A (aprobación automática con firma de profesional). Apta para obras de menor complejidad. La licencia tiene vigencia de 36 meses desde su emisión y puede prorrogarse por única vez por 12 meses adicionales.';
        if (n.includes('modalidad b')) return 'Permite obtener la autorización municipal para realizar obras de construcción bajo la Modalidad B (aprobación con revisión de planos). El municipio evalúa el proyecto antes de emitir la licencia, que tiene una vigencia de 36 meses.';
        if (n.includes('modalidad c')) return 'Permite obtener la autorización para construcciones de mayor complejidad o envergadura bajo la Modalidad C, que requiere evaluación previa por la Comisión Técnica. La licencia tiene vigencia de 36 meses desde su emisión.';
        if (n.includes('modalidad d')) return 'Autorización para obras de gran escala o proyectos especiales bajo la Modalidad D, que requiere evaluación completa por comisión técnica especializada. La licencia tiene vigencia de 36 meses.';
        if (n.includes('prórroga') || n.includes('prorroga')) return 'Permite ampliar la vigencia de una Licencia de Edificación que está por vencer. Debe solicitarse dentro de los 30 días calendario anteriores al vencimiento. La prórroga se otorga por única vez y tiene una vigencia de 12 meses.';
        if (n.includes('revalidaci') || n.includes('revalidacion')) return 'Permite renovar una Licencia de Edificación vencida para continuar con las obras inconclusas. La revalidación se otorga por única vez y tiene una vigencia de 36 meses.';
        if (n.includes('modificaci')) return 'Permite solicitar cambios al proyecto de edificación ya aprobado, ya sea de forma parcial o sustancial, antes de ejecutar dichas modificaciones en obra.';
        if (n.includes('conformidad') || n.includes('recepci')) return 'Trámite necesario para obtener la conformidad oficial de obra una vez concluida la construcción, certificando que fue ejecutada conforme a los planos aprobados.';
        if (n.includes('demolici')) return 'Autorización municipal requerida para la demolición total o parcial de una edificación existente, garantizando que se cumplan las normas de seguridad.';
        if (n.includes('declaratoria')) return 'Trámite para inscribir oficialmente la edificación concluida e independizar las unidades (departamentos, oficinas, etc.) en el Registro de Predios.';
        return 'Procedimiento para obtener la autorización municipal necesaria antes de iniciar obras de construcción, ampliación o modificación de edificaciones en el distrito de Nuevo Chimbote.';
    }
    if (categoria === 'Habilitación Urbana') {
        if (n.includes('modalidad a')) return 'Autorización para la habilitación urbana (lotización y acondicionamiento de terrenos) bajo la Modalidad A, de aprobación automática. Aplica a proyectos de baja complejidad que cumplen los parámetros establecidos.';
        if (n.includes('modalidad b')) return 'Autorización para la habilitación urbana con evaluación previa del proyecto por la Subgerencia de Obras Privadas. Aplica a urbanizaciones con características específicas que requieren revisión técnica.';
        if (n.includes('modalidad c') || n.includes('modalidad d')) return 'Autorización para habilitaciones urbanas complejas o de gran escala que requieren evaluación por la Comisión Técnica Municipal antes de su aprobación.';
        if (n.includes('recepci')) return 'Trámite para obtener la conformidad municipal de las obras de habilitación urbana concluidas (pistas, veredas, redes de servicios), validando que se ejecutaron conforme al proyecto aprobado.';
        if (n.includes('prórroga') || n.includes('prorroga')) return 'Ampliación del plazo de la Licencia de Habilitación Urbana para continuar con los trabajos de urbanización. Debe solicitarse antes del vencimiento de la licencia vigente.';
        return 'Procedimiento para obtener la licencia que permite convertir terrenos rústicos en urbanos (urbanización), incluyendo la instalación de servicios básicos, pistas, veredas y la subdivisión en lotes.';
    }
    if (categoria === 'Tributación') {
        if (n.includes('descuento') || n.includes('exoneraci') || n.includes('inafectaci') || n.includes('beneficio')) return 'Permite solicitar la exoneración, inafectación o descuento en el pago de tributos municipales, dirigida a contribuyentes que por ley tienen derecho a estos beneficios (adultos mayores, pensionistas, predios de instituciones sin fines de lucro, etc.).';
        if (n.includes('fraccionamiento') || n.includes('aplazamiento')) return 'Permite solicitar el pago en cuotas o el aplazamiento del pago de deudas tributarias con la municipalidad, facilitando el cumplimiento de obligaciones para contribuyentes con dificultades de pago.';
        if (n.includes('prescripci')) return 'Solicitud para que la municipalidad declare la extinción de una deuda tributaria por el transcurso del tiempo legalmente establecido sin que haya sido cobrada.';
        if (n.includes('reclamaci') || n.includes('apelaci')) return 'Recurso formal para impugnar una determinación de deuda tributaria, una resolución de multa o cualquier acto administrativo tributario con el que el contribuyente no esté de acuerdo.';
        if (n.includes('constancia') || n.includes('certificado')) return 'Permite obtener un documento oficial que acredita el estado de los pagos de tributos municipales del contribuyente, requerido generalmente para operaciones de compra-venta, refinanciamiento u otros trámites.';
        return 'Trámite de carácter tributario ante la Municipalidad de Nuevo Chimbote. Consulte los requisitos específicos y asegúrese de contar con su número de contribuyente (RUC o DNI) registrado en el sistema municipal.';
    }
    if (categoria === 'Licencias de Funcionamiento') {
        if (n.includes('baja') || n.includes('cese')) return 'Permite dar de baja la Licencia de Funcionamiento de un local cuando el negocio cierra definitivamente o cambia de actividad, liberando al titular de obligaciones tributarias y administrativas futuras.';
        if (n.includes('modificaci')) return 'Permite actualizar los datos de una Licencia de Funcionamiento existente cuando cambian las condiciones del negocio (razón social, giro, área, etc.) sin necesidad de tramitar una nueva licencia desde cero.';
        if (n.includes('provisional')) return 'Licencia temporal que permite iniciar operaciones mientras se obtiene la Licencia de Funcionamiento definitiva. Generalmente se otorga en el acto de presentar la solicitud completa.';
        if (n.includes('cesión') || n.includes('tranferencia')) return 'Permite transferir la titularidad de una Licencia de Funcionamiento a un nuevo propietario o empresa, manteniendo las mismas condiciones del local comercial.';
        return 'Autorización municipal obligatoria para el funcionamiento legal de establecimientos comerciales, industriales o de servicios en el distrito de Nuevo Chimbote. Su obtención garantiza que el negocio opera en un local adecuado y seguro.';
    }
    if (categoria === 'Publicidad Exterior') {
        return 'Autorización municipal para la instalación de elementos publicitarios en la vía pública o en fachadas de inmuebles (paneles, letreros, banderolas, etc.), garantizando el cumplimiento de las normas de seguridad y ornato del distrito.';
    }
    if (categoria === 'Espectáculos Públicos') {
        return 'Autorización municipal requerida para la realización de eventos y espectáculos públicos de carácter no deportivo en el distrito de Nuevo Chimbote, asegurando el cumplimiento de normas de seguridad y aforo.';
    }
    if (categoria === 'Transporte y Vehículos') {
        if (n.includes('habilitaci')) return 'Autorización para operar vehículos de transporte en el distrito, verificando que cumplan los requisitos técnicos y legales de seguridad vial.';
        if (n.includes('concesi')) return 'Otorgamiento del derecho de explotación de una ruta o servicio de transporte público en el ámbito territorial del distrito de Nuevo Chimbote.';
        return 'Trámite relacionado con la regulación y autorización de servicios de transporte en el distrito de Nuevo Chimbote. Consulte los requisitos específicos para su tipo de vehículo o servicio.';
    }
    if (categoria === 'Inspección Técnica de Seguridad (ITSE)') {
        if (n.includes('básica ex ante') || n.includes('basica ex ante')) return 'Inspección técnica previa (antes de iniciar operaciones) de seguridad en establecimientos de menor riesgo y capacidad reducida, realizada por un inspector de la municipalidad para verificar el cumplimiento de las condiciones básicas de seguridad.';
        if (n.includes('ex ante')) return 'Inspección de seguridad realizada antes de la apertura del establecimiento para verificar que cumple con las condiciones mínimas de seguridad establecidas en la normativa vigente.';
        if (n.includes('ex post')) return 'Inspección de seguridad realizada después de la apertura del establecimiento para verificar el mantenimiento de las condiciones de seguridad durante su operación.';
        if (n.includes('multidisciplinaria')) return 'Inspección realizada por un equipo especializado de la municipalidad para establecimientos de alta concurrencia o riesgo elevado, evaluando múltiples aspectos de seguridad simultáneamente.';
        return 'Inspección Técnica de Seguridad en Edificaciones realizada por la Municipalidad para verificar que los establecimientos cumplan con las normas de seguridad, evacuación y prevención de accidentes.';
    }
    if (categoria === 'Registro Civil' || categoria === 'Servicios de Registro Civil') {
        if (n.includes('nacimiento')) return 'Registro e inscripción del nacimiento de un ciudadano en el Registro Civil de la Municipalidad, obteniendo el acta de nacimiento oficial que acredita la identidad y filiación de la persona.';
        if (n.includes('defunci')) return 'Inscripción oficial del deceso de una persona en el Registro Civil municipal, obteniendo el acta de defunción necesaria para trámites sucesorios, seguros, retiro de ESSALUD y otros.';
        if (n.includes('matrimon')) return 'Trámite para celebrar o inscribir un matrimonio en el Registro Civil de la Municipalidad, obteniendo el acta matrimonial con validez legal.';
        if (n.includes('rectificaci')) return 'Corrección de errores u omisiones en partidas del Registro Civil (nacimiento, matrimonio, defunción) mediante resolución judicial o administrativa, según el tipo de error.';
        return 'Trámite del Registro Civil de la Municipalidad de Nuevo Chimbote. Estos registros tienen plena validez legal y son necesarios para acreditar el estado civil y los hechos vitales de los ciudadanos.';
    }
    if (categoria === 'Medio Ambiente') {
        if (n.includes('constancia')) return 'Certificado emitido por la Municipalidad que acredita la participación activa del ciudadano o empresa en los programas ambientales municipales, como la segregación de residuos en la fuente.';
        if (n.includes('poda') || n.includes('tala')) return 'Autorización municipal para la poda o tala de árboles en la vía pública o en terrenos privados, garantizando que se apliquen las medidas ambientales compensatorias adecuadas.';
        if (n.includes('residuos') || n.includes('reciclaje')) return 'Trámite relacionado con el manejo adecuado de residuos sólidos en el distrito, promoviendo la cultura de reciclaje y la gestión responsable de desechos.';
        return 'Trámite ambiental ante la Municipalidad de Nuevo Chimbote orientado al cuidado y preservación del medio ambiente local, en cumplimiento de la normativa ambiental vigente.';
    }
    if (categoria === 'Urbanismo y Catastro') {
        if (n.includes('certificado de zonificaci')) return 'Documento oficial que indica la zonificación urbanística asignada a un predio (residencial, comercial, industrial, etc.) y los usos de suelo permitidos según el Plan de Desarrollo Urbano.';
        if (n.includes('alineamiento')) return 'Documento que indica la línea de propiedad del predio respecto a la vía pública, necesario para proyectos de construcción o ampliación.';
        if (n.includes('numeraci')) return 'Asignación oficial del número predial de una propiedad, necesario para la inscripción en el Registro de Predios y para la obtención de servicios públicos.';
        if (n.includes('subdvisi') || n.includes('subdivisi')) return 'Autorización para dividir un lote en dos o más parcelas independientes, cumpliendo con los parámetros urbanísticos establecidos en el Plan de Desarrollo Urbano.';
        if (n.includes('catastral') || n.includes('catastro')) return 'Trámite relacionado con el registro y actualización de la información catastral del predio en la base de datos municipal, incluyendo el estado físico, valor y uso del inmueble.';
        return 'Trámite de planificación urbana ante la Subgerencia de Urbanismo y Catastro de la Municipalidad de Nuevo Chimbote. Estos procedimientos aseguran el ordenamiento territorial y el uso adecuado del suelo.';
    }
    if (categoria === 'Organizaciones Sociales') {
        return 'Trámite para el reconocimiento, inscripción o actualización de organizaciones sociales de base (juntas vecinales, asociaciones, comedores populares, etc.) ante la Municipalidad de Nuevo Chimbote, otorgándoles personería jurídica municipal.';
    }
    if (categoria === 'Seguridad Ciudadana') {
        if (n.includes('rejas') || n.includes('plumas') || n.includes('casetas') || n.includes('seguridad')) return 'Autorización municipal para instalar elementos físicos de seguridad en áreas de uso público (rejas, plumas levadizas, casetas de vigilancia), garantizando que no obstaculicen la circulación peatonal ni el tránsito vehicular.';
        return 'Trámite relacionado con la seguridad ciudadana ante la Municipalidad de Nuevo Chimbote. Consulte los requisitos específicos en la ventanilla de Seguridad Ciudadana.';
    }
    if (categoria === 'Infraestructura y Servicios Públicos') {
        return 'Trámite para la autorización, supervisión o conformidad de obras de infraestructura urbana en el distrito de Nuevo Chimbote, incluyendo pavimentación, áreas verdes, redes de servicio y espacios públicos.';
    }
    if (categoria === 'Fiscalización y Sanciones') {
        if (n.includes('reclamaci') || n.includes('apelaci') || n.includes('queja')) return 'Recurso administrativo para impugnar una sanción, multa o resolución emitida por la Subgerencia de Fiscalización de la Municipalidad. Permite al administrado ejercer su derecho a la defensa.';
        return 'Procedimiento relacionado con la fiscalización y control del cumplimiento de normas municipales. Las sanciones incluyen multas, clausuras o decomisos según la infracción cometida.';
    }
    if (categoria === 'Transparencia y Acceso a la Información') {
        return 'Solicitud de acceso a la información pública que obra en poder de la Municipalidad de Nuevo Chimbote, en cumplimiento de la Ley N° 27806, Ley de Transparencia y Acceso a la Información Pública. La municipalidad tiene 7 días hábiles para responder.';
    }
    if (categoria === 'Recursos Administrativos') {
        if (n.includes('reconsideraci')) return 'Recurso administrativo que permite solicitar la revisión de una resolución municipal ante la misma autoridad que la emitió, presentando nuevas pruebas o argumentos que no fueron considerados inicialmente.';
        if (n.includes('apelaci')) return 'Recurso administrativo para impugnar una resolución municipal ante la autoridad superior jerárquica, cuando el administrado no está de acuerdo con la decisión emitida en primera instancia.';
        return 'Recurso administrativo que el ciudadano puede interponer para cuestionar decisiones de la Municipalidad de Nuevo Chimbote que considere incorrectas o lesivas a sus derechos.';
    }
    if (categoria === 'Servicios Documentarios') {
        if (n.includes('copia') || n.includes('fedateo')) return 'Servicio de reproducción o fedateo (certificación de autenticidad) de documentos que obran en el archivo de la Municipalidad de Nuevo Chimbote, con plena validez legal.';
        return 'Servicio de expedición, certificación o reproducción de documentos del archivo municipal. Los documentos obtenidos tienen plena validez legal para trámites ante otras entidades.';
    }
    if (categoria === 'Registro de Canes') {
        return 'Registro obligatorio de perros (canes) ante la Municipalidad de Nuevo Chimbote, en cumplimiento de la Ley N° 27596. El registro identifica al propietario y al animal, contribuyendo al control de zoonosis y la seguridad de la comunidad.';
    }
    return `Procedimiento administrativo ante la Municipalidad Distrital de Nuevo Chimbote — ${categoria}. Consulte los requisitos específicos en la ventanilla de atención al ciudadano o en el portal web municipal.`;
}
let improved = 0;
let kept = 0;
const updated = procs.map(proc => {
    const originalDesc = proc.descripcion || '';
    const cleaned = toSentenceCase(cleanText(originalDesc));
    let finalDesc;
    if (cleaned && cleaned.length >= 60) {
        finalDesc = cleaned.length > 600
            ? cleaned.substring(0, 597).replace(/[,;:\s]+$/, '') + '...'
            : cleaned;
        kept++;
    } else {
        finalDesc = generateBaseDescription(proc.nombre, proc.categoria, proc.costo, proc.plazo);
        improved++;
    }
    return { ...proc, descripcion: finalDesc };
});
fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf-8');
console.log(`✅ Procesados: ${updated.length} procedimientos`);
console.log(`   ↳ Limpios y mejorados: ${kept}`);
console.log(`   ↳ Generados desde plantilla: ${improved}`);
console.log('');
console.log('=== EJEMPLOS MEJORADOS ===');
[0, 10, 50, 150, 250].forEach(i => {
    const p = updated[i];
    console.log(`\n[${p.codigo}] ${p.nombre.substring(0, 60)}`);
    console.log(`DESC: ${p.descripcion.substring(0, 200)}...`);
});
