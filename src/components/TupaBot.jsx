import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, ArrowRight, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mapIntent } from '../utils/intentMapper';
import { api } from '../api';
import { embedText } from '../utils/embedder';
import { searchByEmbedding, searchFallback, expandQuery } from '../utils/semanticSearch';
import { buildResponse } from '../utils/botResponder';

// ✅ FLOWS fuera del componente
const FLOWS = {
    ROOT: {
        text: '¡Hola, vecino/a! Soy Anita, tu asistente municipal. 🤖 Estoy aquí para facilitarte cualquier trámite en Nuevo Chimbote. ¿En qué puedo orientarte hoy?',
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
    // ✅ TODOS los estados DENTRO del componente
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [hasNotification, setHasNotification] = useState(false);
    const [procedures, setProcedures] = useState([]);
    const [modelReady, setModelReady] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // ✅ TODOS los useEffect DENTRO del componente
    useEffect(() => {
        api.getProcedures().then(setProcedures);
    }, []);

    useEffect(() => {
        if (isOpen && !modelReady) {
            import('../utils/embedder').then(({ getEmbedder }) => {
                getEmbedder().then(() => setModelReady(true));
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            triggerFlow('ROOT');
            setHasNotification(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setHasNotification(true);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const playSendSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
    };

    const playReceiveSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
    };

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
        if (flowKey !== 'ROOT') playReceiveSound();
    };

    const handleSend = async (text) => {
        if (!text.trim()) return;

        playSendSound();
        setMessages(prev => [...prev, {
            id: Date.now(),
            text,
            sender: 'user',
            timestamp: new Date()
        }]);
        setInputValue('');
        setIsTyping(true);

        try {
            let relevantProcs = [];

            if (modelReady && procedures.length > 0) {
                const expanded = expandQuery(text);
                const queryVec = await embedText(expanded);
                relevantProcs = await searchByEmbedding(queryVec, procedures, 3);
            } else if (procedures.length > 0) {
                relevantProcs = await searchFallback(text, procedures, 3);
            }

            const { text: botText, procs } = buildResponse(text, relevantProcs);

            setIsTyping(false);
            playReceiveSound();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: botText,
                sender: 'bot',
                timestamp: new Date(),
                options: procs.length > 0 ? [
                    ...procs.map(p => ({
                        label: `📄 ${p.nombre.substring(0, 42)}...`,
                        link: `/tramite/${p.slug}`
                    })),
                    {
                        label: '🔍 Ver todos los resultados',
                        link: `/buscar?q=${encodeURIComponent(mapIntent(text))}&original=${encodeURIComponent(text)}`
                    }
                ] : [
                    { label: '🔍 Buscar en el directorio', link: '/buscar' }
                ]
            }]);

        } catch (error) {
            console.error(error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: 'Disculpa vecino, tuve un problema. Por favor intenta buscar en el directorio.',
                sender: 'bot',
                timestamp: new Date(),
                options: [{ label: '🔍 Ir al Directorio', link: '/buscar' }]
            }]);
        }
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
            {!isOpen && (
                <button
                    className={`bot-fab ${hasNotification ? 'has-notification' : ''}`}
                    onClick={() => { setIsOpen(true); setHasNotification(false); }}
                    aria-label="Abrir asistente virtual"
                >
                    <div className="bot-fab-icon">
                        <MessageSquare size={24} />
                    </div>
                    <span className="bot-fab-tooltip">
                        {hasNotification ? '¡Hola! ¿Necesitas ayuda?' : '¿Te ayudo a buscar?'}
                    </span>
                    <span className="bot-online-indicator"></span>
                </button>
            )}

            <div className={`bot-window ${isOpen ? 'open' : ''}`}>
                <div className="bot-header">
                    <div className="bot-header-info">
                        <div className="bot-avatar">
                            <Bot size={20} color="var(--primary)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: 'white', fontWeight: 600 }}>
                                Tupi Bot 🤖
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: 6, height: 6, background: '#4CAF50', borderRadius: '50%', display: 'inline-block' }}></span>
                                {modelReady ? 'IA Lista ✨' : 'En línea'}
                            </span>
                        </div>
                    </div>
                    <div className="bot-header-actions">
                        <button onClick={() => setIsOpen(false)} className="bot-close-btn" title="Minimizar">
                            <Minimize2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="bot-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                            {msg.sender === 'bot' && (
                                <div className="message-avatar bot"><Bot size={14} /></div>
                            )}
                            <div className="message-content">
                                <div className={`message-bubble ${msg.sender}`}>
                                    <FormatMessage text={msg.text} />
                                </div>
                                <div className="message-time">{formatTime(msg.timestamp)}</div>

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

                                {msg.action && (
                                    <button
                                        className="bot-action-btn"
                                        onClick={() => { navigate(msg.action.link); setIsOpen(false); }}
                                    >
                                        {msg.action.text} <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

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

                <div className="bot-input-area">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                        style={{ display: 'flex', width: '100%', gap: '8px' }}
                    >
                        <input
                            type="text"
                            className="bot-input"
                            placeholder={!modelReady ? "⏳ Cargando IA..." : "Ej. quiero construir mi casa..."}
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

function FormatMessage({ text }) {
    if (!text) return null;
    const lines = text.split('\n');
    return (
        <div className="formatted-message">
            {lines.map((line, i) => {
                const boldRegex = /\*\*(.*?)\*\*/g;
                const parts = [];
                let currIndex = 0;
                let match;
                while ((match = boldRegex.exec(line)) !== null) {
                    if (match.index > currIndex) parts.push(line.substring(currIndex, match.index));
                    parts.push(<strong key={match.index}>{match[1]}</strong>);
                    currIndex = match.index + match[0].length;
                }
                if (currIndex < line.length) parts.push(line.substring(currIndex));
                const finalContent = parts.length > 0 ? parts : line;

                if (line.trim().startsWith('*')) {
                    const cleanLine = line.trim().substring(1).trim();
                    const listParts = [];
                    let lIndex = 0;
                    let lMatch;
                    const boldRegex2 = /\*\*(.*?)\*\*/g;
                    while ((lMatch = boldRegex2.exec(cleanLine)) !== null) {
                        if (lMatch.index > lIndex) listParts.push(cleanLine.substring(lIndex, lMatch.index));
                        listParts.push(<strong key={lMatch.index}>{lMatch[1]}</strong>);
                        lIndex = lMatch.index + lMatch[0].length;
                    }
                    if (lIndex < cleanLine.length) listParts.push(cleanLine.substring(lIndex));
                    return (
                        <div key={i} className="bot-list-item">
                            <span className="dot">•</span>
                            <span>{listParts.length > 0 ? listParts : cleanLine}</span>
                        </div>
                    );
                }
                return (
                    <p key={i} style={{ marginBottom: line.trim() === '' ? '0' : '8px', marginTop: 0 }}>
                        {finalContent}
                    </p>
                );
            })}
        </div>
    );
}
