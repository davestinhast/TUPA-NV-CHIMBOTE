import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, ArrowRight, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mapIntent } from '../utils/intentMapper';

const FLOWS = {
    ROOT: {
        text: '¡Hola! Soy Anita, tu guía municipal. 😊 ¿En qué puedo ayudarte hoy?',
        options: [
            { label: '🏠 Construcción o Vivienda', next: 'CONSTRUCCION' },
            { label: '🏢 Abrir o Regular un Negocio', next: 'NEGOCIO' },
            { label: '💍 Trámites de Familia y Registro', next: 'FAMILIA' },
            { label: '💰 Pagos y Deudas (Impuestos)', next: 'PAGOS' },
            { label: '👮 Seguridad o Quejas', next: 'SEGURIDAD' },
            { label: '👵 Soy un Adulto Mayor', next: 'ADULTOMAYOR' }
        ]
    },
    CONSTRUCCION: {
        text: '¡Entendido! Lo relacionado a tu casa está en el área de **Licencias de Edificación**. ¿Qué quieres hacer exactamente?',
        options: [
            { label: '🧱 Construir o remodelar mi casa', link: '/buscar?categoria=Licencias%20de%20Edificación&q=vivienda' },
            { label: '🏗️ Construir segundo piso o ampliación', link: '/buscar?categoria=Licencias%20de%20Edificación&q=ampliación' },
            { label: '🔨 Demoler algo o sacar desmonte', link: '/buscar?categoria=Licencias%20de%20Edificación&q=demolición' },
            { label: '⬅️ Volver al inicio', next: 'ROOT' }
        ]
    },
    NEGOCIO: {
        text: 'Para tu emprendimiento necesitas la **Licencia de Funcionamiento**. ¿Cuál es tu situación?',
        options: [
            { label: '🏪 Quiero abrir una bodega o tienda', link: '/buscar?categoria=Licencias%20de%20Funcionamiento&q=bodega' },
            { label: '🍴 Quiero poner un restaurante', link: '/buscar?categoria=Licencias%20de%20Funcionamiento&q=restaurante' },
            { label: '📢 Poner un letrero o publicidad', link: '/buscar?categoria=Publicidad%20Exterior' },
            { label: '⬅️ Volver al inicio', next: 'ROOT' }
        ]
    },
    FAMILIA: {
        text: 'El área de **Registro Civil** ve temas de familia. ¿Qué buscas hoy?',
        options: [
            { label: '💍 Casarme (Matrimonio Civil)', link: '/buscar?categoria=Registro%20Civil&q=matrimonio' },
            { label: '👶 Partida de Nacimiento', link: '/buscar?categoria=Registro%20Civil&q=nacimiento' },
            { label: '☦️ Fallecimiento/Cementerio', link: '/buscar?categoria=Registro%20Civil&q=fallecimiento' },
            { label: '⬅️ Volver al inicio', next: 'ROOT' }
        ]
    },
    PAGOS: {
        text: 'Puedes consultar y pagar tus deudas en **Tributación**. ¿Qué necesitas saber?',
        options: [
            { label: '💵 Pagar mis arbitrios o autovalúo', link: '/buscar?categoria=Tributación&f=predial' },
            { label: '📝 Ver mis descuentos o amnistías', link: '/buscar?categoria=Tributación&q=beneficios' },
            { label: '⬅️ Volver al inicio', next: 'ROOT' }
        ]
    },
    ADULTOMAYOR: {
        text: '👵 ¡Qué gusto saludarte! Tenemos beneficios especiales para ti en impuestos y asesoría gratuita. ¿Te interesa alguno?',
        options: [
            { label: '📉 Descuento para pensionistas', link: '/buscar?categoria=Tributación&q=descuentos' },
            { label: '🩺 Otros beneficios municipales', link: '/buscar?categoria=Otros%20Servicios' },
            { label: '⬅️ Volver al inicio', next: 'ROOT' }
        ]
    },
    SEGURIDAD: {
        text: '¿Deseas reportar algo o pedir permisos de seguridad?',
        options: [
            { label: '🛡️ Inspección Defensa Civil (ITSE)', link: '/buscar?categoria=Inspección%20Técnica%20de%20Seguridad%20(ITSE)' },
            { label: '🔊 Reportar bulla o ruidos molestos', link: '/buscar?categoria=Fiscalización%20y%20Sanciones' },
            { label: '📔 Libro de Reclamaciones', link: '/buscar?q=reclamación' },
            { label: '⬅️ Volver al inicio', next: 'ROOT' }
        ]
    }
};

