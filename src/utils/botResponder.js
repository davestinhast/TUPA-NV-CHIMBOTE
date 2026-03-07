export function buildResponse(query, procedures) {
    if (!procedures || procedures.length === 0) {
        return {
            text: `No encontré trámites relacionados con **"${query}"**.\n\nTe recomiendo:\n* Buscar con términos más generales\n* Ir a Mesa de Partes presencialmente\n* Llamar al **(043) 318289**`,
            procs: []
        };
    }

    const top = procedures[0];
    const others = procedures.slice(1);

    let text = `Encontré **${procedures.length}** trámite(s) relacionado(s):\n\n`;
    text += `📋 **${top.nombre}**\n`;

    if (top.costo) {
        const esGratis = top.costo.toLowerCase().includes('gratuito');
        text += `* 💰 Costo: **${top.costo}**${esGratis ? ' ✅' : ''}\n`;
    }
    if (top.plazo) {
        text += `* ⏱️ Plazo: **${top.plazo}**\n`;
    }
    if (top.calificacion) {
        text += `* 📝 Tipo: **${top.calificacion}**\n`;
    }
    if (top.unidad_responsable) {
        text += `* 🏢 Área: **${top.unidad_responsable}**\n`;
    }
    if (top.requisitos && top.requisitos.length > 0) {
        text += `\n**Requisitos principales:**\n`;
        top.requisitos.slice(0, 3).forEach(req => {
            const shortReq = req.length > 80 ? req.substring(0, 80) + '...' : req;
            text += `* ${shortReq}\n`;
        });
    }
    if (others.length > 0) {
        text += `\nTambién podrían interesarte **${others.length}** trámite(s) más. 👇`;
    }

    return { text, procs: procedures };
}
