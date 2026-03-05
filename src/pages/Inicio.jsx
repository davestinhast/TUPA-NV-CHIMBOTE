import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, FileText, Building2, Scale, Truck, TreePine, ShieldCheck, Hammer, Map, Landmark, Users, BookOpen, Dog, Receipt, ClipboardList, Megaphone, AlertTriangle, Eye, ArrowRight, CheckCircle2, CopyPlus } from 'lucide-react';

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

export default function Inicio() {
    const [procedures, setProcedures] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/data/procedimientos.json')
            .then(r => r.json())
            .then(setProcedures)
            .catch(console.error);
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
        if (searchTerm.trim()) {
            navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate('/buscar');
        }
    };

    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-lockup animate-fade-up">
                        <div style={{
                            width: '130px',
                            height: '130px',
                            background: 'white',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
                            overflow: 'hidden',
                        }}>
                            <img
                                src="/tupa-icon.png"
                                alt="Ícono TUPA Digital"
                                style={{
                                    width: '200%',
                                    height: '200%',
                                    objectFit: 'contain',
                                    transform: 'scale(1.8)',
                                }}
                            />
                        </div>
                        <div className="hero-lockup-text">
                            <div className="hero-lockup-name">
                                <span className="hero-lockup-tupa">TUPA</span>
                                <span className="hero-lockup-digital">DIGITAL</span>
                            </div>
                            <div className="hero-lockup-divider" />
                            <span className="hero-lockup-sub">Municipalidad Distrital de Nuevo Chimbote</span>
                        </div>
                    </div>

                    <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        Directorio oficial de trámites y servicios de la Municipalidad Distrital de Nuevo Chimbote.
                        Consulta requisitos, costos y plazos de manera rápida, transparente y 100% digital.
                    </p>
                    <form className="hero-search animate-fade-up" style={{ animationDelay: '0.4s' }} onSubmit={handleSearch}>
                        <Search className="search-icon" size={22} strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="Escribe el nombre del trámite o código (Ej. Licencia de Edificación)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                    <div className="categories-grid">
                        {categories.map(([cat, count], idx) => {
                            const Icon = CATEGORY_ICONS[cat] || FileText;
                            const delay = Math.min((idx * 0.05), 0.8) + 's';
                            return (
                                <Link
                                    key={cat}
                                    to={`/buscar?categoria=${encodeURIComponent(cat)}`}
                                    className="animate-fade-up"
                                    style={{ textDecoration: 'none', animationDelay: delay, animationFillMode: 'both' }}
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
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
