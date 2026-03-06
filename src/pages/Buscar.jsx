import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, FileText, Filter, Bot } from 'lucide-react';
import TramiteCard from '../components/TramiteCard';
import SkeletonCard from '../components/SkeletonCard';

import { api } from '../api';

export default function Buscar() {
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get('q') || '';
    const original = searchParams.get('original') || '';
    const catFilter = searchParams.get('categoria') || '';
    const quickFilter = searchParams.get('f') || '';

    useEffect(() => {
        api.getProcedures().then(data => {
            setProcedures(data);
            setLoading(false);
        });
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(procedures.map(p => p.categoria));
        return Array.from(cats).sort();
    }, [procedures]);

    const filtered = useMemo(() => {
        let result = procedures;

        if (catFilter) {
            result = result.filter(p => p.categoria === catFilter);
        }

        if (query) {
            const q = query.toLowerCase();
            result = result.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                p.codigo.toLowerCase().includes(q) ||
                p.descripcion.toLowerCase().includes(q)
            );
        }

        if (quickFilter === 'gratis') {
            result = result.filter(p => p.costo && p.costo.toLowerCase() === 'gratuito');
        } else if (quickFilter === 'virtual') {
            result = result.filter(p => p.canales && (p.canales.virtual || p.canales.correo));
        } else if (quickFilter === 'rapido') {
            result = result.filter(p => {
                if (!p.plazo) return false;
                const matches = p.plazo.match(/(\d+)/);
                return matches && parseInt(matches[1]) <= 5;
            });
        }

        return result;
    }, [procedures, query, catFilter, quickFilter]);


    const grouped = useMemo(() => {
        const map = {};
        filtered.forEach(p => {
            if (!map[p.categoria]) map[p.categoria] = [];
            map[p.categoria].push(p);
        });
        return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
    }, [filtered]);

    const updateSearch = (newQuery) => {
        const params = new URLSearchParams(searchParams);
        if (newQuery) params.set('q', newQuery);
        else params.delete('q');
        setSearchParams(params);
    };

    const updateCategory = (cat) => {
        setIsFiltering(true);
        const params = new URLSearchParams(searchParams);
        if (cat) params.set('categoria', cat);
        else params.delete('categoria');
        setSearchParams(params);
        setTimeout(() => setIsFiltering(false), 300);
    };

    const updateQuickFilter = (f) => {
        setIsFiltering(true);
        const params = new URLSearchParams(searchParams);
        if (quickFilter === f) params.delete('f');
        else params.set('f', f);
        setSearchParams(params);
        setTimeout(() => setIsFiltering(false), 300);
    };

    const showSkeletons = loading || isFiltering;

    return (
        <div
            className="search-page animate-fade-in"
        >
            <div className="search-header">
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                    Directorio de Trámites
                </h1>

                <div className="search-bar-container">
                    <div className="search-input-wrapper">
                        <Search className="icon" size={20} strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="Buscar por código, nombre o descripción..."
                            value={query}
                            onChange={(e) => updateSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '320px', minWidth: '260px' }}>
                        <Filter className="icon" size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <select
                            className="filter-select"
                            value={catFilter}
                            onChange={(e) => updateCategory(e.target.value)}
                            style={{ paddingLeft: '2.8rem', width: '100%' }}
                        >
                            <option value="">Todas las áreas temáticas</option>
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="quick-filters">
                    <button onClick={() => updateQuickFilter('gratis')} className={`quick-filter-btn ${quickFilter === 'gratis' ? 'active' : ''}`}>
                        💸 Gratuitos
                    </button>
                    <button onClick={() => updateQuickFilter('virtual')} className={`quick-filter-btn ${quickFilter === 'virtual' ? 'active' : ''}`}>
                        💻 Trámite Virtual
                    </button>
                    <button onClick={() => updateQuickFilter('rapido')} className={`quick-filter-btn ${quickFilter === 'rapido' ? 'active' : ''}`}>
                        ⚡ Rápido (≤ 5 días)
                    </button>
                </div>

                <p className="results-info">
                    {showSkeletons ? 'Cargando trámites...' : (
                        <>
                            {original && (
                                <div style={{
                                    background: '#e3f2fd',
                                    padding: '0.8rem 1.2rem',
                                    borderRadius: '12px',
                                    marginBottom: '1rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    color: '#0d47a1',
                                    fontSize: '0.9rem',
                                    border: '1px solid #bbdefb'
                                }}>
                                    <Bot size={18} />
                                    <span>Entiendo que buscas trámites sobre: <strong>"{original}"</strong></span>
                                </div>
                            )}
                            <br />
                            Se encontraron <strong style={{ color: 'var(--primary)' }}>{filtered.length}</strong> procedimientos
                            {catFilter && <> en <strong>{catFilter}</strong></>}
                            {query && !original && <> que coinciden con "<strong>{query}</strong>"</>}
                        </>
                    )}
                </p>
            </div>

            {showSkeletons ? (
                <div className="container" style={{ padding: 0 }}>
                    <div className="procedures-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state animate-fade-up">
                    <div className="empty-icon-ring">
                        <FileText size={48} />
                    </div>
                    <h3>No encontramos coincidencias</h3>
                    <p>Intenta con términos más generales o revisa la ortografía. También puedes explorar las categorías principales.</p>

                    <div className="empty-suggestions">
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Búsquedas frecuentes:</span>
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
                            {['Licencia de Funcionamiento', 'Matrimonio', 'Edificación', 'Partida de Nacimiento'].map(s => (
                                <button
                                    key={s}
                                    className="suggestion-tag"
                                    onClick={() => updateSearch(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container" style={{ padding: 0 }}>
                    {grouped.map(([cat, procs]) => (
                        <div key={cat}>
                            <div className="category-heading">
                                <h2>{cat}</h2>
                                <span className="count-badge">{procs.length} trámite{procs.length !== 1 && 's'}</span>
                            </div>
                            <div
                                className="procedures-grid"
                            >
                                {procs.map(p => (
                                    <TramiteCard key={p.codigo} proc={p} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
