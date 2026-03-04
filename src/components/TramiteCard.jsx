import { Link } from 'react-router-dom';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';

const categoryImages = {
    'Registro Civil': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&q=80',
    'Tributación': 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500&q=80',
    'Licencias de Edificación': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500&q=80',
    'Habilitación Urbana': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80',
    'Licencias de Funcionamiento': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80',
    'Transporte y Vehículos': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80',
    'Espectáculos Públicos': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80',
    'Infraestructura y Servicios Públicos': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&q=80',
    'Medio Ambiente': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500&q=80',
    'General': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&q=80'
};

export default function TramiteCard({ proc }) {
    const bgImage = categoryImages[proc.categoria] || categoryImages['General'];

    return (
        <Link to={`/tramite/${proc.slug}`} style={{ textDecoration: 'none' }}>
            <div className="proc-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                    height: '140px',
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderBottom: '4px solid var(--primary)'
                }} />

                <div style={{ padding: '1.5rem' }}>
                    <div className="proc-card-header">
                        <span className="proc-card-code">TUPA {proc.codigo}</span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, lineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {proc.nombre}
                    </h3>

                    <div className="proc-card-meta">
                        <span className="proc-meta-chip">
                            <DollarSign size={16} />
                            {proc.costo}
                        </span>
                        <span className="proc-meta-chip">
                            <Clock size={16} />
                            {proc.plazo}
                        </span>
                    </div>

                    <div className="proc-card-action">
                        Ver trámite <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
