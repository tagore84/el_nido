El Nido – Digitalización de la pizarra de cocina

Objetivo

Crear un sistema híbrido que permita seguir usando la pizarra física como hasta ahora y, a partir de una foto enviada al bot de Telegram de El Nido, digitalizar su contenido de forma estructurada, con revisión humana mínima y totalmente integrado con n8n.

El sistema debe ser:
	•	Fácil de usar (foto → listo)
	•	Extensible (otros usos futuros de fotos)
	•	Git-friendly
	•	Automatizable (calendario, recordatorios, dashboards)

⸻

Enfoque elegido: Opción C (híbrido)
	•	La pizarra sigue siendo la fuente principal
	•	Se hace una foto (semanal o mensual)
	•	El sistema:
	1.	Clasifica el tipo de imagen
	2.	Si es pizarra → procesa
	3.	Extrae eventos
	4.	Detecta cambios respecto a lo ya digitalizado
	5.	Pide confirmación solo de los diffs

⸻

Arquitectura general

Telegram (foto)
→ n8n webhook público
→ Router de fotos (clasificador)
→ Workflow específico (pizarra)
→ Revisión por Telegram
→ Persistencia en El Nido
→ Automatizaciones (calendario, HA, etc.)

⸻

Workflow A – telegram_photo_router

Propósito

Punto de entrada único para todas las fotos enviadas al bot.

Pasos
	1.	Telegram Trigger (message.photo)
	2.	Descargar la imagen (tamaño máximo)
	3.	Guardar en:

storage/inbox_photos/YYYY/MM/DD/<message_id>.jpg


	4.	Clasificación del tipo de imagen (LLM Vision)
	5.	Switch por image_type
	6.	Enrutado al workflow correspondiente
	7.	Mensaje de confirmación al usuario

Contrato de clasificación (JSON)

{
  "image_type": "whiteboard_calendar",
  "confidence": 0.86,
  "reason": "Cuadrícula mensual con texto a rotulador",
  "routing_hints": {
    "month_hint": "2026-01",
    "contains_grid": true
  }
}

Tipos iniciales
	•	whiteboard_calendar
	•	whiteboard_notes
	•	receipt
	•	document
	•	screenshot
	•	other

Regla:
	•	Si confidence < 0.65 → pedir aclaración al usuario

⸻

Workflow B – whiteboard_ingest

Entrada

Desde el router:
	•	chat_id
	•	message_id
	•	image_path
	•	classifier_output

Pasos
	1.	OCR + comprensión del calendario
	2.	Extracción estructurada:

{
  "month": "2026-01",
  "entries": [
    {"date": "2026-01-22", "text": "Cena con Javi", "time": null},
    {"date": "2026-01-18", "text": "Veterinario Coco 18:30", "time": "18:30"}
  ]
}

	3.	Normalización (texto, horas, tildes)
	4.	Generación de fingerprint estable
	5.	Comparación con último snapshot del mes
	6.	Clasificación de diffs:
	•	nuevos
	•	modificados
	•	posibles borrados
	7.	Guardado del snapshot raw
	8.	Inicio de sesión de revisión

⸻

Workflow C – whiteboard_review_callback

Propósito

Revisión humana mínima vía Telegram (inline buttons).

Acciones por item
	•	✅ Guardar
	•	✏️ Editar
	•	🙈 Ignorar
	•	🗑️ Eliminar (doble confirmación)

Flujo
	•	Cargar sesión
	•	Aplicar acción
	•	Persistir resultado
	•	Avanzar al siguiente item
	•	Mostrar resumen final

⸻

Persistencia de datos

Snapshots (raw OCR)

data/whiteboard_snapshots/2026-01/2026-01-11.json

Diffs

data/whiteboard_diffs/2026-01/2026-01-11.diff.json

Eventos canónicos (YAML por mes)

data/nido_events/2026-01.yaml

Ejemplo:

- id: evt_2026_01_22_cena_con_javi
  date: 2026-01-22
  time: null
  text: "Cena con Javi"
  tags: [social]
  source:
    type: whiteboard
    snapshot: 2026-01-11
  status: confirmed


⸻

Estructura del repositorio

el_nido/
├─ n8n/
│  └─ workflows/
│     ├─ telegram_photo_router.json
│     ├─ whiteboard_ingest.json
│     └─ whiteboard_review_callback.json
├─ data/
│  ├─ whiteboard_snapshots/
│  ├─ whiteboard_diffs/
│  └─ nido_events/
├─ storage/   # runtime, fuera de git
│  └─ inbox_photos/


⸻

Buenas prácticas clave
	•	OCR tolerante a errores (fuzzy matching)
	•	Borrados siempre con confirmación
	•	Clasificación automática de etiquetas (perro, pagos, social…)
	•	Router único para todas las fotos
	•	Workflows especializados desacoplados

⸻

Definition of Done (MVP)
	•	Enviar foto al bot
	•	Clasificación automática
	•	Procesamiento de pizarra
	•	Revisión por Telegram
	•	Eventos persistidos
	•	Vista mensual posible desde datos

⸻

Próximas extensiones naturales
	•	Tickets de compra
	•	Documentos importantes
	•	Nevera / inventario
	•	Resúmenes semanales automáticos
	•	Integración con Home Assistant y Alexa

⸻

Estado: Diseño validado – listo para implementación en n8n