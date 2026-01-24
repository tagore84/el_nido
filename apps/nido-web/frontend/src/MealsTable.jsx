import { useState, useEffect } from 'react';

function MealsTable() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await fetch('/nido_api/meals');
                // Note: We need to handle the URL correctly. 
                // In local dev (port 3005), we need to proxy to backend (8008). 
                // Or call absolute URL if CORS allows. App.jsx uses specific logic.
                // Let's use the same logic as App.jsx or rely on Vite proxy.
                // For simplicity in this demo, let's assume direct call for now if simpler

                // Use relative path relying on Proxy (Dev) or Nginx (Prod)
                let url = '/nido_api/meals';

                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setMeals(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando comidas...</div>;
    if (error) return <div style={{ textAlign: 'center', color: '#f87171', padding: '2rem' }}>Error cargando comidas: {error}</div>;

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Comidas Recientes</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Fecha</th>
                            <th style={{ padding: '0.75rem' }}>Comida</th>
                            <th style={{ padding: '0.75rem' }}>Tipo</th>
                            <th style={{ padding: '0.75rem' }}>Calorías</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map((meal, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{meal.date}</td>
                                <td style={{ padding: '0.75rem', fontWeight: 500 }}>{meal.name}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '12px',
                                        background: 'rgba(56, 189, 248, 0.15)',
                                        color: '#38bdf8',
                                        fontSize: '0.8rem'
                                    }}>
                                        {meal.type}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>{meal.calories}</td>
                            </tr>
                        ))}
                        {meals.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    No hay comidas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MealsTable;
