import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { Search, Filter, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
import TramiteCard from '../components/TramiteCard';
import SkeletonCard from '../components/SkeletonCard';

import { api } from '../api';

export default function Buscar() {
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const query = searchParams.get('q') || '';
    const original = searchParams.get('original') || '';
    const catFilter = searchParams.get('categoria') || '';
    const quickFilter = searchParams.get('f') || '';
    const sortOrder = searchParams.get('sort') || 'name';

    useEffect(() => {
        api.getProcedures().then(data => {
            setProcedures(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [query, catFilter, quickFilter, sortOrder]);

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
            result = result.filter(p => p.costo && p.costo.toLowerCase().includes('gratuito'));
        } else if (quickFilter === 'virtual') {
            result = result.filter(p => p.canales && (p.canales.virtual || p.canales.correo));
        } else if (quickFilter === 'rapido') {
            result = result.filter(p => {
                if (!p.plazo) return false;
                const matches = p.plazo.match(/(\d+)/);
                return matches && parseInt(matches[1]) <= 5;
            });
        }

        return [...result].sort((a, b) => {
            if (sortOrder === 'name') return a.nombre.localeCompare(b.nombre);
            if (sortOrder === 'cost') {
                const costA = a.costo && a.costo.toLowerCase().includes('gratuito') ? 0 : 1;
                const costB = b.costo && b.costo.toLowerCase().includes('gratuito') ? 0 : 1;
                return costB - costA;
            }
            return 0;
        });
    }, [procedures, query, catFilter, quickFilter, sortOrder]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage]);

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

    const updateSort = (sort) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', sort);
        setSearchParams(params);
    };

    const updateQuickFilter = (f) => {
        setIsFiltering(true);
        const params = new URLSearchParams(searchParams);
        if (quickFilter === f) params.delete('f');
        else params.set('f', f);
        setSearchParams(params);
        setTimeout(() => setIsFiltering(false), 300);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="pagination-container animate-fade-up">
                <button
                    className="pagination-nav"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={18} />
                    <span>Anterior</span>
                </button>

                {startPage > 1 && (
                    <>
                        <button className="pagination-btn" onClick={() => handlePageChange(1)}>1</button>
                        {startPage > 2 && <span style={{ padding: '0 0.5rem', color: 'var(--text-muted)' }}>...</span>}
                    </>
                )}

                {pages.map(p => (
                    <button
                        key={p}
                        className={`pagination-btn ${currentPage === p ? 'active' : ''}`}
                        onClick={() => handlePageChange(p)}
                    >
                        {p}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span style={{ padding: '0 0.5rem', color: 'var(--text-muted)' }}>...</span>}
                        <button className="pagination-btn" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                    </>
                )}

                <button
                    className="pagination-nav"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span>Siguiente</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        );
    };

    const showSkeletons = loading || isFiltering;

    return (
        <AnimatedPage>
            <div className="search-page">
                <div className="search-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--secondary)', letterSpacing: '-0.03em', margin: 0 }}>
                            Directorio de Trámites
                        </h1>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <select
                                className="filter-select"
                                style={{ minWidth: '180px' }}
                                value={sortOrder}
                                onChange={(e) => updateSort(e.target.value)}
                            >
                                <option value="name">Ordenar por nombre</option>
                                <option value="cost">Primero gratuitos</option>
                            </select>
                        </div>
                    </div>

                    <div className="search-bar-container" style={{ background: 'white', borderRadius: '12px', padding: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                        <div className="search-input-wrapper">
                            <Search className="icon" size={20} strokeWidth={2.5} />
                            <input
                                type="text"
                                placeholder="¿Qué trámite buscas? (Ej: Licencia, Matrimonio, Arbitrios...)"
                                value={query}
                                onChange={(e) => updateSearch(e.target.value)}
                            />
                        </div>
                        <div className="search-divider" style={{ width: 1, height: 30, background: 'var(--border)', margin: '0 1rem' }} />
                        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                            <Filter className="icon" size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            <select
                                className="filter-select"
                                value={catFilter}
                                onChange={(e) => updateCategory(e.target.value)}
                                style={{ paddingLeft: '2.8rem', width: '100%', border: 'none', background: 'transparent' }}
                            >
                                <option value="">Todas las áreas temáticas</option>
                                {categories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="quick-filters" style={{ marginTop: '1.5rem' }}>
                        <button onClick={() => updateQuickFilter('gratis')} className={`quick-filter-btn ${quickFilter === 'gratis' ? 'active' : ''}`}>
                            💸 Trámites Gratuitos
                        </button>
                        <button onClick={() => updateQuickFilter('virtual')} className={`quick-filter-btn ${quickFilter === 'virtual' ? 'active' : ''}`}>
                            💻 Canal Digital
                        </button>
                        <button onClick={() => updateQuickFilter('rapido')} className={`quick-filter-btn ${quickFilter === 'rapido' ? 'active' : ''}`}>
                            ⚡ Trámite Rápido (≤ 5 días)
                        </button>
                        {(query || catFilter || quickFilter) && (
                            <button
                                onClick={() => setSearchParams({})}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', padding: '0.5rem 1rem' }}
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>

                    <div className="results-info">
                        {showSkeletons ? 'Buscando trámites...' : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {original && (
                                    <div style={{
                                        background: 'var(--secondary-light)',
                                        padding: '1rem 1.5rem',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        color: 'var(--secondary-dark)',
                                        fontSize: '0.95rem',
                                        borderLeft: '4px solid var(--secondary)'
                                    }}>
                                        <Bot size={22} />
                                        <span>Anita sugiere: Estás buscando sobre <strong>"{original}"</strong></span>
                                    </div>
                                )}
                                <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>
                                    Mostrando <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{paginatedItems.length}</strong> de <strong style={{ color: 'var(--text)', fontSize: '1.1rem' }}>{filtered.length}</strong> procedimientos.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {showSkeletons ? (
                    <div className="container" style={{ padding: 0 }}>
                        <div className="procedures-grid">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => <SkeletonCard key={i} />)}
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state animate-fade-up">
                        <div className="empty-icon-ring" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                            <Search size={48} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>No hay resultados exactos</h3>
                        <p style={{ maxWidth: '400px', margin: '1rem auto' }}>Intenta buscando palabras clave como "DNI", "Matrimonio" o "Predial".</p>

                        <div className="empty-suggestions" style={{ background: 'var(--bg-offset)', padding: '2rem', borderRadius: '16px', marginTop: '2rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Trámites más consultados:</span>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {['Licencia de Funcionamiento', 'Matrimonio Civil', 'Edificación', 'Partida de Nacimiento', 'Constancia de Posesión'].map(s => (
                                    <button
                                        key={s}
                                        className="suggestion-tag"
                                        onClick={() => updateSearch(s)}
                                        style={{ background: 'white', padding: '0.8rem 1.2rem', border: '1px solid var(--border)', fontWeight: 600 }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="container" style={{ padding: 0 }}>
                        <motion.div
                            className="procedures-grid"
                            initial="hidden"
                            animate="show"
                            variants={{
                                show: {
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                }
                            }}
                        >
                            {paginatedItems.map(p => (
                                <motion.div
                                    key={p.codigo}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        show: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <TramiteCard proc={p} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {renderPagination()}
                    </div>
                )}
            </div>
        </AnimatedPage>
    );
}
