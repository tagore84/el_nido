import { useState, useEffect } from 'react';

function MealsTable() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await fetch('/bga/bga_api/meals');
                // Note: We need to handle the URL correctly. 
                // In local dev (port 3005), we need to proxy to backend (8008). 
                // Or call absolute URL if CORS allows. App.jsx uses specific logic.
                // Let's use the same logic as App.jsx or rely on Vite proxy.
                // For simplicity in this demo, let's assume direct call for now if simpler

                let url = '/bga_api/meals';
                // If dependent on Vite proxy or Nginx.
                // If local dev without Nginx: http://localhost:8008/meals

                if (import.meta.env.DEV) {
                    url = 'http://localhost:8008/meals';
                } else {
                    // Production/Nginx structure: /bga_api/
                    // But our page is at /bga/, so ../bga_api/ or absolute /bga_api/
                    url = `${window.location.protocol}//${window.location.host}/bga_api/meals`;
                }

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

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading meals...</div>;
    if (error) return <div style={{ textAlign: 'center', color: '#f87171', padding: '2rem' }}>Error loading meals: {error}</div>;

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Recent Meals</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Date</th>
                            <th style={{ padding: '0.75rem' }}>Meal</th>
                            <th style={{ padding: '0.75rem' }}>Type</th>
                            <th style={{ padding: '0.75rem' }}>Calories</th>
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
                                    No meals found.
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
