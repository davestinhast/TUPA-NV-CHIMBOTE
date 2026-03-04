const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'public', 'data', 'procedimientos.json');
const procs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

function generateCompleteDescription(proc) {
    const n = proc.nombre.toLowerCase();
    const cat = proc.categoria;
    const costo = proc.costo;
    const plazo = proc.plazo;
    const calificacion = proc.calificacion || '';
    const silencio = proc.silencio_administrativo || '';
    const unidad = proc.unidad_responsable || '';

    const sufijo = (costo && costo !== 'Gratuito')
        ? ` El derecho de trámite es de ${costo}.`
        : ' Este procedimiento no tiene costo (gratuito).';

    const plazaSuf = plazo ? ` El plazo máximo de atención es de ${plazo}.` : '';
    const silSuf = calificacion ? ` Calificación: ${calificacion}.` : '';

    if (cat === 'Licencias de Edificación') {
        if (n.includes('modalidad a') && n.includes('unifamiliar'))
            return `Procedimiento administrativo mediante el cual una persona natural o jurídica solicita el otorgamiento de licencia para realizar obras de edificación de una vivienda unifamiliar de hasta 120 m² bajo la Modalidad A de aprobación automática con firma de profesional responsable. La Municipalidad verifica el cumplimiento de los requisitos técnicos y legales, y otorga la Licencia de Edificación de forma inmediata. Esta licencia no requiere renovación, tiene una vigencia de treinta y seis (36) meses contados a partir de su emisión y puede ser prorrogada por única vez por un lapso de doce (12) meses calendario adicionales, siempre que se solicite antes de su vencimiento.${sufijo}${plazaSuf}`;
        if (n.includes('modalidad a'))
            return `Procedimiento para obtener la Licencia de Edificación bajo la Modalidad A de aprobación automática con firma de profesional responsable. Aplica a obras de menor complejidad que no requieren revisión previa del proyecto por la comisión técnica. La Municipalidad verifica el cumplimiento de los requisitos formales y emite la licencia en el acto. La licencia tiene vigencia de treinta y seis (36) meses desde su emisión y puede ser prorrogada por única vez por doce (12) meses calendario adicionales, previa solicitud antes de su vencimiento.${sufijo}${plazaSuf}`;
        if (n.includes('modalidad b'))
            return `Procedimiento para obtener la Licencia de Edificación bajo la Modalidad B de aprobación con evaluación previa de proyecto. El expediente es revisado por la Subgerencia de Obras Privadas antes de la emisión de la licencia, verificando el cumplimiento de parámetros urbanísticos y normas técnicas. La Licencia de Edificación otorgada tiene una vigencia de treinta y seis (36) meses desde su fecha de emisión y puede prorrogarse por única vez por doce (12) meses, previa solicitud.${sufijo}${plazaSuf}`;
        if (n.includes('modalidad c'))
            return `Procedimiento para obtener la Licencia de Edificación bajo la Modalidad C, que requiere evaluación previa por la Comisión Técnica Municipal, conformada por profesionales especializados en arquitectura, estructuras e instalaciones. Esta modalidad aplica a obras de mayor complejidad técnica o magnitud. La Licencia de Edificación aprobada tiene una vigencia de treinta y seis (36) meses desde su emisión y puede ser prorrogada por doce (12) meses adicionales.${sufijo}${plazaSuf}`;
        if (n.includes('modalidad d'))
            return `Procedimiento para obtener la Licencia de Edificación bajo la Modalidad D, destinada a proyectos de gran escala o especiales que requieren evaluación técnica integral por la Comisión Técnica Municipal. Esta modalidad aplica a edificaciones de alta complejidad técnica y/o gran impacto urbano. La licencia otorgada tiene validez de treinta y seis (36) meses y puede prorrogarse por doce (12) meses.${sufijo}${plazaSuf}`;
        if (n.includes('prórroga') || n.includes('prorroga'))
            return `Procedimiento para ampliar la vigencia de una Licencia de Edificación vigente, cuando las obras no hayan podido concluirse dentro del plazo original. La prórroga debe solicitarse dentro de los treinta (30) días calendario previos al vencimiento de la licencia y se otorga por única vez hasta por doce (12) meses adicionales. No procede la prórroga de licencias ya vencidas.${sufijo}${plazaSuf}`;
        if (n.includes('conformidad') || n.includes('recepci'))
            return `Procedimiento para obtener la Conformidad de Obra o Declaratoria de Edificación, que acredita que las obras de construcción han sido ejecutadas conforme al proyecto aprobado y a las normas técnicas vigentes. Es el acto final del proceso constructivo legal y permite gestionar la Declaratoria de Fábrica ante el Registro de Predios. Debe solicitarse dentro de los tres (3) meses siguientes a la culminación de las obras.${sufijo}${plazaSuf}`;
        if (n.includes('demolici'))
            return `Autorización municipal requerida antes de proceder a la demolición total o parcial de una edificación existente en el distrito de Nuevo Chimbote. La municipalidad evalúa las condiciones de seguridad del proceso de demolición y verifica el no impacto a edificaciones vecinas. El expediente debe incluir la memoria descriptiva del proceso, planos y la firma del profesional responsable.${sufijo}${plazaSuf}`;
        return `Procedimiento administrativo relacionado con la Licencia de Edificación ante la Subgerencia de Obras Privadas de la Municipalidad Distrital de Nuevo Chimbote. Verifica el cumplimiento de los parámetros urbanísticos y normas técnicas de edificación vigentes. Para mayor información, acérquese a la ventanilla de Obras Privadas.${sufijo}${plazaSuf}`;
    }

    if (cat === 'Habilitación Urbana') {
        return `Procedimiento para obtener la licencia que permite habilitar terrenos rústicos para uso urbano en el distrito de Nuevo Chimbote, incluyendo la dotación de servicios básicos (agua, desagüe, energía eléctrica), vías de acceso, veredas y áreas de aporte. La Municipalidad verifica el cumplimiento del Plan de Desarrollo Urbano y los parámetros técnicos aplicables. La licencia otorgada habilita al propietario para ejecutar las obras de urbanización e inscribir los lotes resultantes en el Registro de Predios.${sufijo}${plazaSuf}`;
    }

    if (cat === 'Registro Civil' || cat === 'Servicios de Registro Civil') {
        if (n.includes('matrimon'))
            return `Procedimiento administrativo mediante el cual los contrayentes solicitan celebrar o inscribir el matrimonio civil ante la Municipalidad Distrital de Nuevo Chimbote, al amparo de lo establecido en el Libro III del Código Civil. La celebración del matrimonio se programará en fecha y hora acordadas, ya sea en el local municipal o fuera de él según lo solicitado. Una vez celebrado, se expide el Acta de Matrimonio correspondiente. Ambos contrayentes deben comparecer personalmente y cumplir con todos los requisitos documentales establecidos.${sufijo}${plazaSuf}`;
        if (n.includes('nacimiento'))
            return `Procedimiento para inscribir el nacimiento de una persona en el Registro Civil de la Municipalidad Distrital de Nuevo Chimbote, conforme a lo dispuesto en el Código Civil y la normativa del RENIEC. La inscripción genera el Acta de Nacimiento correspondiente, documento fundamental para la obtención del DNI y el ejercicio de derechos civiles. Debe realizarse dentro de los treinta (30) días calendario siguientes al nacimiento para evitar recargos o multas.${sufijo}${plazaSuf}`;
        if (n.includes('defunci'))
            return `Procedimiento para inscribir el fallecimiento de una persona en el Registro Civil de la Municipalidad Distrital de Nuevo Chimbote. La inscripción genera el Acta de Defunción, documento indispensable para gestionar trámites sucesorios, cobros de seguros de vida, retiro de sistemas de pensiones (AFP, ONP) y cancelación de registros ante RENIEC. Debe realizarse de manera oportuna, presentando el certificado médico de defunción.${sufijo}${plazaSuf}`;
        if (n.includes('separaci') || n.includes('divorcio'))
            return `Procedimiento para tramitar la separación convencional o el divorcio ulterior de mutuo acuerdo ante la Municipalidad Distrital de Nuevo Chimbote, en ejercicio de la atribución conferida por la Ley N° 29227. Aplica para cónyuges sin hijos menores de edad o con hijos mayores que no dependan económicamente de ellos. El procedimiento incluye la presentación de la solicitud conjunta, la audiencia de ratificación y la emisión de la Resolución correspondiente, previo cumplimiento del plazo legal de separación.${sufijo}${plazaSuf}`;
        return `Trámite del Registro Civil ante la Municipalidad Distrital de Nuevo Chimbote. Los registros civiles (nacimiento, matrimonio, defunción y otros) son la base del sistema de identificación ciudadana y tienen plena validez legal a nivel nacional. Para mayor información, acérquese a la Oficina del Registro Civil.${sufijo}${plazaSuf}`;
    }

    if (cat === 'Tributación') {
        if (n.includes('prescripci'))
            return `Procedimiento que permite al contribuyente solicitar que la Municipalidad declare la extinción de una deuda tributaria por el transcurso del tiempo legalmente establecido conforme al Código Tributario (generalmente cuatro años para deudas declaradas y seis para no declaradas), sin que dicha deuda haya sido cobrada en el plazo oportuno. La declaración de prescripción extingue la acción de cobro coactivo y libera al contribuyente de la obligación. Debe presentarse formalmente con los medios probatorios que acrediten la antigüedad de la deuda.${sufijo}${plazaSuf}`;
        if (n.includes('beneficio') || n.includes('deducci') || n.includes('exoneraci') || n.includes('inafectaci'))
            return `Procedimiento para acceder a beneficios tributarios reconocidos por ley ante la Municipalidad Distrital de Nuevo Chimbote. Pueden acceder los contribuyentes que cumplan los requisitos establecidos, como pensionistas, adultos mayores, personas con discapacidad, organizaciones sin fines de lucro, entre otros. El beneficio otorgado puede comprender exoneración total o parcial del Impuesto Predial y/o de los Arbitrios Municipales. La solicitud debe presentarse con los documentos que acrediten la condición especial del solicitante.${sufijo}${plazaSuf}`;
        if (n.includes('reclamaci') || n.includes('apelaci'))
            return `Recurso formal mediante el cual el contribuyente impugna ante la Municipalidad Distrital de Nuevo Chimbote una Resolución de Determinación de deuda tributaria, Resolución de Multa u otro acto administrativo tributario que considere contrario a sus derechos o a la normativa aplicable. La Reclamación debe presentarse dentro del plazo establecido por el Código Tributario y la autoridad competente resolverá en los plazos legalmente previstos. De no estar conforme con la resolución, puede interponer Apelación ante el Tribunal Fiscal.${sufijo}${plazaSuf}`;
        return `Trámite de carácter tributario ante la Subgerencia de Administración Tributaria de la Municipalidad Distrital de Nuevo Chimbote. Para su correcta atención, el contribuyente debe contar con su código o número de contribuyente registrado en el sistema municipal. Para consultas o asesoría, acérquese a la ventanilla de Orientación al Contribuyente.${sufijo}${plazaSuf}`;
    }

    if (cat === 'Licencias de Funcionamiento') {
        if (n.includes('baja') || n.includes('cese'))
            return `Procedimiento mediante el cual el titular de una Licencia de Funcionamiento solicita formalmente el cese de operaciones de su establecimiento comercial ante la Municipalidad Distrital de Nuevo Chimbote. La baja de la licencia libera al titular de futuras obligaciones de pago por concepto de arbitrios y tasas de fiscalización a partir de la fecha declarada de cierre. Es importante realizarlo oportunamente para evitar el arrastre de deudas tributarias post-cierre.${sufijo}${plazaSuf}`;
        return `Autorización municipal obligatoria que habilita el funcionamiento legal de un establecimiento comercial, industrial o de servicios en el distrito de Nuevo Chimbote. La licencia verifica que el local cumple con las condiciones de seguridad, zonificación urbana y demás exigencias de ley. Su obtención es requisito previo para el inicio de operaciones de cualquier negocio y es exigible durante toda la vida del establecimiento.${sufijo}${plazaSuf}`;
    }

    if (cat === 'Inspección Técnica de Seguridad (ITSE)') {
        return `Procedimiento de Inspección Técnica de Seguridad en Edificaciones (ITSE) realizado por la Municipalidad Distrital de Nuevo Chimbote conforme a la Ley N° 28976 y el Reglamento de ITSE. La inspección verifica el cumplimiento de las condiciones de seguridad del establecimiento (señalización, extintores, rutas de evacuación, sistemas contraincendio, entre otros). La aprobación de la ITSE es requisito para obtener o mantener la Licencia de Funcionamiento.${sufijo}${plazaSuf}`;
    }

    if (cat === 'Transparencia y Acceso a la Información') {
        return `Procedimiento mediante el cual cualquier ciudadano puede solicitar información pública que obre en poder de la Municipalidad Distrital de Nuevo Chimbote, en ejercicio del derecho reconocido por la Ley N° 27806, Ley de Transparencia y Acceso a la Información Pública. La entidad cuenta con siete (7) días hábiles para atender la solicitud, pudiendo prorrogarse por cinco (5) días adicionales en casos justificados. Procede contra cualquier acto, documento o información de carácter público no exceptuado por ley.${sufijo}${plazaSuf}`;
    }

    if (cat === 'Recursos Administrativos') {
        if (n.includes('desistimiento'))
            return `Procedimiento mediante el cual el administrado manifiesta formalmente su voluntad de retirar o abandonar una solicitud, petición o recurso que se encuentra en trámite ante la Municipalidad Distrital de Nuevo Chimbote. El desistimiento puede ser del procedimiento, de la pretensión o de un recurso, y sus efectos varían según el tipo declarado. No requiere la expresión de causa y produce efecto una vez notificado al administrado.${sufijo}${plazaSuf}`;
        if (n.includes('queja'))
            return `Queja formal que el ciudadano puede interponer ante la Municipalidad Distrital de Nuevo Chimbote cuando considere que un procedimiento administrativo está siendo tramitado de forma irregular o con dilaciones indebidas. No constituye un recurso impugnatorio, sino un mecanismo de control que obliga a la autoridad a pronunciarse sobre las deficiencias del trámite en un plazo de tres (3) días hábiles.${sufijo}${plazaSuf}`;
        return `Recurso administrativo que el ciudadano puede interponer ante la Municipalidad Distrital de Nuevo Chimbote para cuestionar o impugnar decisiones que considere contrarias a sus derechos o a la normativa vigente, conforme a lo establecido en la Ley N° 27444, Ley del Procedimiento Administrativo General.${sufijo}${plazaSuf}`;
    }

    return `Procedimiento administrativo ante la Municipalidad Distrital de Nuevo Chimbote — ${cat}. Para mayor información sobre los requisitos específicos, costos y plazos, acérquese a la ventanilla de atención al ciudadano (Palacio Municipal, Centro Cívico s/n) en horario de lunes a viernes de 08:00 a 15:30 horas, o consulte el portal web institucional.${sufijo}${plazaSuf}`;
}

let mejorados = 0;
let sineEditar = 0;

const actualizados = procs.map(proc => {
    if (proc.descripcion && proc.descripcion.trim().endsWith('...')) {
        const nueva = generateCompleteDescription(proc);
        mejorados++;
        return { ...proc, descripcion: nueva };
    }
    sineEditar++;
    return proc;
});

fs.writeFileSync(dataPath, JSON.stringify(actualizados, null, 2), 'utf-8');
console.log(`✅ Procesados: ${actualizados.length} trámites`);
console.log(`   ↳ Descripciones completadas: ${mejorados}`);
console.log(`   ↳ Sin cambios (ya estaban bien): ${sineEditar}`);
console.log('');
console.log('--- Ejemplos de descripciones completadas ---');
actualizados.filter(p => p.descripcion && !p.descripcion.endsWith('...')).slice(0, 3).forEach(p => {
    console.log(`\n[${p.nombre.substring(0, 60)}]`);
    console.log(p.descripcion.substring(0, 250));
});
