🐣 Nido – Organización del Proyecto

Este documento recoge la reflexión y las decisiones base sobre cómo organizar el proyecto Nido a nivel técnico, de desarrollo y de despliegue.

Nido es un proyecto de largo recorrido, vivo, que crecerá con el tiempo. Por ello, la organización inicial es clave para evitar deuda técnica y caos operativo.

⸻

🎯 Requisitos de partida
	1.	Todo debe estar versionado en Git
	2.	El desarrollo se realiza en el IDE Antigravity
	3.	El despliegue se hace en un Synology, donde n8n corre mediante Docker

⸻

🧠 Principio fundamental

Git es la fuente de verdad.
Lo que vive en producción debe poder reconstruirse desde el repositorio.

Nido se diseña como un sistema reproducible, no como un conjunto de clicks en la UI de n8n.

⸻

📦 Qué va a Git y qué no

✅ Versionado en Git
	•	Workflows de n8n (exportados en JSON)
	•	Scripts auxiliares (export, import, validación, diff)
	•	Documentación (README, arquitectura, convenciones)
	•	Infraestructura (docker-compose, ejemplos de .env)
	•	Datos de ejemplo o mock (nunca reales)

❌ Fuera de Git
	•	Secretos (.env reales)
	•	Tokens, API keys
	•	Credenciales internas de n8n
	•	Datos personales reales

⸻

🧩 Arquitectura general
	•	Núcleo: n8n como orquestador
	•	Source of truth: Git
	•	Runtime: Docker
	•	Entornos separados:
	•	Desarrollo local
	•	Producción en Synology

⸻

🏗️ Estructura de repositorio propuesta

nido/
├── README.md
├── docs/
│   ├── arquitectura.md
│   ├── convenciones.md
│   └── runbook-synology.md
│
├── workflows/
│   ├── agenda/
│   │   └── nido.agenda.sync.json
│   ├── coco/
│   │   └── nido.coco.vet_reminder.json
│   └── compra/
│       └── nido.compra.lista.json
│
├── scripts/
│   └── n8n/
│       ├── export_workflows.sh
│       ├── import_workflows.sh
│       ├── sanitize_workflow.py
│       └── diff_workflows.py
│
├── infra/
│   ├── dev/
│   │   ├── docker-compose.yml
│   │   └── .env.example
│   └── synology/
│       ├── docker-compose.yml
│       ├── .env.example
│       └── backup.sh
│
├── data/
│   └── samples/
│
└── .gitignore


⸻

🧠 Source of Truth: decisión clave

✅ Decisión adoptada

Git es la fuente de verdad del sistema.

Esto implica:
	•	Los workflows se editan preferentemente en desarrollo
	•	Se exportan a Git como JSON
	•	Producción se alimenta desde el repo

Editar directamente en producción es una excepción, no la norma.

⸻

🔄 Flujo de trabajo recomendado

Desarrollo
	1.	Levantar n8n en local con Docker (infra/dev)
	2.	Crear o modificar workflows
	3.	Exportar workflows a workflows/
	4.	Sanitizar JSON (IDs, timestamps, datos sensibles)
	5.	Commit en Git

Despliegue
	1.	Pull del repo en Synology
	2.	Importar workflows a n8n producción
	3.	Verificar ejecución
	4.	Backup automático del runtime

⸻

🐳 Docker y entornos

Desarrollo (local)
	•	Docker Compose simple
	•	Datos efímeros o fácilmente reseteables
	•	Velocidad de iteración

Producción (Synology)
	•	Docker Compose estable
	•	Volúmenes persistentes
	•	Backups programados
	•	Secrets gestionados fuera del repo

⸻

🔐 Gestión de secretos
	•	.env.example en Git
	•	.env real:
	•	Local: máquina de desarrollo
	•	Producción: Synology
	•	Nunca versionar secretos reales

⸻

🧩 Convenciones técnicas

Namespaces de workflows

nido.agenda.*
nido.coco.*
nido.compra.*

Firma de mensajes al usuario

Los mensajes visibles al usuario se firman como:

El Nido

Ejemplo:

🐶 El Nido te recuerda que Coco tiene revisión mañana a las 10:00.

⸻

🚀 Objetivo a largo plazo
	•	Reducir carga mental
	•	Centralizar conocimiento del hogar
	•	Evitar olvidos
	•	Automatizar con sentido
	•	Mantener el sistema comprensible incluso tras años

⸻

🪺 Estado del proyecto

🟢 En crecimiento continuo.
Nido no se “termina”: se cuida.

⸻

Nido es la arquitectura.
El Nido es la vida que ocurre dentro.