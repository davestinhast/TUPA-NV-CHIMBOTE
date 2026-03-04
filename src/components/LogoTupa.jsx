export default function LogoTupa({ className = '', style = {} }) {
    return (
        <div
            className={`logo-container ${className}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                ...style
            }}
        >
            {}
            <svg
                width="42"
                height="48"
                viewBox="0 0 42 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0 }}
            >
                {}
                <path opacity="0.1" d="M21 48L3 38V12L21 2L39 12V38L21 48Z" fill="var(--primary)" />

                {}
                <path d="M21 45L6 36.6667V13.3333L21 5L36 13.3333V36.6667L21 45Z" fill="var(--secondary)" />

                {}
                <path d="M21 5V25L6 16.6667V13.3333L21 5Z" fill="#E2E8F0" />

                {}
                <path d="M21 5V25L36 16.6667V13.3333L21 5Z" fill="var(--primary)" />

                {}
                <rect x="15" y="19" width="12" height="2" rx="1" fill="white" />
                <rect x="15" y="24" width="8" height="2" rx="1" fill="white" />
                <rect x="15" y="29" width="12" height="2" rx="1" fill="white" />

                {}
                <rect x="25" y="24" width="2" height="2" rx="0.5" fill="var(--primary-light)" />
            </svg>

            {}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span
                        style={{
                            fontSize: '1.75rem',
                            fontWeight: 900,
                            color: 'var(--secondary)',
                            letterSpacing: '-0.02em',
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        TUPA
                    </span>
                    <span
                        style={{
                            fontSize: '1.75rem',
                            fontWeight: 300,
                            color: 'var(--primary)',
                            letterSpacing: '0.02em',
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        DIGITAL
                    </span>
                </div>

                {}
                <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, var(--border) 0%, transparent 100%)', margin: '4px 0 3px 0' }}></div>

                <span
                    style={{
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontFamily: "'Inter', sans-serif"
                    }}
                >
                    Municipalidad de Nuevo Chimbote
                </span>
            </div>
        </div>
    );
}
