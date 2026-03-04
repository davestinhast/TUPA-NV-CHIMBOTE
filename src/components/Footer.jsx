import { MapPin, Phone, Mail, Clock, ShieldCheck, FileText, ExternalLink, Heart } from 'lucide-react';
import LogoTupa from './LogoTupa';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">

            {}
            <div className="footer-content">

                {}
                <div className="footer-col" style={{ gridColumn: 'span 2' }}>
                    <div style={{ transform: 'scale(0.9)', transformOrigin: 'left', filter: 'brightness(0) invert(1)', marginBottom: '1.2rem', opacity: 0.9 }}>
                        <LogoTupa />
                    </div>
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.7, maxWidth: 320, color: 'rgba(255,255,255,0.7)' }}>
                        Portal Oficial del Texto Único de Procedimientos Administrativos (TUPA) 2025
                        de la Municipalidad Distrital de Nuevo Chimbote.
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.8rem', fontStyle: 'italic' }}>
                        Aprobado mediante Ordenanza Municipal N° 009‑2024‑MDNCH
                    </p>
                    <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', padding: '0.25rem 0.7rem', borderRadius: 20, fontSize: '0.74rem', fontWeight: 500 }}>
                            260 Procedimientos
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', padding: '0.25rem 0.7rem', borderRadius: 20, fontSize: '0.74rem', fontWeight: 500 }}>
                            18 Categorías
                        </span>
                        <span style={{ background: 'rgba(198,40,40,0.3)', border: '1px solid rgba(198,40,40,0.5)', color: '#ffcdd2', padding: '0.25rem 0.7rem', borderRadius: 20, fontSize: '0.74rem', fontWeight: 600 }}>
                            🟢 Actualizado 2025
                        </span>
                    </div>
                </div>

                {}
                <div className="footer-col">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={15} style={{ opacity: 0.7 }} /> Contacto
                    </h4>
                    <div className="footer-col-links">
                        <p style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <MapPin size={14} style={{ opacity: 0.5, marginTop: 3, flexShrink: 0 }} />
                            Palacio Municipal, Centro Cívico s/n, Nuevo Chimbote
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Phone size={14} style={{ opacity: 0.5 }} />
                            <a href="tel:+51043318289" style={{ color: 'inherit' }}>(043) 318289</a>
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Mail size={14} style={{ opacity: 0.5 }} />
                            <a href="mailto:mesadepartes@muninuevochimbote.gob.pe" style={{ color: 'inherit', wordBreak: 'break-all' }}>
                                mesadepartes@muninuevochimbote.gob.pe
                            </a>
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Clock size={14} style={{ opacity: 0.5 }} />
                            Lun – Vie, 08:00 – 15:30 h
                        </p>
                    </div>
                </div>

                {}
                <div className="footer-col">
                    <h4>
                        🔗 Portal Institucional
                    </h4>
                    <div className="footer-col-links">
                        <a href="https://www.muninuevochimbote.gob.pe" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ExternalLink size={13} style={{ opacity: 0.6 }} /> Web Oficial
                        </a>
                        <a href="https://facilita.gob.pe/t/4220" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ExternalLink size={13} style={{ opacity: 0.6 }} /> Facilita Peru (Trámites Online)
                        </a>
                        <a href="https://www.muninuevochimbote.gob.pe/DOCPORTAL/TUPA-2025-MDNCH.pdf" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FileText size={13} style={{ opacity: 0.6 }} /> Descargar TUPA 2025 (PDF)
                        </a>
                        <a href="https://www.gob.pe/institucion/muninuevochimbote" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ShieldCheck size={13} style={{ opacity: 0.6 }} /> Portal Transparencia (Gob.pe)
                        </a>
                    </div>
                </div>
            </div>

            {}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0 2rem' }} />

            {}
            <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>
                    © {year} Municipalidad Distrital de Nuevo Chimbote — Todos los derechos reservados
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.5, fontSize: '0.78rem' }}>
                    Hecho con <Heart size={12} style={{ color: '#ff6b6b' }} /> para los ciudadanos de Nuevo Chimbote
                </span>
            </div>

        </footer>
    );
}
