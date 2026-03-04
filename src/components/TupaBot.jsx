import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, ArrowRight, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TupaBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [botFlow, setBotFlow] = useState('IDLE');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    text: '¡Hola! 👋 Soy Tupi, tu asistente virtual de la Municipalidad de Nuevo Chimbote.',
                    sender: 'bot',
                    timestamp: new Date()
                },
                {
                    id: 2,
                    text: '¿En qué te puedo ayudar hoy? Selecciona una opción rápida o escríbeme lo que buscas:',
                    sender: 'bot',
                    timestamp: new Date(),
                    options: [
                        { label: '🗣️ Asesoría Paso a Paso', query: 'FLUJO_ASESORIA' },
                        { label: '🏢 Abrir un Negocio', query: 'Licencias de Funcionamiento' },
                        { label: '🏗️ Permisos de Construcción', query: 'Licencias de Edificación' },
                        { label: '🏛️ Tributación / Pagos', query: 'Tributación' }
                    ]
                }
            ]);
        }
    }, [isOpen, messages.length]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text) => {
        if (!text.trim()) return;


        const newUserMsg = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);


        setTimeout(() => {
            setIsTyping(false);

            const lowerText = text.toLowerCase();
            let responseText = '';
            let actionLink = null;
            let actionText = '';
            let skipDefault = false;

            if (botFlow === 'ASK_TYPE') {
                if (lowerText.includes('natural') || lowerText.includes('persona')) {
                    responseText = "Como ciudadano (Persona Natural), las consultas más frecuentes son sobre Matrimonios (Registro Civil), Pagos de Predial (Tributación) o Licencias de Edificación. ¿Sobre qué tema te gustaría consultar?";
                    setBotFlow('IDLE');
                    skipDefault = true;
                } else if (lowerText.includes('empresa') || lowerText.includes('negocio') || lowerText.includes('jurídica')) {
                    responseText = "Para negocios y empresas (Persona Jurídica), lo más solicitado son las Licencias de Funcionamiento y los Certificados de Defensa Civil (ITSE). ¿Cuál de los dos necesitas tramitar?";
                    setBotFlow('IDLE');
                    skipDefault = true;
                } else {
                    responseText = "No te entendí muy bien. Para guiarte mejor, responde: ¿Eres una Persona Natural o una Empresa?";
                    skipDefault = true;
                }
            }

            if (!skipDefault) {
                if (lowerText.includes('asesoría') || lowerText.includes('paso a paso') || text === 'FLUJO_ASESORIA') {
                    responseText = "¡Claro que sí! Para darte la mejor ruta, cuéntame: ¿Vas a realizar el trámite como Persona Natural (ciudadano) o como Empresa?";
                    setBotFlow('ASK_TYPE');
                } else if (lowerText.includes('negocio') || lowerText.includes('empresa') || lowerText.includes('licencia') || lowerText.includes('funcionamiento')) {
                    responseText = 'Para abrir un negocio o empresa, necesitas revisar el área de Licencias de Funcionamiento. Allí encontrarás los requisitos.'
                    actionLink = '/buscar?categoria=Licencias%20de%20Funcionamiento';
                    actionText = 'Ver Licencias de Funcionamiento';
                } else if (lowerText.includes('construir') || lowerText.includes('obra') || lowerText.includes('casa') || lowerText.includes('edificaci')) {
                    responseText = 'Si vas a construir o modificar una vivienda, revisa el área de Licencias de Edificación.';
                    actionLink = '/buscar?categoria=Licencias%20de%20Edificaci%C3%B3n';
                    actionText = 'Ver Trámites de Edificación';
                } else if (lowerText.includes('defensa civil') || lowerText.includes('itse')) {
                    responseText = 'Los trámites de Defensa Civil (ITSE) son vitales para tu negocio. Revisa la sección correspondiente.';
                    actionLink = '/buscar?categoria=Inspecci%C3%B3n%20T%C3%A9cnica%20de%20Seguridad%20(ITSE)';
                    actionText = 'Ir a Defensa Civil (ITSE)';
                } else if (lowerText.includes('pagar') || lowerText.includes('tributo') || lowerText.includes('impuesto') || lowerText.includes('predial')) {
                    responseText = 'Los trámites relacionados a pagos, arbitrios e impuestos están en la sección de Tributación.';
                    actionLink = '/buscar?categoria=Tributaci%C3%B3n';
                    actionText = 'Ir a Tributación';
                } else {
                    responseText = `He buscado "${text}" en nuestro catálogo TUPA. Haz clic abajo para ver todos los resultados.`;
                    actionLink = `/buscar?q=${encodeURIComponent(text)}`;
                    actionText = `Buscar "${text}"`;
                }
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: responseText,
                sender: 'bot',
                timestamp: new Date(),
                action: actionLink ? { link: actionLink, text: actionText } : undefined
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

        if (option.query === 'FLUJO_ASESORIA') {
            handleSend('FLUJO_ASESORIA');
            return;
        }

        setIsTyping(true);


        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: '¡Excelente! Te llevaré a esa sección ahora mismo.',
                sender: 'bot',
                timestamp: new Date()
            }]);


            setTimeout(() => {
                navigate(`/buscar?categoria=${encodeURIComponent(option.query)}`);
                setIsOpen(false);
            }, 1500);

        }, 1000);
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
