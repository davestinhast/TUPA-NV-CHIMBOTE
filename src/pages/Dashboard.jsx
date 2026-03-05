import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Activity, FileText, CheckCircle, Zap, TrendingUp, Users } from 'lucide-react';

const COLORS = ['#C62828', '#1A237E', '#0288D1', '#00796B', '#F57C00', '#673AB7', '#E91E63', '#4CAF50'];

export default function Dashboard() {
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/procedimientos.json`)
            .then(r => r.json())
            .then(data => { setProcedures(data); setLoading(false); })
            .catch(console.error);
    }, []);


    const stats = useMemo(() => {
        if (!procedures.length) return null;

        let gratuitos = 0;
        let automaticos = 0;
        let rapidos = 0;
        let virtuales = 0;

        const categoryCounts = {};

        procedures.forEach(p => {

            if (p.costo && p.costo.toLowerCase().includes('gratuito')) gratuitos++;


            if (p.calificacion && p.calificacion.toLowerCase().includes('automática')) automaticos++;


            if (p.plazo) {
                const match = p.plazo.match(/(\d+)/);
                if (match && parseInt(match[1]) <= 5) rapidos++;
            }


            if (p.canales && (p.canales.virtual || p.canales.correo)) virtuales++;


            categoryCounts[p.categoria] = (categoryCounts[p.categoria] || 0) + 1;
        });

        const categoryData = Object.entries(categoryCounts)
            .map(([name, value]) => ({ name: name.length > 25 ? name.substring(0, 25) + '...' : name, value, fullName: name }))
            .sort((a, b) => b.value - a.value);

        return {
            total: procedures.length,
            gratuitos,
            automaticos,
            rapidos,
            virtuales,
            categoryData
        };
    }, [procedures]);

    if (loading || !stats) return <div className="loading"><div className="spinner" /></div>;

    const kpiCards = [
        { title: 'Total Trámites (TUPA)', value: stats.total, icon: FileText, color: 'var(--primary)', trend: '+100% Digitalizados' },
        { title: 'Trámites Gratuitos', value: stats.gratuitos, icon: CheckCircle, color: '#4CAF50', trend: `${Math.round((stats.gratuitos / stats.total) * 100)}% del total` },
        { title: 'Aprobación Automática', value: stats.automaticos, icon: Zap, color: '#FF9800', trend: 'Cero burocracia' },
        { title: 'Atención Virtual', value: stats.virtuales, icon: Activity, color: '#2196F3', trend: 'Sin ir a la Muni' },
    ];

    return (
        <div className="dashboard-page animate-fade-in" style={{ padding: '2rem', maxWidth: '1440px', margin: '0 auto', background: 'var(--bg)' }}>

            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', color: 'var(--secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <TrendingUp size={32} color="var(--primary)" />
                        Dashboard Gerencial
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Resumen analítico en tiempo real del impacto del TUPA Digital 2024.</p>
                </div>
                <div style={{ background: 'var(--bg-white)', padding: '0.8rem 1.5rem', borderRadius: '30px', border: '1px solid var(--border)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                    Actualizado: Hoy, {new Date().toLocaleTimeString()}
                </div>
            </div>

            { }
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {kpiCards.map((kpi, i) => (
                    <div key={i} style={{ background: 'var(--bg-white)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                            <kpi.icon size={100} color={kpi.color} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ background: `${kpi.color}15`, padding: '0.8rem', borderRadius: '12px' }}>
                                <kpi.icon size={24} color={kpi.color} strokeWidth={2.5} />
                            </div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>{kpi.title}</h3>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
                            {kpi.value}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <TrendingUp size={14} /> {kpi.trend}
                        </div>
                    </div>
                ))}
            </div>

            { }
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>

                { }
                <div style={{ background: 'var(--bg-white)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>Distribución por Categorías</h3>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.categoryData.slice(0, 8)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-white)', borderColor: 'var(--border)', color: 'var(--text)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                                    formatter={(value, name, props) => [value, props.payload.fullName]}
                                />
                                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                { }
                <div style={{ background: 'var(--bg-white)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>Impacto Digital: Carga de Consultas (Simuladas)</h3>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={[
                                    { month: 'Ene', presenciales: 4000, virtuales: 2400 },
                                    { month: 'Feb', presenciales: 3000, virtuales: 1398 },
                                    { month: 'Mar', presenciales: 2000, virtuales: 9800 },
                                    { month: 'Abr', presenciales: 2780, virtuales: 3908 },
                                    { month: 'May', presenciales: 1890, virtuales: 4800 },
                                    { month: 'Jun', presenciales: 2390, virtuales: 3800 },
                                    { month: 'Jul', presenciales: 3490, virtuales: 4300 },
                                ]}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorVirtuales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPresenciales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--text-muted)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--text-muted)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="var(--border)" tick={{ fill: 'var(--text-secondary)' }} />
                                <YAxis stroke="var(--border)" tick={{ fill: 'var(--text-secondary)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-white)', borderColor: 'var(--border)', color: 'var(--text)', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="virtuales" name="Consultas TUPA Digital" stroke="var(--primary)" fillOpacity={1} fill="url(#colorVirtuales)" />
                                <Area type="monotone" dataKey="presenciales" name="Consultas Presenciales" stroke="var(--text-muted)" fillOpacity={1} fill="url(#colorPresenciales)" />
                                <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
