document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const updateBtn = document.getElementById('update-btn');
    const lastUpdatedEl = document.getElementById('last-updated');
    const API_TOKEN = 'changeme'; // Should match n8n workflow

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth'
        },
        height: '100%',
        events: async function (info, successCallback, failureCallback) {
            try {
                const response = await fetch('/api/events');
                if (!response.ok) throw new Error('API Error');
                const data = await response.json();

                // Update "Last Updated" text
                if (data.generated_at) {
                    const date = new Date(data.generated_at);
                    lastUpdatedEl.textContent = `Actualizado: ${date.toLocaleTimeString()}`;
                }

                // Map events to FullCalendar format
                const events = data.events.map(e => ({
                    id: e.id,
                    title: e.title,
                    start: e.start,
                    end: e.end,
                    allDay: e.allDay,
                    backgroundColor: e.source.includes('alberto') ? '#3700b3' : '#03dac6', // Basic color coding
                    borderColor: 'transparent'
                }));

                successCallback(events);
            } catch (error) {
                console.error('Error fetching events:', error);
                failureCallback(error);
            }
        },
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
        }
    });

    calendar.render();

    // Auto-refresh every 60 minutes
    setInterval(() => {
        calendar.refetchEvents();
    }, 60 * 60 * 1000);

    // Manual Update Handler
    updateBtn.addEventListener('click', async () => {
        const originalText = updateBtn.innerHTML;
        updateBtn.disabled = true;
        updateBtn.innerHTML = '<span class="icon spinner">↻</span> Actualizando...';

        try {
            const response = await fetch(`/api/update?token=${API_TOKEN}`, {
                method: 'POST'
            });

            if (response.ok) {
                // Wait a bit for the backend to write the file, then refresh
                setTimeout(() => {
                    calendar.refetchEvents();
                    updateBtn.disabled = false;
                    updateBtn.innerHTML = originalText;
                }, 2000);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Error al actualizar el calendario. Revisa la consola o los logs.');
            updateBtn.disabled = false;
            updateBtn.innerHTML = originalText;
        }
    });
});
