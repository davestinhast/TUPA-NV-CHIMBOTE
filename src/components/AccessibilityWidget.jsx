import { useState, useEffect } from 'react';
import { Settings, Type, Eye, EyeOff, RotateCcw } from 'lucide-react';

export default function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);

    
    const [fontSize, setFontSize] = useState(() => parseFloat(localStorage.getItem('tupa-a11y-font')) || 1);
    const [highContrast, setHighContrast] = useState(() => localStorage.getItem('tupa-a11y-contrast') === 'true');

    useEffect(() => {
        const root = document.documentElement;

        
        root.style.setProperty('--font-scale', fontSize);
        localStorage.setItem('tupa-a11y-font', fontSize);

        
        if (highContrast) {
            root.setAttribute('data-a11y-contrast', 'true');
        } else {
            root.removeAttribute('data-a11y-contrast');
        }
        localStorage.setItem('tupa-a11y-contrast', highContrast);

    }, [fontSize, highContrast]);

    const increaseFont = () => setFontSize(prev => Math.min(prev + 0.1, 1.3));
    const decreaseFont = () => setFontSize(prev => Math.max(prev - 0.1, 0.9));
    const resetA11y = () => {
        setFontSize(1);
        setHighContrast(false);
    };

    return (
        <div className={`a11y-widget ${isOpen ? 'open' : ''}`}>

            <button
                className="a11y-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Opciones de Accesibilidad"
                title="Accesibilidad"
            >
                <div style={{ background: '#0288D1', color: 'white', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', border: '2px solid white' }}>
                    ♿
                </div>
            </button>

            {isOpen && (
                <div className="a11y-panel animate-scale-in">
                    <div className="a11y-header">
                        <h4>Accesibilidad Universal</h4>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>✖</button>
                    </div>

                    <div className="a11y-body">
                        {}
                        <div className="a11y-option">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)' }}>
                                <Type size={18} /> Tamaño de Letra
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button className="btn-a11y" onClick={decreaseFont} disabled={fontSize <= 0.9}>A-</button>
                                <span style={{ width: '40px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {Math.round(fontSize * 100)}%
                                </span>
                                <button className="btn-a11y" onClick={increaseFont} disabled={fontSize >= 1.3}>A+</button>
                            </div>
                        </div>

                        {}
                        <div className="a11y-option">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text)' }}>
                                {highContrast ? <Eye size={18} /> : <EyeOff size={18} />} Alto Contraste
                            </span>
                            <button
                                className={`btn-a11y-toggle ${highContrast ? 'active' : ''}`}
                                onClick={() => setHighContrast(!highContrast)}
                            >
                                {highContrast ? 'Activado' : 'Desactivado'}
                            </button>
                        </div>

                        {}
                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <button onClick={resetA11y} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                <RotateCcw size={14} /> Restablecer ajustes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
