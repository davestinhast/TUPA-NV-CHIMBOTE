import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, FileText, CheckCircle, Clock, MapPin, AlertCircle, Scale, Building2, Home, Printer, Mail, Phone, Share2, Copy, Check, DollarSign, ClipboardList, Tag, ThumbsUp, ThumbsDown, Languages } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../api';

const categoryImages = {
    'Licencias de Edificación': 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200&h=400',
    'Habilitación Urbana': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200&h=400',
    'Tributación': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200&h=400',
    'Licencias de Funcionamiento': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200&h=400',
    'Registro Civil': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1200&h=400',
    'Inspección Técnica de Seguridad (ITSE)': 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&q=80&w=1200&h=400',
    'Medio Ambiente': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1200&h=400',
    'General': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=400'
};

export default function DetalleTramite() {
    const { slug } = useParams();
    const [proc, setProc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [feedbackValue, setFeedbackValue] = useState(null);
    const [lang, setLang] = useState('es');

    const t = (text) => {
        if (lang === 'es') return text;
        const dict = {
            'Derecho de Trámite': 'Qullqi Mañay',
            'Plazo de Atención': 'Pacha Suyay',
            'Calificación': 'Ruray Allin',
            'Unidad Responsable': 'Umalliq Wasi',
            'Requisitos': 'Mañakuykuna',
            'Notas Importantes': 'Yuyarinapaq',
            'Base Legal': 'Kamachiy',
            'Canales de Atención': 'Rikurikuna',
            'Documento Oficial del TUPA': 'TUPA Qillqa',
            'Generar Ficha': 'Qillqa Paqarichiy',
            'Derecho de Trámite (Derecho de Trámite)': 'Qullqi Mañay (Derecho de Trámite)',
            'Plazo de Atención (Plazo de Atención)': 'Pacha Suyay (Plazo de Atención)',
            'Calificación (Calificación)': 'Ruray Allin (Calificación)',
            'Unidad Responsable (Unidad Responsable)': 'Umalliq Wasi (Unidad Responsable)'
        };
        return dict[text] ? `${dict[text]} (${text})` : text;
    };

    const tText = (text) => {
        if (!text || lang === 'es') return text;
        const dict = [
            ['procedimiento administrativo', 'kamachiy ruray'],
            ['procedimiento', 'ruray'],
            ['mediante el cual', 'chaywan'],
            ['persona natural o jurídica', 'runa icha empresa'],
            ['persona natural', 'sapay runa'],
            ['persona jurídica', 'empresa kamachisqa'],
            ['pública o privada', 'llaqtap icha privadop'],
            ['los contrayentes solicitan', 'casarakuqkuna mañakunku'],
            ['contrayentes', 'casarakuqkuna'],
            ['solicitan', 'mañakunku'],
            ['solicita', 'mañakun'],
            ['solicitar', 'mañakuy'],
            ['otorgamiento', 'qunanapaq'],
            ['otorga', 'qun'],
            ['contraer matrimonio', 'casarakuy'],
            ['matrimonio civil', 'llaqta casarakuy'],
            ['ante la municipalidad', 'llaqta kamayuqpa ñawpaqinpi'],
            ['la municipalidad', 'llaqta kamayuq'],
            ['municipalidad distrital', 'suyupi llaqta kamayuq'],
            ['municipalidad', 'llaqta kamayuq'],
            ['al amparo de', 'amparaypi'],
            ['lo establecido en', 'kamasqa ukunpi'],
            ['establecido', 'kamasqa'],
            ['código civil', 'civil kamachiy'],
            ['la celebración del matrimonio', 'casarakuy raymi'],
            ['se dará en fecha y hora', 'pachapi qusqa kanqa'],
            ['previamente programada', 'wakichisqa'],
            ['certificado médico', 'hampi kamayuq qillqa'],
            ['certificado', 'qillqa allinchay'],
            ['divorciados', 't\'aqasqakuna'],
            ['viudos', 'sapallan kedasqakuna'],
            ['de conformidad al artículo', 'ñiqiman hina'],
            ['artículo', 'ñiqin'],
            ['documento de identidad', 'suti qillqa (DNI)'],
            ['documento nacional de identidad', 'llaqtap suti qillqan (DNI)'],
            ['documento', 'qillqa'],
            ['pago por derecho', 'qullqi qunanapaq'],
            ['pago', 'qullqi'],
            ['gratuito', 'mana qullqiyuq'],
            ['licencia de funcionamiento', 'llank\'anapaq saqillay'],
            ['licencia de edificación', 'wasichay saqillay'],
            ['licencia', 'saqillay'],
            ['construcción', 'wasichay'],
            ['edificación', 'wasichay'],
            ['impuesto predial', 'wasi qullqi mañay'],
            ['impuesto', 'kamachiy qullqi'],
            ['resolución', 'kamasqa qillqa'],
            ['solicitud', 'mañakuy raphi'],
            ['presentar', 'churay'],
            ['presentación', 'churay kama'],
            ['requisitos', 'mañakuykuna'],
            ['requisito', 'mañakuy'],
            ['copia simple', 'kikinchay'],
            ['copia', 'kikinchay'],
            ['original', 'qallariy qillqa'],
            ['firma', 'suti qillqay'],
            ['autorización', 'saqillay'],
            ['autoriza', 'saqin'],
            ['inspección', 'qhawakuy'],
            ['derecho de trámite', 'qullqi mañay'],
            ['trámite', 'ruray'],
            ['declaración jurada', 'sut\'inchay qillqa'],
            ['declaración', 'sut\'inchay'],
            ['declarar', 'sut\'inchay'],
            ['formato', 'raphi'],
            ['legalizada', 'kamachisqa'],
            ['notarial', 'notariyuq'],
            ['vigencia', 'kawsay pacha'],
            ['vigente', 'kawsaypi'],
            ['plazo', 'pacha tupuy'],
            ['meses', 'killakuna'],
            ['días hábiles', 'p\'unchaw ruray'],
            ['días calendario', 'p\'unchaw tupuy'],
            ['días', 'p\'unchaw'],
            ['verificación', 'qhawakuy'],
            ['verificar', 'qhawakuy'],
            ['cumplimiento', 'hunt\'ay'],
            ['cumplir', 'hunt\'ay'],
            ['aprobación', 'aylluniy'],
            ['aprobado', 'ayllusqa'],
            ['calificación', 'allinchay'],
            ['unidad responsable', 'umalliq wasi'],
            ['base legal', 'kamachiy siqi'],
            ['canales de atención', 'yanapay ñan'],
            ['ventanilla', 'rikurikuy punkuy'],
            ['en línea', 'intirnitpi'],
            ['presencial', 'paypi'],
            ['registro', 'qillqaykuy'],
            ['inscripción', 'suti qillqaykuy'],
            ['certificación', 'allinchay qillqa'],
            ['nacimiento', 'paqarikuy'],
            ['defunción', 'wañuy'],
            ['habilitación urbana', 'llaqtachay'],
            ['tributación', 'qullqi kamachiy'],
            ['fiscalización', 'qhawakuy'],
            ['sanción', 'multa kastigay'],
            ['multa', 'kastigay qullqi'],
            ['recurso administrativo', 'kamachiy mañakuy'],
            ['separación convencional', 'munasqanku t\'aqakuy'],
            ['divorcio', 't\'aqakuy'],
            ['publicidad exterior', 'pampapi qhawarichiy'],
            ['espectáculo', 'qhawarichinapaq'],
            ['seguridad ciudadana', 'runakuna suaqsay'],
            ['medio ambiente', 'pacha mama'],
            ['catastro', 'allpa qillqa'],
            ['urbanismo', 'llaqtachay'],
        ];

        let translated = text;
        dict.forEach(([es, qu]) => {
            const regex = new RegExp(es, 'gi');
            translated = translated.replace(regex, qu);
        });

        return translated;
    };


    useEffect(() => {
        api.getProcedureBySlug(slug).then(found => {
            setProc(found);
            setLoading(false);
        });
    }, [slug]);


    useEffect(() => { setImgError(false); }, [slug]);

    const currentUrl = window.location.href;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="detail-page">
            <div className="detail-container">
                <div className="skeleton-pulse" style={{ height: '40px', width: '70%', borderRadius: '8px', marginBottom: '1rem' }}></div>
                <div className="skeleton-pulse" style={{ height: '24px', width: '40%', borderRadius: '4px', marginBottom: '3rem' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-pulse" style={{ height: '100px', borderRadius: '12px' }}></div>)}
                </div>

                <div className="skeleton-pulse" style={{ height: '200px', width: '100%', borderRadius: '12px' }}></div>
            </div>
        </div>
    );

    if (!proc) return (
        <div className="detail-page">
            <div className="empty-state">
                <AlertCircle size={64} style={{ color: 'var(--border)' }} />
                <h3>Trámite no encontrado</h3>
                <p>El procedimiento que buscas no existe o ha sido retirado. <Link to="/buscar" style={{ color: 'var(--primary)', fontWeight: 700 }}>Volver al directorio</Link></p>
            </div>
        </div>
    );

    const bgImage = proc ? (categoryImages[proc.categoria] || categoryImages['General']) : '';

    const whatsappText = encodeURIComponent(`Revisa este trámite de la Municipalidad de Nuevo Chimbote: ${proc?.nombre}\n\n${currentUrl}`);

    return (
        <div className="detail-page animate-fade-in">
            <div className="detail-container">
                { }
                <div className="breadcrumb">
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Home size={14} /> Inicio</Link>
                    <ChevronRight size={14} />
                    <Link to={`/buscar?categoria=${encodeURIComponent(proc.categoria)}`}>{proc.categoria}</Link>
                    <ChevronRight size={14} />
                    <span style={{ color: 'var(--text)' }}>{proc.nombre.substring(0, 60)}...</span>
                </div>

                { }
                <div style={{
                    width: '100%',
                    height: '240px',
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                    marginBottom: '-3rem',
                    position: 'relative',
                    zIndex: 0
                }}></div>

                { }
                <div className="detail-header" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <span className="detail-code">TUPA {proc.codigo}</span>
                        <button
                            onClick={() => setLang(lang === 'es' ? 'qu' : 'es')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: lang === 'es' ? 'var(--primary)' : '#4CAF50',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: 'white',
                                fontWeight: 700,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            <Languages size={16} color="white" />
                            {lang === 'es' ? 'Traducir al Quechua (BETA)' : 'Volver a Español'}
                        </button>
                    </div>
                    <h1>{tText(proc.nombre)}</h1>
                    <span className="detail-category-badge">
                        <Tag size={16} strokeWidth={2.5} /> {tText(proc.categoria)}
                    </span>
                    {proc.descripcion && (
                        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                            {tText(proc.descripcion)}
                        </p>
                    )}
                </div>

                <div className="detail-quick-info">
                    <div className="quick-info-card cost">
                        <div className="quick-info-icon-wrapper"><DollarSign size={24} strokeWidth={2.5} /></div>
                        <div>
                            <div className="quick-info-label">{t('Derecho de Trámite')}</div>
                            <div className="quick-info-value">{proc.costo}</div>
                        </div>
                    </div>
                    <div className="quick-info-card time">
                        <div className="quick-info-icon-wrapper"><Clock size={24} strokeWidth={2.5} /></div>
                        <div>
                            <div className="quick-info-label">{t('Plazo de Atención')}</div>
                            <div className="quick-info-value">{proc.plazo}</div>
                        </div>
                    </div>
                    <div className="quick-info-card type">
                        <div className="quick-info-icon-wrapper"><CheckCircle size={24} strokeWidth={2.5} /></div>
                        <div>
                            <div className="quick-info-label">{t('Calificación')}</div>
                            <div className="quick-info-value">{proc.calificacion}</div>
                        </div>
                    </div>
                    <div className="quick-info-card office">
                        <div className="quick-info-icon-wrapper"><Building2 size={24} strokeWidth={2.5} /></div>
                        <div>
                            <div className="quick-info-label">{t('Unidad Responsable')}</div>
                            <div className="quick-info-value" style={{ fontSize: '0.9rem' }}>{proc.unidad_responsable}</div>
                        </div>
                    </div>
                </div>

                { }
                {proc.requisitos && proc.requisitos.length > 0 && (
                    <div className="detail-section">
                        <h2><ClipboardList size={22} strokeWidth={2.5} /> {t('Requisitos')}</h2>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
                            {proc.requisitos.map((req, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', marginBottom: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--primary)' }}>
                                    <CheckCircle size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                                    <span style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.6 }}>{tText(req)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                { }
                {proc.notas && proc.notas.length > 0 && (
                    <div className="detail-section">
                        <h2 style={{ borderBottomColor: '#FFE0B2' }}><AlertCircle size={22} strokeWidth={2.5} color="#F57C00" /> <span style={{ color: '#E65100' }}>{t('Notas Importantes')}</span></h2>
                        <ul className="notas-list">
                            {proc.notas.map((nota, i) => (
                                <li key={i}>{tText(nota)}</li>
                            ))}
                        </ul>
                    </div>
                )}

                { }
                {proc.base_legal && proc.base_legal.length > 0 && (
                    <div className="detail-section">
                        <h2><Scale size={22} strokeWidth={2.5} /> {t('Base Legal')}</h2>
                        <div className="base-legal-list">
                            {proc.base_legal.map((law, i) => (
                                <span key={i} className="base-legal-tag">{law}</span>
                            ))}
                        </div>
                    </div>
                )}

                { }
                {proc.canales && (
                    <div className="detail-section">
                        <h2><MapPin size={22} strokeWidth={2.5} /> {t('Canales de Atención')}</h2>
                        <div className="canal-item">
                            <Building2 size={20} />
                            <div>
                                <strong style={{ display: 'block', color: 'var(--secondary)' }}>Atención Presencial</strong>
                                <span style={{ color: 'var(--text-secondary)' }}>{proc.canales.presencial}</span>
                            </div>
                        </div>
                        <div className="canal-item">
                            <Mail size={20} />
                            <div>
                                <strong style={{ display: 'block', color: 'var(--secondary)' }}>Atención Virtual</strong>
                                <a href={proc.canales.virtual.split(' ')[0]} target="_blank" rel="noopener" style={{ color: 'var(--primary)', fontWeight: 600 }}>{proc.canales.virtual}</a>
                            </div>
                        </div>
                        <div className="canal-item">
                            <Phone size={20} />
                            <div>
                                <strong style={{ display: 'block', color: 'var(--secondary)' }}>Atención Telefónica</strong>
                                <span style={{ color: 'var(--text-secondary)' }}>{proc.canales.telefonico}</span>
                            </div>
                        </div>
                        {proc.horario && (
                            <div className="canal-item">
                                <Clock size={20} />
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--secondary)' }}>Horario</strong>
                                    <span style={{ color: 'var(--text-secondary)' }}>{proc.horario}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                { }
                {proc.pdf_pagina && (
                    <div className="detail-section">
                        <h2><FileText size={22} strokeWidth={2.5} /> {t('Documento Oficial del TUPA')}</h2>
                        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid var(--border)' }}>
                            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                                Verifique la información directamente desde la <strong>página {proc.pdf_pagina}</strong> del documento oficial aprobado.
                            </p>

                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                                {proc.pdf_referencia_imagen && !imgError ? (
                                    <a
                                        href={`${import.meta.env.BASE_URL}${proc.pdf_referencia_imagen.replace(/^\//, '')}`}
                                        title="Haz clic para ampliar la captura"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ flex: '1 1 300px', maxWidth: '400px', display: 'block', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', cursor: 'zoom-in', background: '#f5f5f5' }}
                                    >
                                        <img
                                            src={`${import.meta.env.BASE_URL}${proc.pdf_referencia_imagen.replace(/^\//, '')}`}
                                            alt={`Página ${proc.pdf_pagina} del TUPA`}
                                            style={{ width: '100%', display: 'block' }}
                                            onError={() => setImgError(true)}
                                        />
                                    </a>
                                ) : (
                                    <div style={{
                                        flex: '1 1 300px', maxWidth: '400px',
                                        background: '#f8f9fa', borderRadius: '8px',
                                        border: '1px solid #e0e4e8', padding: '2rem',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        justifyContent: 'center', gap: '0.8rem', color: '#888',
                                        minHeight: '200px'
                                    }}>
                                        <FileText size={40} style={{ opacity: 0.3 }} />
                                        <span style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                                            Vista previa no disponible.<br />Usa el botón para ver el PDF oficial.
                                        </span>
                                    </div>
                                )}
                                { }
                                <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'flex-start' }}>
                                    <a
                                        href={`https://www.muninuevochimbote.gob.pe/DOCPORTAL/TUPA-2025-MDNCH.pdf#page=${proc.pdf_pagina}`}
                                        target="_blank"
                                        rel="noopener"
                                        className="btn btn-primary"
                                        style={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                        <FileText size={18} strokeWidth={2.5} /> Ver PDF Original (Pág. {proc.pdf_pagina})
                                    </a>
                                    {proc.pdf_referencia_imagen && (
                                        <a
                                            href={proc.pdf_referencia_imagen}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                            style={{ display: 'flex', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
                                        >
                                            Ver Solo Imagen
                                        </a>
                                    )}

                                    <div style={{ margin: '1rem 0', height: '1px', background: 'var(--border)' }}></div>

                                    <a
                                        href={`https://wa.me/?text=${whatsappText}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                        style={{ display: 'flex', justifyContent: 'center', background: '#25D366', color: 'white', border: 'none' }}
                                    >
                                        <Share2 size={18} strokeWidth={2.5} /> Compartir por WhatsApp
                                    </a>

                                    <button
                                        onClick={handleCopyLink}
                                        className="btn btn-secondary"
                                        style={{ display: 'flex', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', cursor: 'pointer' }}
                                    >
                                        {copied ? <Check size={18} color="green" /> : <Copy size={18} />}
                                        {copied ? '¡Enlace copiado!' : 'Copiar Enlace'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                { }
                <div className="detail-section">
                    <h2><Printer size={22} strokeWidth={2.5} /> {t('Generar Ficha')}</h2>
                    <div className="detail-actions">
                        <button className="btn btn-primary" onClick={() => window.print()}>
                            <FileText size={18} strokeWidth={2.5} /> Imprimir / PDF
                        </button>
                        <a
                            href="https://www.muninuevochimbote.gob.pe/DOCPORTAL/TUPA-2025-MDNCH.pdf"
                            target="_blank"
                            rel="noopener"
                            className="btn btn-outline"
                        >
                            <FileText size={18} strokeWidth={2.5} /> Descargar PDF Completo
                        </a>
                    </div>

                    <div className="qr-section">
                        <div style={{ background: 'white', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }}>
                            <QRCodeSVG value={currentUrl} size={90} level="M" />
                        </div>
                        <div>
                            <strong style={{ display: 'block', marginBottom: 4, color: 'var(--secondary)', fontSize: '1.05rem' }}>Ficha Digital Inteligente</strong>
                            <p>Escanea este código QR con la cámara de tu celular para llevar esta información contigo y facilitar tu trámite presencial.</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4rem 0 2rem 0', pading: '2rem', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1.5rem', marginTop: '1.5rem' }}>¿Te fue útil esta información?</h3>
                    {feedbackValue === null ? (
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <button onClick={() => setFeedbackValue('yes')} style={{ padding: '0.8rem 2rem', borderRadius: '30px', border: '1px solid var(--primary)', background: 'white', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <ThumbsUp size={18} /> Sí, me sirvió
                            </button>
                            <button onClick={() => setFeedbackValue('no')} style={{ padding: '0.8rem 2rem', borderRadius: '30px', border: '1px solid var(--text-muted)', background: 'white', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <ThumbsDown size={18} /> No del todo
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '2rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={20} /> ¡Gracias por tu retroalimentación!
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
