import { HelpCircle, BookOpen, Clock, Shovel, ShieldCheck, ArrowRight, Gavel, FileSignature } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Acerca() {
    return (
        <div className="acerca-page animate-fade-in" style={{ padding: '3rem 1.5rem', background: 'var(--bg)' }}>

            {}
            <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(198, 40, 40, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1.5rem' }}>
                    <BookOpen size={16} /> Documento Normativo
                </span>
                <h1 style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: '1.5rem', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.03em' }}>
                    Texto Único de Procedimientos Administrativos (TUPA)
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
                    El instrumento de gestión institucional que consolida, sistematiza y garantiza la predictibilidad de los trámites ante la administración municipal.
                </p>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
                    <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Gavel size={28} color="var(--primary)" />
                            Naturaleza Jurídica
                        </h2>
                        <div style={{ width: '60px', height: '4px', background: 'var(--primary)', borderRadius: '2px', marginBottom: '2rem' }}></div>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.8, color: 'var(--text)' }}>
                            En la administración pública peruana, el TUPA es un <strong>documento de gestión institucional de carácter normativo</strong>. Su función fundamental es consolidar todos los procedimientos y servicios prestados en exclusividad por la Municipalidad.
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)', background: '#F8F9FA', padding: '1.5rem', borderLeft: '4px solid var(--border)', borderRadius: '0 8px 8px 0' }}>
                            Detalla meticulosamente el marco normativo, los requisitos formales, las instancias de resolución, los plazos perentorios de atención y los derechos de tramitación aplicables.
                        </p>
                    </div>

                    <div style={{ padding: '1rem' }}>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '2rem' }}>Estructura del Documento</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(198, 40, 40, 0.1)', color: 'var(--primary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>1</div>
                                <div><strong style={{ display: 'block', color: 'var(--secondary)' }}>Base Legal Referencial</strong>Normativa que sustenta la legalidad de la exigencia ciudadana.</div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(198, 40, 40, 0.1)', color: 'var(--primary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>2</div>
                                <div><strong style={{ display: 'block', color: 'var(--secondary)' }}>Requisitos Taxativos</strong>Condiciones y documentos exactos que el administrado debe presentar.</div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(198, 40, 40, 0.1)', color: 'var(--primary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>3</div>
                                <div><strong style={{ display: 'block', color: 'var(--secondary)' }}>Derecho de Tramitación</strong>Valor económico justificado por los costos reales del procedimiento.</div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(198, 40, 40, 0.1)', color: 'var(--primary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>4</div>
                                <div><strong style={{ display: 'block', color: 'var(--secondary)' }}>Calificación y Plazos</strong>Determinación de silencio administrativo (positivo/negativo) y tiempo límite de respuesta.</div>
                            </li>
                        </ul>
                    </div>
                </div>

                {}
                <h3 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '3rem', textAlign: 'center', fontWeight: 800 }}>
                    Relevancia Jurídica y Práctica
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>

                    {}
                    <div style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: '20px', border: '1px solid var(--border)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'default' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ background: 'rgba(198, 40, 40, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <ShieldCheck size={32} color="var(--primary)" />
                        </div>
                        <h4 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '1rem', fontWeight: 700 }}>Garantía contra la Arbitrariedad</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            El principio de legalidad establece que <strong>ningún funcionario puede exigir requisitos o pagos no especificados expresamente en el TUPA</strong>. Constituye un blindaje jurídico frente a barreras burocráticas ilegales.
                        </p>
                    </div>

                    {}
                    <div style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: '20px', border: '1px solid var(--border)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'default' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ background: 'rgba(245, 124, 0, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Clock size={32} color="#F57C00" />
                        </div>
                        <h4 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '1rem', fontWeight: 700 }}>Predictibilidad y Plazos</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            Establece el horizonte temporal exacto de respuesta. Define el tipo de evaluación (aprobación automática o previa), dándole <strong>seguridad jurídica</strong> al administrado sobre el estado de sus expedientes.
                        </p>
                    </div>

                    {}
                    <div style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: '20px', border: '1px solid var(--border)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'default' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ background: 'rgba(26, 35, 126, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <FileSignature size={32} color="#1A237E" />
                        </div>
                        <h4 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '1rem', fontWeight: 700 }}>Eficiencia en la Gestión</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            Para el ejercicio de actividades económicas o requerimientos civiles, conocer el TUPA optimiza la interacción. <strong>Elimina tiempos ociosos por expedientes observados</strong> al asegurar el cumplimiento inicial.
                        </p>
                    </div>

                </div>

                {}
                <div style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)', borderRadius: '24px', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 20px 40px rgba(13, 38, 68, 0.2)' }}>
                    <h3 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '1rem', fontWeight: 800 }}>Síntesis Operativa</h3>
                    <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)', maxWidth: '800px', marginBottom: '2.5rem', lineHeight: 1.8 }}>
                        El TUPA representa un acuerdo inquebrantable de predictibilidad administrativa y transparencia. Al contar con este Directorio Digital centralizado, la Municipalidad facilita la adecuada formulación de sus solicitudes.
                    </p>
                    <Link to="/buscar" className="btn" style={{ background: 'white', color: 'var(--secondary)', padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 700, borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        Consultar Directorio <ArrowRight size={20} />
                    </Link>
                </div>

            </div>
        </div>
    );
}
