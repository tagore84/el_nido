# Resumen del Flujo: Confirmación de Asistencia a Partidos y Notificaciones en Home Assistant

## Descripción General
Este flujo en n8n consultará semanalmente un calendario compartido para ver los partidos de fútbol programados. Luego, te enviará un mensaje por Telegram para confirmar si vas a asistir. Si confirmas que sí, el evento se añadirá a un calendario compartido con Laura, ella recibirá una notificación por Telegram y se generará una notificación visible en el dashboard de Home Assistant.

## Pasos Necesarios

1. **Configurar Credenciales de Calendarios:**
   - Asegúrate de tener credenciales de solo lectura para el calendario de los partidos.
   - Crea las credenciales para el calendario compartido con Laura donde se añadirá el evento si confirmas asistencia.

2. **Integrar Telegram en n8n:**
   - Configura un nodo de Telegram para enviar mensajes y recibir respuestas.

3. **Conectar Home Assistant con n8n:**
   - Establece la conexión usando la URL de tu Home Assistant y un token de acceso.
   - Añade un nodo que actualice una entidad o genere una notificación en tu dashboard.

4. **Lógica del Flujo:**
   - Leer semanalmente el calendario de partidos de fútbol.
   - Los viernes por la tarde, mandar mensaje de telegram para Alberto preguntando por su asistencia.
   - Si la respuesta es afirmativa, añadir el evento al calendario compartido con Laura.
   - Laura recibe notificación por Telegram y se genera una notificación visible en el dashboard de Home Assistant.

## Detalles Técnicos y Despliegue

### Archivo del Flujo
El flujo de n8n se encuentra en: `workflows/agenda/futbol_attendance.json`

### Importación y Configuración
1. **Importar en n8n:**
   - Abre n8n, ve a "Workflows" -> "Import from File" y selecciona `workflows/agenda/futbol_attendance.json`.

2. **Configurar Credenciales:**
   - **Google Calendar:** Asegúrate de tener configurada la cuenta de Google.
     - Nodo `Get Matches`: Selecciona tu cuenta de Google.
     - Nodo `Add to Shared Calendar`: Selecciona tu cuenta y ajusta el `Calendar ID` del calendario compartido.
   - **Telegram:**
     - Configura las credenciales del Bot de Telegram.
     - Ajusta `ALBERTO_CHAT_ID` y `LAURA_CHAT_ID` en los nodos correspondientes con los Chat IDs reales.
   - **Home Assistant:**
     - Configura la URL base y el Token de Acceso de larga duración (Long-Lived Access Token).

3. **Variables a Ajustar en los Nodos:**
   - **Get Matches:** Verifica que la query "Fútbol" coincida con el nombre de tus eventos.
   - **Ask Alberto:** Verifica el `Chat ID`.
   - **Add to Shared Calendar:** Selecciona el calendario correcto en el dropdown "Calendar".
   - **Notify Laura:** Verifica el `Chat ID`.
   - **Update Home Assistant:**
     - Ajusta la URL `HOME_ASSISTANT_URL`.
     - Ajusta el token `HOME_ASSISTANT_TOKEN`.
     - Verifica que la entidad `input_boolean.alberto_football` (o similar) exista en tu Home Assistant.