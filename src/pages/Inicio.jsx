import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { Search, FileText, Building2, Scale, Truck, TreePine, ShieldCheck, Hammer, Map, Landmark, Users, BookOpen, Dog, Receipt, ClipboardList, Megaphone, AlertTriangle, Eye, ArrowRight, CheckCircle2, CopyPlus, BarChart3, ShieldEllipsis, Info, ChevronRight } from 'lucide-react';

const CATEGORY_ICONS = {
    'Transparencia y Acceso a la Información': Eye,
    'Recursos Administrativos': AlertTriangle,
    'Registro Civil': BookOpen,
    'Tributación': Receipt,
    'Licencias de Edificación': Hammer,
    'Habilitación Urbana': Map,
    'Licencias de Funcionamiento': Building2,
    'Publicidad Exterior': Megaphone,
    'Espectáculos Públicos': Megaphone,
    'Transporte y Vehículos': Truck,
    'Inspección Técnica de Seguridad (ITSE)': ShieldCheck,
    'Infraestructura y Servicios Públicos': Landmark,
    'Medio Ambiente': TreePine,
    'Organizaciones Sociales': Users,
    'Fiscalización y Sanciones': Scale,
    'Seguridad Ciudadana': ShieldCheck,
    'Urbanismo y Catastro': Map,
    'Servicios Documentarios': ClipboardList,
    'Servicios de Registro Civil': BookOpen,
    'Registro de Canes': Dog,
    'Otros Servicios': CopyPlus,
    'General': FileText,
};


function useCounter(end, duration = 1500) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);


            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return count;
}

import { api } from '../api';

import { mapIntent } from '../utils/intentMapper';