export default function TupaBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (isOpen && messages.length === 0) {
            triggerFlow('ROOT');
        }
    }, [isOpen]);

    const triggerFlow = (flowKey) => {
        const flow = FLOWS[flowKey];
        const newMsg = {
            id: Date.now(),
            text: flow.text,
            sender: 'bot',
            timestamp: new Date(),
            options: flow.options
        };
        setMessages(prev => [...prev, newMsg]);
    };

    const handleSend = (text) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const smartQuery = mapIntent(text);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: `He entendido tu necesidad. Para "${text}", aquí tienes lo que he encontrado en nuestro sistema:`,
                sender: 'bot',
                timestamp: new Date(),
                action: {
                    link: `/buscar?q=${encodeURIComponent(smartQuery)}&original=${encodeURIComponent(text)}`,
                    text: 'Ver Resultados'
                }
            }]);
        }, 1200);
    };

    const handleOptionClick = (option) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: option.label,
            sender: 'user',
            timestamp: new Date()
        }]);

        if (option.next) {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                triggerFlow(option.next);
            }, 600);
        } else if (option.link) {
            navigate(option.link);
            setIsOpen(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            { }
            {!isOpen && (
                <button
                    className="bot-fab"
                    onClick={() => setIsOpen(true)}
                    aria-label="Abrir asistente virtual"
                >
                    <div className="bot-fab-icon">
                        <MessageSquare size={24} />
                    </div>
                    <span className="bot-fab-tooltip">¿Te ayudo a buscar?</span>
                    <span className="bot-online-indicator"></span>
                </button>
            )}

            { }
            <div className={`bot-window ${isOpen ? 'open' : ''}`}>

                { }
                <div className="bot-header">
                    <div className="bot-header-info">
                        <div className="bot-avatar">
                            <Bot size={20} color="var(--primary)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: 'white', fontWeight: 600 }}>Tupi Bot 🤖</h3>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: 6, height: 6, background: '#4CAF50', borderRadius: '50%', display: 'inline-block' }}></span>
                                En línea
                            </span>
                        </div>
                    </div>
                    <div className="bot-header-actions">
                        <button onClick={() => setIsOpen(false)} className="bot-close-btn" title="Minimizar">
                            <Minimize2 size={18} />
                        </button>
                    </div>
                </div>

                { }
                <div className="bot-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                            {msg.sender === 'bot' && (
                                <div className="message-avatar bot"><Bot size={14} /></div>
                            )}
                            <div className="message-content">
                                <div className={`message-bubble ${msg.sender}`}>
                                    {msg.text}
                                </div>
                                <div className="message-time">{formatTime(msg.timestamp)}</div>

                                { }
                                {msg.options && (
                                    <div className="message-options">
                                        {msg.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                className="bot-option-btn"
                                                onClick={() => handleOptionClick(opt)}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                { }
                                {msg.action && (
                                    <button
                                        className="bot-action-btn"
                                        onClick={() => {
                                            navigate(msg.action.link);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {msg.action.text} <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    { }
                    {isTyping && (
                        <div className="message-wrapper bot">
                            <div className="message-avatar bot"><Bot size={14} /></div>
                            <div className="message-content">
                                <div className="message-bubble bot typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                { }
                <div className="bot-input-area">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend(inputValue);
                        }}
                        style={{ display: 'flex', width: '100%', gap: '8px' }}
                    >
                        <input
                            type="text"
                            className="bot-input"
                            placeholder="Ej. Requisitos para licencia..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            className="bot-send-btn"
                            disabled={!inputValue.trim() || isTyping}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>

                <div className="bot-footer-branding">
                    Desarrollado para TUPA Digital V1.0
                </div>

            </div>
        </>
    );
}
