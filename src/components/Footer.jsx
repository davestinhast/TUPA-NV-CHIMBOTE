import { MapPin, Phone, Mail, Clock, ShieldCheck, FileText, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">

            {/* MAIN CONTENT */}
            <div className="footer-content">

                {/* BRAND COLUMN */}
                <div className="footer-col" style={{ gridColumn: 'span 2' }}>
                    {/* Logo + ícono */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            background: 'white',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                            flexShrink: 0,
                        }}>
                            <img
                                src="/tupa-icon.png"
                                alt="Ícono TUPA Digital"
                                style={{ width: '200%', height: '200%', objectFit: 'contain', transform: 'scale(1.8)' }}
                            />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', lineHeight: 1 }}>
                                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>TUPA</span>
                                <span style={{ fontSize: '1.6rem', fontWeight: 200, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.12em' }}>DIGITAL</span>
                            </div>
                            <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, transparent 100%)', margin: '0.3rem 0' }} />
                            <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Municipalidad Distrital de Nuevo Chimbote
                            </span>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.87rem', lineHeight: 1.75, maxWidth: 320, color: 'rgba(255,255,255,0.65)' }}>
                        Portal Oficial del Texto Único de Procedimientos Administrativos (TUPA) 2025
                        de la Municipalidad Distrital de Nuevo Chimbote.
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.6rem', fontStyle: 'italic' }}>
                        Aprobado mediante Ordenanza Municipal N° 009‑2024‑MDNCH
                    </p>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.73rem', fontWeight: 500 }}>
                            260 Procedimientos
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.73rem', fontWeight: 500 }}>
                            18 Categorías
                        </span>
                        <span style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.35)', color: '#86efac', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.73rem', fontWeight: 600 }}>
                            ● Actualizado 2025
                        </span>
                    </div>
                </div>

                {/* CONTACT COLUMN */}
                <div className="footer-col">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={15} style={{ opacity: 0.6 }} /> Contacto
                    </h4>
                    <div className="footer-col-links">
                        <p style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <MapPin size={14} style={{ opacity: 0.45, marginTop: 3, flexShrink: 0 }} />
                            Palacio Municipal, Centro Cívico s/n, Nuevo Chimbote
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Phone size={14} style={{ opacity: 0.45 }} />
                            <a href="tel:+51043318289" style={{ color: 'inherit' }}>(043) 318289</a>
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Mail size={14} style={{ opacity: 0.45 }} />
                            <a href="mailto:mesadepartes@muninuevochimbote.gob.pe" style={{ color: 'inherit', wordBreak: 'break-all' }}>
                                mesadepartes@muninuevochimbote.gob.pe
                            </a>
                        </p>
                        <p style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <Clock size={14} style={{ opacity: 0.45, marginTop: 3, flexShrink: 0 }} />
                            <span>
                                Lun – Vie<br />
                                08:00 – 13:00 h&nbsp;&nbsp;/&nbsp;&nbsp;14:00 – 15:30 h
                            </span>
                        </p>
                    </div>
                </div>

                {/* LINKS COLUMN */}
                <div className="footer-col">
                    <h4>🔗 Portal Institucional</h4>
                    <div className="footer-col-links">
                        <a href="https://www.muninuevochimbote.gob.pe" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ExternalLink size={13} style={{ opacity: 0.55 }} /> Web Oficial
                        </a>
                        <a href="https://facilita.gob.pe/t/4220" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ExternalLink size={13} style={{ opacity: 0.55 }} /> Facilita Perú (Trámites Online)
                        </a>
                        <a href="https://www.muninuevochimbote.gob.pe/DOCPORTAL/TUPA-2025-MDNCH.pdf" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FileText size={13} style={{ opacity: 0.55 }} /> Descargar TUPA 2025 (PDF)
                        </a>
                        <a href="https://www.gob.pe/institucion/muninuevochimbote" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ShieldCheck size={13} style={{ opacity: 0.55 }} /> Portal Transparencia (Gob.pe)
                        </a>
                    </div>
                </div>

            </div>

            {/* DIVIDER */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '0 2rem' }} />

            {/* BOTTOM BAR */}
            <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>© {year} Municipalidad Distrital de Nuevo Chimbote — Todos los derechos reservados</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.45, fontSize: '0.78rem' }}>
                    Hecho con <Heart size={12} style={{ color: '#f87171' }} /> para los ciudadanos de Nuevo Chimbote
                </span>
            </div>

        </footer>
    );
}
