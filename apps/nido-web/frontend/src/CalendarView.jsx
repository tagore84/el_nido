import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

const CALENDAR_COLORS = {
    'Alberto': '#ef4444', // Red
    'Laura': '#eab308',   // Yellow
    'Shared': '#3b82f6'   // Blue
};

const DEFAULT_COLOR = '#64748b';

function CalendarView(props) {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);
    const calendarRef = useRef(null);

    // We now rely on Vite proxy or Nginx proxy to handle /nido_api requests correctly. 
    // No need for explicit host detection.

    const fetchEvents = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch('/nido_api/calendar');
            if (!res.ok) throw new Error('Failed to fetch calendar');
            const data = await res.json();
            console.log('Calendar API Data:', data);

            // Robustly determine the events array
            let eventsList = [];
            if (data && Array.isArray(data.data)) {
                eventsList = data.data;
            } else if (data && data.data && typeof data.data === 'object') {
                // Handle case where backend returns a single object instead of an array
                eventsList = [data.data];
            } else if (Array.isArray(data)) {
                // Fallback if the structure is just the array directly
                eventsList = data;
            } else {
                console.warn('Unexpected data structure:', data);
            }

            // Transform events for FullCalendar
            const formattedEvents = eventsList.map(evt => ({
                id: evt.id,
                title: evt.summary || 'No Title',
                start: evt.start,
                end: evt.end,
                allDay: evt.allDay,
                backgroundColor: CALENDAR_COLORS[evt.source] || DEFAULT_COLOR,
                borderColor: CALENDAR_COLORS[evt.source] || DEFAULT_COLOR,
                textColor: evt.source === 'Laura' ? '#000000' : '#ffffff', // Better contrast for yellow
                extendedProps: {
                    source: evt.source,
                    priority: evt.priority || 'low'
                }
            }));

            setEvents(formattedEvents);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            await fetch('/nido_api/calendar/sync', { method: 'POST' });
            // Poll for completion or just wait a bit and re-fetch?
            // Since backend is async background task, immediate re-fetch might get old data.
            // But for this MVP let's wait 3s then re-fetch.
            setTimeout(() => {
                fetchEvents().then(() => setSyncing(false));
            }, 3000);
        } catch (err) {
            console.error(err);
            setSyncing(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchEvents();
    }, []);

    return (
        <div className="card" style={{ marginTop: '2rem', minHeight: '600px', maxWidth: '100%', position: 'relative' }}>
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                    borderRadius: '20px'
                }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>Cargando calendario...</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Esto puede tardar unos minutos si es la primera vez.</p>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Calendario</h2>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
                        {Object.entries(CALENDAR_COLORS).map(([name, color]) => (
                            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }}></div>
                                <span style={{ color: 'var(--text-secondary)' }}>{name}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSync}
                        disabled={syncing || loading}
                        style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.85rem',
                            opacity: syncing ? 0.7 : 1
                        }}
                    >
                        {syncing ? 'Sincronizando...' : 'Sincronizar'}
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ padding: '1rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                    Error: {error}
                </div>
            )}

            <div className="calendar-container" style={{ color: 'var(--text-primary)' }}>
                <FullCalendar
                    ref={calendarRef}
                    locale={esLocale}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    height="auto"
                    dayMaxEvents={true}
                    slotMinTime="08:00:00"
                    slotMaxTime="23:00:00"
                />
            </div>

            {/* Minimal override styles for FullCalendar dark mode compatibility */}
            <style>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    border-left-color: var(--accent-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .fc {
                    --fc-border-color: rgba(255,255,255,0.1);
                    --fc-page-bg-color: transparent;
                    --fc-neutral-bg-color: rgba(255,255,255,0.05);
                    --fc-list-event-hover-bg-color: rgba(255,255,255,0.1);
                    --fc-today-bg-color: rgba(255,255,255,0.05);
                }
                .fc-theme-standard td, .fc-theme-standard th {
                    border-color: var(--fc-border-color);
                }
                .fc .fc-toolbar-title {
                    font-size: 1.25rem;
                }
                .fc .fc-button-primary {
                    background-color: #334155;
                    border-color: #334155;
                }
                .fc .fc-button-primary:hover {
                    background-color: #475569;
                    border-color: #475569;
                }
                .fc .fc-button-primary:not(:disabled).fc-button-active {
                    background-color: #2563eb;
                    border-color: #2563eb;
                }
                .fc-daygrid-day-number {
                    color: var(--text-primary);
                    text-decoration: none;
                }
                .fc-col-header-cell-cushion {
                    color: var(--text-secondary);
                    text-decoration: none;
                }
            `}</style>
        </div>
    );
}

export default CalendarView;
