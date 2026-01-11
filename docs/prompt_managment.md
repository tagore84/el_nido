El Nido – Gestión de prompts

Este documento define cómo encajan los prompts en la arquitectura de El Nido, cómo deben almacenarse, versionarse y cómo hacerlos accesibles desde n8n de forma limpia, auditable y escalable.

⸻

1. Principio fundamental

En El Nido, los prompts son código.

Esto implica:
	•	Viven en el repositorio Git
	•	Tienen versión explícita
	•	No se hardcodean dentro de workflows n8n
	•	Son auditables y reproducibles
	•	Se pueden hacer rollbacks sin tocar lógica

Este enfoque evita deuda técnica y permite que el sistema crezca durante años.

⸻

2. Dónde encajan los prompts en la arquitectura

Los prompts forman parte de la capa de interpretación / IA, situada entre la entrada de datos y la lógica de dominio.

Ejemplos:
	•	nido.router.photo → prompts de clasificación de imagen
	•	nido.whiteboard.ingest → prompts de extracción estructurada
	•	nido.whiteboard.review → prompts de resumen o reformulación (futuro)
	•	futuros casos: tickets, documentos, inventario, etc.

Regla clave:

Un workflow consume prompts, pero no los define.

⸻

3. Estructura recomendada del repositorio

el_nido/
├─ prompts/
│  ├─ README.md
│  ├─ registry.json
│  ├─ router/
│  │  ├─ classify_photo_v1.txt
│  │  └─ classify_photo_v1.schema.json
│  ├─ whiteboard/
│  │  ├─ extract_calendar_v1.txt
│  │  ├─ extract_calendar_v1.schema.json
│  │  └─ normalize_entries_v1.txt
│  └─ shared/
│     └─ style_rules.md
├─ n8n/
│  └─ workflows/
├─ data/
├─ infra/
└─ storage/   # runtime, fuera de git

Convenciones
	•	snake_case
	•	Sufijo de versión explícito: _v1, _v2, …
	•	Nunca modificar un prompt en producción: crear nueva versión

⸻

4. Prompt registry (pieza clave)

Archivo: prompts/registry.json

{
  "router.classify_photo": {
    "current": "router/classify_photo_v1.txt"
  },
  "whiteboard.extract_calendar": {
    "current": "whiteboard/extract_calendar_v1.txt"
  }
}

Ventajas:
	•	Los workflows no dependen de rutas concretas
	•	Cambiar de versión es un único commit
	•	Permite rollback inmediato

⸻

5. Acceso a prompts desde n8n

Montaje del directorio (Docker)

El directorio prompts/ debe montarse en el contenedor de n8n como read-only.

Ruta recomendada dentro del contenedor:

/opt/el_nido/prompts

Esto garantiza:
	•	Control por Git
	•	Inmutabilidad en runtime
	•	Despliegues reproducibles

⸻

6. Patrón de uso en workflows n8n

Patrón estándar:
	1.	Leer registry.json
	2.	Resolver el path del prompt actual
	3.	Leer el fichero de prompt
	4.	Convertir a texto
	5.	(Opcional) interpolar variables
	6.	Enviar al nodo LLM

Este patrón debe repetirse en todos los workflows que usen IA.

⸻

7. Versionado y despliegue

Opción recomendada (simple)
	•	Repo clonado en Synology
	•	git pull para actualizar prompts
	•	n8n lee siempre lo desplegado

Opción avanzada
	•	Imagen Docker versionada con prompts incluidos
	•	Rollback por tag

Para El Nido, la opción simple es suficiente al inicio.

⸻

8. Testing de prompts

Recomendación mínima:

prompts/tests/
├─ router/
│  ├─ input_01.jpg
│  └─ expected_01.json
└─ whiteboard/
   ├─ input_01.jpg
   └─ expected_01.json

Cada nueva versión de prompt debe validarse contra ejemplos reales.

⸻

9. Auditoría y trazabilidad (muy importante)

Todo artefacto generado por IA debe incluir:
	•	prompt_id
	•	prompt_file
	•	prompt_version
	•	model

Ejemplo:

{
  "prompt_id": "router.classify_photo",
  "prompt_file": "router/classify_photo_v1.txt",
  "model": "gpt-4o-mini"
}

Esto permite entender decisiones meses después.

⸻

10. Reglas de oro
	•	Los prompts son artefactos de primera clase
	•	Versionar siempre, nunca editar en caliente
	•	El router es puro: clasifica y enruta
	•	El dominio no conoce detalles del prompt
	•	Todo debe ser reproducible

⸻

Estado

✔ Arquitectura definida
✔ Compatible con n8n y Synology
✔ Lista para implementación

Este documento debe considerarse referencia canónica para la gestión de prompts en El Nido.