export default function Inicio() {
    const [procedures, setProcedures] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.getProcedures().then(setProcedures);
    }, []);

    const categories = useMemo(() => {
        const map = {};
        procedures.forEach(p => {
            if (!map[p.categoria]) map[p.categoria] = 0;
            map[p.categoria]++;
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }, [procedures]);


    const procCount = useCounter(procedures.length || 260);
    const catCount = useCounter(categories.length || 18);
    const gratisCount = useCounter(procedures.filter(p => p.costo && p.costo.toLowerCase().includes('gratuito')).length || 45);

    const handleSearch = (e) => {
        e.preventDefault();
        const rawTerm = searchTerm.trim();
        if (rawTerm) {
            const smartTerm = mapIntent(rawTerm);
            navigate(`/buscar?q=${encodeURIComponent(smartTerm)}&original=${encodeURIComponent(rawTerm)}`);
        } else {
            navigate('/buscar');
        }
    };

    return (
        <AnimatedPage>
            <section className="hero" style={{
                backgroundImage: `linear-gradient(135deg, rgba(11,12,12,0.85) 0%, rgba(19,99,208,0.4) 100%), url(${import.meta.env.BASE_URL}hero-chimbote.jpg)`
            }}>
                <div className="hero-content">
                    <div className="hero-lockup animate-fade-up">
                        <div style={{
                            width: '140px',
                            height: '140px',
                            background: 'white',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            padding: '12px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <img
                                src={`${import.meta.env.BASE_URL}escudo-chimbote.png`}
                                alt="Escudo de Nuevo Chimbote"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                        <div className="hero-lockup-text">
                            <div className="hero-lockup-name">
                                <span className="hero-lockup-tupa">TUPA</span>
                                <span className="hero-lockup-digital">DIGITAL</span>
                            </div>
                            <div className="hero-lockup-divider" style={{ background: 'var(--primary)', height: '4px', margin: '0.4rem 0' }} />
                            <span className="hero-lockup-sub">
                                MUNICIPALIDAD DE NUEVO CHIMBOTE
                            </span>
                        </div>
                    </div>

                    <p className="hero-subtitle animate-fade-up" style={{
                        animationDelay: '0.2s',
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                        maxWidth: '800px',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '1rem',
                        borderRadius: '8px',
                        backdropFilter: 'blur(4px)'
                    }}>
                        Directorio oficial de trámites y servicios de la Municipalidad Distrital de Nuevo Chimbote.
                        Consulta requisitos, costos y plazos de manera rápida y transparente.
                    </p>
                    <form
                        className="hero-search-enhanced animate-fade-up"
                        style={{
                            animationDelay: '0.4s',
                            width: '100%',
                            maxWidth: '750px',
                            background: 'white',
                            borderRadius: '12px',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}
                        onSubmit={handleSearch}
                    >
                        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Search className="search-icon" size={24} strokeWidth={2.5} style={{ position: 'absolute', left: '1.2rem', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="¿Qué trámite buscas? (Ej: Licencia, Matrimonio, Arbitrios...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    fontSize: '1.2rem',
                                    padding: '1.2rem 1rem 1.2rem 4rem',
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--text)',
                                    fontWeight: 500
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2.5rem',
                                borderRadius: '8px',
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-dark)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                        >
                            <span>Buscar</span>
                            <ChevronRight size={20} strokeWidth={3} />
                        </button>
                    </form>

                    <div className="hero-stats animate-fade-up" style={{ animationDelay: '0.6s' }}>
                        <div className="hero-stat" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}>
                            <div className="hero-stat-icon" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}><FileText size={24} strokeWidth={2.5} /></div>
                            <div className="hero-stat-info">
                                <span className="number">{procCount}</span>
                                <span className="label">Procedimientos</span>
                            </div>
                        </div>
                        <div className="hero-stat" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}>
                            <div className="hero-stat-icon" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}><ClipboardList size={24} strokeWidth={2.5} /></div>
                            <div className="hero-stat-info">
                                <span className="number">{catCount}</span>
                                <span className="label">Categorías</span>
                            </div>
                        </div>
                        <div className="hero-stat" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}>
                            <div className="hero-stat-icon" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}><Landmark size={24} strokeWidth={2.5} /></div>
                            <div className="hero-stat-info">
                                <span className="number">{gratisCount}</span>
                                <span className="label">Gratuitos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="categories-section">
                <div className="container">
                    <h2 className="section-title animate-fade-up">Explorar Categorías</h2>
                    <p className="section-subtitle animate-fade-up" style={{ animationDelay: '0.1s' }}>Selecciona un área para ver sus procedimientos disponibles</p>
                    <motion.div
                        className="categories-grid"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                    >
                        {categories.map(([cat, count], idx) => {
                            const Icon = CATEGORY_ICONS[cat] || FileText;
                            return (
                                <motion.div
                                    key={cat}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        show: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <Link
                                        to={`/buscar?categoria=${encodeURIComponent(cat)}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="category-card">
                                            <div className="cat-icon"><Icon size={24} strokeWidth={2} /></div>
                                            <h3>{cat}</h3>
                                            <div className="cat-count">
                                                <FileText size={14} /> {count} trámite{count !== 1 ? 's' : ''}
                                            </div>
                                            <div className="cat-link">Ver trámites <ArrowRight size={16} strokeWidth={2.5} /></div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>
            <section className="transparency-section">
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="transparency-grid">
                        <div className="transparency-text animate-fade-up">
                            <div className="trust-badge">
                                <ShieldEllipsis size={20} /> Entidad Verificada 2025
                            </div>
                            <h2 style={{ marginTop: '1rem' }}>Compromiso con la Transparencia</h2>
                            <p>
                                El TUPA Digital no solo facilita el acceso a la información, sino que garantiza que cada ciudadano
                                conozca sus derechos, costos reales y plazos legales sin intermediarios.
                            </p>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                                    <CheckCircle2 size={24} color="#4CAF50" />
                                    <span>Datos 100% oficializados</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                                    <CheckCircle2 size={24} color="#4CAF50" />
                                    <span>Actualización constante</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card-premium animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ width: '45px', height: '45px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BarChart3 size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Distribución de Costos</h4>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Análisis de {procedures.length || 260} procedimientos</span>
                                </div>
                            </div>

                            <div className="stat-progress-container">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                    <span style={{ fontWeight: 600 }}>Trámites Gratuitos</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{Math.round((procedures.filter(p => p.costo && p.costo.toLowerCase().includes('gratuito')).length / (procedures.length || 260)) * 100) || 18}%</span>
                                </div>
                                <div className="stat-progress-bar">
                                    <div
                                        className="stat-progress-fill"
                                        style={{
                                            width: `${(procedures.filter(p => p.costo && p.costo.toLowerCase().includes('gratuito')).length / (procedures.length || 260)) * 100 || 18}%`,
                                            background: 'var(--primary)'
                                        }}
                                    />
                                    <div
                                        className="stat-progress-fill"
                                        style={{
                                            flex: 1,
                                            background: '#f0f0f0'
                                        }}
                                    />
                                </div>
                                <div className="stat-legend">
                                    <span>{procedures.filter(p => p.costo && p.costo.toLowerCase().includes('gratuito')).length || 45} Servicios</span>
                                    <span>{(procedures.length || 260) - (procedures.filter(p => p.costo && p.costo.toLowerCase().includes('gratuito')).length || 45)} Con Derecho a Trámite</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', padding: '1.2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Info size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    El <strong>{Math.round((procedures.filter(p => p.calificacion && p.calificacion.includes('Automática')).length / (procedures.length || 260)) * 100) || 12}%</strong> de los trámites son de aprobación inmediata.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedPage>
    );
}
