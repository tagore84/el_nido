# Casos de Uso del Proyecto Nido

Este documento mantiene un registro vivo de los casos de uso implementados, en desarrollo y las ideas para el futuro de **El Nido**.

## ✅ Implementados

Estos casos de uso ya tienen workflows funcionales y están en producción o pruebas activas.

### 1. Gestión de Partidos de Fútbol (`nido.partidos_futbol`)
**Objetivo:** Coordinar la asistencia y aviso a Laura de los partidos de fútbol de Alberto
- **Flujo:** Interacción vía Telegram para confirmar asistencia -> Creación de evento en Google Calendar con los detalles correctos (fecha, hora, lugar).
- **Características:**
    - Manejo de zonas horarias.
    - Confirmación de asistencia.

### 2. Gestión Automática de Fotos (`nido.router.photo`)
**Objetivo:** Router inicial de casos de uso iniciados con una imagen, recibe una imagen por télegram y lanza el caso de uso adecuado en función del tipo de imagen recibida.
- **Flujo:** Recepción de imagen -> Clasificación con LLM (Gemini) -> Enrutado al workflow de destino adecuado
- **Componentes:**
    - `nido.router.photo.json`: Workflow principal de enrutado.
    - `prompts/router_photo_classification`: Prompts para decidir el destino de la imagen.

### 3. Digitalización de Pizarra (`nido.pizarra`)
**Objetivo:** Capturar, procesar y revisar el contenido de la pizarra física del hogar.
- **Flujo:** Foto de la pizarra -> Ingesta y mejora de imagen -> Workflow de revisión (para decidir qué hacer con las notas).
- **Componentes:**
    - `nido.pizarra.ingest.json`: Procesamiento inicial de la imagen.
    - `nido.pizarra.review.json`: Revisión humana o automatizada del contenido.

### 4. Adaptador Central de LLM (`nido.lib`)
**Objetivo:** Abstraer las llamadas a modelos de lenguaje para facilitar el desarrollo y reducir costes/complejidad.
- **Uso:** Utilizado por los workflows de Fotos y Pizarra para interactuar con Gemini.
- **Características:** Caché, selección de modo (live/mock), estandarización de salida.

---

## 🚧 En Diseño / Planificados

Casos de uso mencionados en la arquitectura inicial (`startup.md`) o en desarrollo activo.

### 5. Sincronización de Agenda Familiar (`nido.agenda.sync`)
**Objetivo:** Unificar y sincronizar calendarios familiares para evitar conflictos y mejorar la visibilidad.
- **Estado:** Mencionado en estructura de carpetas (`workflows/agenda/`).
- **Integraciones:** Google Calendar (Alberto, Laura, Compartido).

### 6. Cuidado de Mascota - Coco (`nido.coco`)
**Objetivo:** Gestión de la salud y cuidados de Coco.
- **Casos específicos:**
    - Recordatorios de veterinario (`nido.coco.vet_reminder`).
    - Control de vacunación y desparasitación.
- **Estado:** Mencionado en estructura de carpetas (`workflows/coco/`).

### 7. Lista de la Compra Inteligente (`nido.compra`)
**Objetivo:** Gestión dinámica de la lista de la compra.
- **Casos específicos:**
    - Añadir ítems vía voz/texto (`nido.compra.lista`).
    - Detección de productos recurrentes.
- **Estado:** Mencionado en estructura de carpetas (`workflows/compra/`).

---

## 💡 Ideas Futuras

Ideas para expandir "El Nido" hacia un verdadero asistente del hogar.

### Coche Eléctrico
- **Comprobar cada noche la agenda del día siguiente y la batería del coche para sugerir, para notificar, en caso necesario, que quizás haya que cargar el coche por la noche.

### Organizacion y Finanzas
- **Digitalización de Tickets/Facturas:** Extensión del router de fotos para extraer datos de tickets y añadirlos a una hoja de cálculo o sistema de finanzas (Splitwise/Excel).
- **Gestión de Suscripciones:** Recordatorios de renovación de servicios.

### Hogar y Mantenimiento
- **Registro de Aparatos:** Inventario de electrodomésticos, garantías y manuales (PDFs gestionados por el sistema).
- **Recordatorios de Mantenimiento:** Limpieza de filtros, revisión de caldera, riego de plantas.

### Salud y Bienestar
- **Menú Semanal:** Generación de sugerencias de comidas basadas en preferencias y temporada, conectado con la lista de la compra.
- **Registro Médico:** Archivo de informes médicos simples para la familia.

### Automatización
- **Home Assistant Bridge:** Conectar eventos de n8n con luces o altavoces inteligentes (ej: parpadear luz si hay un recordatorio urgente de Coco).
