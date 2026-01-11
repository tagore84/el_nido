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
   - Leer el calendario de partidos de fútbol para los próximos 3 días (desde el momento de ejecución).
   - Los viernes por la tarde, mandar mensaje de telegram para Alberto preguntando por su asistencia.
   - Si la respuesta es afirmativa, añadir el evento al calendario compartido con Laura.
   - Laura recibe notificación por Telegram y se genera una notificación visible en el dashboard de Home Assistant.

## Detalles Técnicos y Despliegue

### Archivo del Flujo
El flujo de n8n se encuentra en: `workflows/agenda/futbol_attendance.json`

### Importación y Configuración
1. **Importar en n8n:**
   - **Opción A (Copiar y Pegar - Recomendada):**
     - Abre el archivo `workflows/agenda/futbol_attendance.json` en tu editor de código.
     - Copia todo el contenido (JSON).
     - Ve a tu navegador, abre un nuevo workflow en n8n.
     - Haz clic en el lienzo (canvas) y presiona `Ctrl + V` (o `Cmd + V` en Mac). Los nodos deberían aparecer mágicamente.
   - **Opción B (Importar archivo):**
     - En n8n, busca el menú de workflow (a veces en la esquina superior derecha o izquierda, dependiendo de la versión) -> "Import from File" y selecciona el archivo.

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

     - Verás cómo el flujo continúa en la pantalla de n8n, actualizando el calendario compartido.

### Integración con Home Assistant

1.  **Qué crear en Home Assistant:**
    - Crea un **Helper (Ayudante)** tipo **Fecha y/o Hora**.
    - Ve a Ajustes -> Dispositivos y Servicios -> Ayudantes -> Crear Ayudante -> Fecha y/o Hora.
    - Selecciona **Fecha y hora**.
    - Nombre: `Próximo Fútbol`.
    - ID de entidad resultante: `input_datetime.proximo_futbol`.

2.  **Visualización en Dashboard:**
    - Añade una tarjeta tipo "Entidad" apuntando a `input_datetime.proximo_futbol`.
    - Verás la fecha y hora exacta del partido confirmada.

3.  **Conexión y Seguridad (Token):**
    - **La Mejor Manera:** Usar las credenciales de n8n, no poner el token en texto plano.
    - En n8n, ve a **Credenciales** -> **Crear Nueva**.
    - Busca el tipo **"Header Auth"**.
    - Nombre: `Home Assistant Token`.
    - En el campo **Name** pon: `Authorization`
    - En el campo **Value** pon: `Bearer TUS_LETRAS_DEL_TOKEN` (Importante incluir la palabra "Bearer " con espacio antes del token).
    - En el nodo del flujo, selecciona esta credencial en "Authentication".
1. **Ejecución Manual:**
   - En la parte inferior de la pantalla de n8n, pulsa el botón **"Execute Workflow"**.
   - Esto forzará la ejecución del nodo `Schedule Trigger` inmediatamente.

2. **Verificar Fechas:**
   - Como hemos modificado el nodo `Date Calculation` para buscar desde "Ahora" hasta "Ahora + 3 días", buscará partidos en los próximos días reales.
   - **Tip:** Si no tienes partido real estos días, puedes crear un evento "Fútbol de prueba" en tu calendario para hoy o mañana para ver si lo detecta.

3. **Probar Interacción Telegram:**
   - Si detecta el partido, te llegará el mensaje a Telegram.
   - n8n se quedará "Esperando" (verás el nodo `Wait for Response` con un spinner o estado de ejecución).
   - Pulsa "Yes" en tu Telegram.
   - Verás cómo el flujo continúa en la pantalla de n8n, actualizando el calendario compartido.