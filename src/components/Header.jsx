import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ChevronRight, ExternalLink, HelpCircle } from 'lucide-react';
import LogoTupa from './LogoTupa';

export default function Header() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isBuscar = location.pathname === '/buscar';

    return (
        <header className="site-header">

            { }
            <div className="header-top">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <span>🇵🇪 Plataforma Digital Oficial del Estado Peruano</span>
                    <span style={{ opacity: 0.5 }}>|</span>
                    <a
                        href="https://www.muninuevochimbote.gob.pe"
                        target="_blank"
                        rel="noopener"
                        style={{ color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem' }}
                    >
                        muninuevochimbote.gob.pe <ExternalLink size={11} />
                    </a>
                </div>
            </div>

            { }
            <div className="header-main animate-fade-in">

                <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>
                    <LogoTupa />
                </Link>

                { }
                <nav className="header-nav">
                    <Link
                        to="/"
                        className={isHome ? 'nav-active' : ''}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <Home size={16} strokeWidth={2.5} />
                        <span>Inicio</span>
                    </Link>

                    <Link
                        to="/buscar"
                        className={isBuscar ? 'nav-active' : ''}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <Search size={16} strokeWidth={2.5} />
                        <span>Directorio</span>
                    </Link>

                    <Link
                        to="/acerca"
                        className={location.pathname === '/acerca' ? 'nav-active' : ''}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <HelpCircle size={16} strokeWidth={2.5} />
                        <span>Acerca del TUPA</span>
                    </Link>

                    <a
                        href="https://www.muninuevochimbote.gob.pe/DOCPORTAL/TUPA-2025-MDNCH.pdf"
                        target="_blank"
                        rel="noopener"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.5rem 1rem', borderRadius: '6px',
                            background: 'var(--primary)', color: 'white',
                            fontWeight: 600, fontSize: '0.88rem',
                            transition: 'all 0.2s ease',
                            marginRight: '0.5rem'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-dark)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                    >
                        <span>📄 TUPA 2025</span>
                    </a>

                </nav>
            </div>

            { }
            {!isHome && (
                <div style={{
                    background: 'var(--bg)',
                    borderTop: '1px solid var(--border)',
                    padding: '0.45rem 2rem',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    maxWidth: '100%'
                }}>
                    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Link to="/" style={{ color: 'var(--secondary)', fontWeight: 500 }}>Inicio</Link>
                        <ChevronRight size={12} />
                        <span style={{ color: 'var(--text)' }}>
                            {isBuscar ? 'Directorio de Trámites' : location.pathname === '/acerca' ? 'Acerca del TUPA' : 'Detalle del Trámite'}
                        </span>
                    </div>
                </div>
            )}
        </header>
    );
}
