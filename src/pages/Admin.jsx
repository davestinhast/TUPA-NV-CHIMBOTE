import { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '../api';
import {
    Lock, Edit, Plus, Trash2, Search, Save, X,
    CheckCircle, AlertCircle, Building2, User, Camera,
    FileUp, Landmark, LogOut, ChevronRight
} from 'lucide-react';

const AREAS_MUNICIPALES = [
    "ALCALDÍA", "GERENCIA MUNICIPAL", "SECRETARÍA GENERAL", "GERENCIA DE ASESORÍA JURÍDICA",
    "GERENCIA DE PLANEAMIENTO Y PRESUPUESTO", "GERENCIA DE ADMINISTRACIÓN Y FINANZAS",
    "SUBGERENCIA DE RECURSOS HUMANOS", "SUBGERENCIA DE LOGÍSTICA Y PATRIMONIO",
    "SUBGERENCIA DE TESORERÍA", "SUBGERENCIA DE CONTABILIDAD",
    "GERENCIA DE ADMINISTRACIÓN TRIBUTARIA", "SUBGERENCIA DE RECAUDACIÓN Y CONTROL",
    "SUBGERENCIA DE FISCALIZACIÓN TRIBUTARIA", "SUBGERENCIA DE EJECUTORÍA COACTIVA",
    "GERENCIA DE DESARROLLO URBANO", "SUBGERENCIA DE OBRAS PÚBLICAS Y ESTUDIOS",
    "SUBGERENCIA DE DESARROLLO URBANO Y RURAL", "SUBGERENCIA DE TRANSPORTES Y SEGURIDAD VIAL",
    "SUBGERENCIA DE GESTIÓN DE RIESGO DE DESASTRES", "GERENCIA DE DESARROLLO SOCIAL Y HUMANO",
    "SUBGERENCIA DE SALUD Y PROGRAMAS SOCIALES", "SUBGERENCIA DE EDUCACIÓN, CULTURA Y DEPORTE",
    "SUBGERENCIA DE DEMUNA, OMAPED Y CIAM", "REGISTRO CIVIL", "GERENCIA DE SERVICIOS A LA CIUDAD",
    "SUBGERENCIA DE LIMPIEZA PÚBLICA, PARQUES Y JARDÍNES", "SUBGERENCIA DE SEGURIDAD CIUDADANA",
    "GERENCIA DE DESARROLLO ECONÓMICO", "SUBGERENCIA DE COMERCIALIZACIÓN Y LICENCIAS",
    "SUBGERENCIA DE TURISMO Y PROMOCIÓN MYPES", "GERENCIA DE GESTIÓN AMBIENTAL"
];

const OPCIONES_CALIFICACION = [
    "Aprobación Automática", "Evaluación Previa - Silencio Positivo",
    "Evaluación Previa - Silencio Negativo", "Sin Calificación (Informativo)"
];

const CATEGORIAS_OFICIALES = [
    "Licencias de Funcionamiento", "Licencias de Edificación",
    "Espectáculos Públicos", "Anuncios Publicitarios",
    "Servicios Sociales", "Registro Civil",
    "Tributos Municipales", "Uso de Espacios", "Transporte", "General"
];

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [procedures, setProcedures] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                let dataToSet = [];
                const localSaved = localStorage.getItem('tupa_procedures_local');
                if (localSaved) {
                    try {
                        const parsed = JSON.parse(localSaved);
                        dataToSet = Array.isArray(parsed) ? parsed : [];
                    } catch (e) {
                        console.error('Error parsing local storage:', e);
                    }
                }

                if (!dataToSet || dataToSet.length === 0) {
                    const data = await api.getProcedures();
                    dataToSet = Array.isArray(data) ? data : [];
                }
                setProcedures(dataToSet);
            } catch (error) {
                console.error("Error loading procedures:", error);
                setProcedures([]);
            }
            setLoading(false);
        };
        if (isAuthenticated) loadData();
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        const userClean = (username || '').trim().toUpperCase();
        if (userClean === 'ADMIN' && password === 'NuevoChimbote_2026') {
            setIsAuthenticated(true);
        } else {
            alert('Credenciales inválidas para el Panel Superior. Verifique sus datos.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
    };

    const handleSave = (item) => {
        if (!item?.nombre || !item?.unidad_responsable) {
            alert('Faltan campos obligatorios: Nombre y Área.');
            return;
        }

        try {
            const itemToSave = {
                ...item,
                ultima_edicion_por: (username || '').toUpperCase(),
                ultima_edicion_fecha: new Date().toLocaleString(),
                slug: item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w ]+/g, '').replace(/ +/g, '-')
            };

            const safeProcedures = Array.isArray(procedures) ? procedures : [];
            const updated = isAddingNew
                ? [itemToSave, ...safeProcedures]
                : safeProcedures.map(p => (p.codigo === itemToSave.codigo) ? itemToSave : p);

            localStorage.setItem('tupa_procedures_local', JSON.stringify(updated));
            setProcedures(updated);
            setEditingItem(null);
            setIsAddingNew(false);
        } catch (error) {
            console.error('Error salvando:', error);
            alert('Error al guardar. Por favor, revise que los datos no tengan caracteres extraños.');
        }
    };

    const filteredProcedures = useMemo(() => {
        if (!Array.isArray(procedures)) return [];
        const low = (searchTerm || '').toLowerCase();
        return procedures.filter(p => {
            const pName = (p.nombre || '').toLowerCase();
            const pCode = (p.codigo || '').toLowerCase();
            return pName.includes(low) || pCode.includes(low);
        });
    }, [procedures, searchTerm]);

    const getSafeRequisitos = (reqs) => {
        if (Array.isArray(reqs)) return reqs.join('\n');
        if (typeof reqs === 'string') return reqs;
        return '';
    };

    const handleRequisitosChange = (e) => {
        const val = e.target.value || '';
        setEditingItem({ ...editingItem, requisitos: val.split('\n') });
    };

    if (!isAuthenticated) {
        return (
            <div className="login-overlay">
                <div className="login-glass-card animate-fade-up">
                    <div className="login-brand-icon"><Landmark size={32} /></div>
                    <h1>Panelsito</h1>
                    <div style={{ marginTop: '-0.5rem', marginBottom: '1rem', opacity: 0.7, fontWeight: 700 }}>XD</div>
                    <form onSubmit={handleLogin}>
                        <div className="admin-input-group">
                            <label>USER</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="ADMIN" required />
                        </div>
                        <div className="admin-input-group">
                            <label>CONTRA</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                        </div>
                        <button type="submit" className="admin-btn-login">
                            <span>ENTRAR AL SISTEMA</span>
                            <ChevronRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page-wrapper">
            <header className="admin-masthead">
                <div className="admin-masthead-info">
                    <div className="admin-logo"><Landmark size={24} color="var(--admin-primary)" /> TUPA CONTROL</div>
                    <div className="admin-v-line"></div>
                    <div className="admin-badge">SESIÓN: {(username || '').toUpperCase()}</div>
                </div>
                <button className="pro-btn-logout" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-muted)' }} onClick={handleLogout}>
                    <LogOut size={20} />
                </button>
            </header>

            <main className="admin-container">
                <div className="admin-action-row">
                    <div className="admin-search-box">
                        <Search size={20} />
                        <input type="text" placeholder="Buscar trámite por código o nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <button className="btn-admin-new" onClick={() => {
                        setIsAddingNew(true);
                        setEditingItem({
                            codigo: `PA${Math.floor(Math.random() * 9000) + 1000}`, nombre: '', categoria: 'General',
                            unidad_responsable: '', descripcion: '', costo: 'Gratuito', plazo: '30 días hábiles',
                            requisitos: [], calificacion: OPCIONES_CALIFICACION[0], pdf_pagina: ''
                        });
                    }}>
                        <Plus size={20} /> NUEVO TRÁMITE
                    </button>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>CÓDIGO</th>
                                <th>DENOMINACIÓN / ÁREA</th>
                                <th>VERIFICACIÓN</th>
                                <th>CAMBIOS</th>
                                <th style={{ textAlign: 'center' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ color: 'var(--admin-muted)', fontWeight: 600 }}>Cargando catálogo oficial de trámites...</div>
                                    </td>
                                </tr>
                            ) : filteredProcedures.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ color: 'var(--admin-muted)', fontWeight: 600 }}>No se encontraron trámites en el sistema.</div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProcedures.slice(0, 50).map((p, idx) => (
                                    <tr key={`proc-${p.codigo}-${idx}`}>
                                        <td className="proc-id">{p.codigo || 'S/C'}</td>
                                        <td>
                                            <div className="proc-name">{p.nombre || 'Trámite sin nombre'}</div>
                                            <div className="proc-meta"><Building2 size={12} /> {p.unidad_responsable || 'SIN ÁREA'}</div>
                                        </td>
                                        <td>
                                            {p.pdf_referencia_imagen ?
                                                <span className="status-check ok"><CheckCircle size={14} /> VERIFICADO</span> :
                                                <span className="status-check warn"><AlertCircle size={14} /> PENDIENTE</span>
                                            }
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.ultima_edicion_por || 'SISTEMA'}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--admin-muted)' }}>{p.ultima_edicion_fecha || '-'}</div>
                                        </td>
                                        <td className="table-actions" style={{ justifyContent: 'center' }}>
                                            <button className="table-btn" title="Editar Trámite" onClick={() => setEditingItem(p)}><Edit size={16} /></button>
                                            <button className="table-btn" title="Eliminar Trámite" onClick={() => {
                                                if (window.confirm(`¿Eliminar permanentemente el registro ${p.codigo}?`)) {
                                                    const upd = procedures.filter(x => x.codigo !== p.codigo);
                                                    saveToLocalStorage(upd);
                                                }
                                            }}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {editingItem && (
                <div className="admin-modal-backdrop">
                    <div className="admin-modal-card animate-fade-up">
                        <div className="admin-modal-header">
                            <h2>{isAddingNew ? 'REGISTRAR TRÁMITE' : 'EDITAR TRÁMITE'} • {editingItem.codigo}</h2>
                            <button className="table-btn" onClick={() => { setEditingItem(null); setIsAddingNew(false); }}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="modal-split">
                                <div className="form-layout">
                                    <div>
                                        <label className="field-label">Nombre Oficial del Procedimiento</label>
                                        <input className="field-input" value={editingItem.nombre || ''} onChange={e => setEditingItem({ ...editingItem, nombre: e.target.value })} />
                                    </div>
                                    <div className="form-group-2">
                                        <div>
                                            <label className="field-label">Área Municipal</label>
                                            <select className="field-select" value={editingItem.unidad_responsable || ''} onChange={e => setEditingItem({ ...editingItem, unidad_responsable: e.target.value })}>
                                                <option value="">Seleccionar área...</option>
                                                {AREAS_MUNICIPALES.map(a => <option key={a} value={a}>{a}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="field-label">Categoría Web</label>
                                            <select className="field-select" value={editingItem.categoria || CATEGORIAS_OFICIALES[0]} onChange={e => setEditingItem({ ...editingItem, categoria: e.target.value })}>
                                                {CATEGORIAS_OFICIALES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="field-label">Requisitos (Escribir uno por línea)</label>
                                        <textarea className="field-area large" value={getSafeRequisitos(editingItem.requisitos)} onChange={handleRequisitosChange} placeholder="1. Formulario de solicitud...\n2. Copia de DNI..." />
                                    </div>
                                    <div className="form-group-2">
                                        <div>
                                            <label className="field-label">Costo Oficial (S/)</label>
                                            <input className="field-input" value={editingItem.costo || ''} onChange={e => setEditingItem({ ...editingItem, costo: e.target.value })} placeholder="Gratuito o S/ 10.00" />
                                        </div>
                                        <div>
                                            <label className="field-label">Calificación</label>
                                            <select className="field-select" value={editingItem.calificacion || OPCIONES_CALIFICACION[0]} onChange={e => setEditingItem({ ...editingItem, calificacion: e.target.value })}>
                                                {OPCIONES_CALIFICACION.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="evidence-side">
                                    <label className="field-label">Evidencia Física TUPA</label>
                                    <div className="evidence-viewport">
                                        {editingItem.pdf_referencia_imagen ?
                                            <img src={editingItem.pdf_referencia_imagen} alt="Hoja TUPA Escaneada" /> :
                                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                                <Camera size={40} style={{ margin: '0 auto 10px' }} />
                                                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sin captura asignada</div>
                                            </div>
                                        }
                                    </div>
                                    <button className="btn-admin-new" style={{ width: '100%', justifyContent: 'center' }} onClick={() => fileInputRef.current.click()}>
                                        <FileUp size={18} /> SUBIR IMAGEN DE HOJA
                                    </button>
                                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setEditingItem({ ...editingItem, pdf_referencia_imagen: reader.result });
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                    <div>
                                        <label className="field-label">Página Original del PDF</label>
                                        <input className="field-input" type="number" min="1" value={editingItem.pdf_pagina || ''} onChange={e => setEditingItem({ ...editingItem, pdf_pagina: e.target.value })} placeholder="Ej: 52" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn-secondary" onClick={() => { setEditingItem(null); setIsAddingNew(false); }}>DESCARTAR CAMBIOS</button>
                            <button className="btn-save-master" onClick={() => handleSave(editingItem)}>
                                <Save size={18} /> GUARDAR EN SISTEMA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
