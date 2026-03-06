export default function LogoTupa({ className = '', style = {} }) {
    return (
        <div
            className={`logo-container ${className}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                ...style
            }}
        >
            { }
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <img
                    src={`${import.meta.env.BASE_URL}escudo-chimbote.png`}
                    alt="Escudo de Nuevo Chimbote"
                    style={{
                        height: '52px',
                        width: 'auto',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                />
            </div>

            { }
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span
                        style={{
                            fontSize: '1.65rem',
                            fontWeight: 900,
                            color: 'var(--secondary)',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        TUPA
                    </span>
                    <span
                        style={{
                            fontSize: '1.65rem',
                            fontWeight: 300,
                            color: 'var(--primary)',
                            letterSpacing: '0.01em',
                        }}
                    >
                        DIGITAL
                    </span>
                </div>

                <div style={{ width: '100%', height: '2px', background: 'var(--primary)', margin: '2px 0 4px 0', opacity: 0.8 }}></div>

                <span
                    style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: 'var(--text)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        maxWidth: '220px'
                    }}
                >
                    Municipalidad de Nuevo Chimbote
                </span>
            </div>
        </div>
    );
}
