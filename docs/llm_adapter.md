Plan: Capa LLM desacoplada para desarrollo eficiente en n8n

Objetivo

Permitir el desarrollo, depuración e iteración de workflows que usan LLM sin realizar llamadas reales a modelos en cada ejecución, manteniendo:
	•	Escalabilidad
	•	Bajo coste
	•	Reproducibilidad
	•	Control por entorno (dev / prod)

La solución debe ser centralizada, versionable en Git y transparente para el resto de workflows.

⸻

Principio clave

Ningún workflow llama directamente a un proveedor LLM.

Todas las llamadas pasan por un sub-workflow estándar: llm.call (LLM Adapter).

Esto permite cambiar el comportamiento global (live, replay, mock, cache) sin tocar los workflows funcionales.

⸻

Arquitectura general

[Workflow funcional]
        │
        ▼
[Sub-workflow: llm.call]
        │
        ├─ IF LLM_MODE
        │    ├─ live        → LLM real + grabar cache
        │    ├─ replay      → cache / fixtures
        │    ├─ mock        → mock determinista
        │    └─ cache_only  → error si no hay cache
        │
        ▼
     output + meta


⸻

Modos de ejecución (feature flags)

Controlados mediante variables de entorno (docker-compose / Synology / n8n):

LLM_MODE=live | replay | mock | cache_only

Significado de cada modo

Modo	Uso principal	Comportamiento
live	Producción	Llama al modelo y guarda cache
replay	Desarrollo	Devuelve respuestas grabadas
mock	Desarrollo	Respuestas falsas pero válidas
cache_only	Tests	Falla si no existe cache


⸻

Contrato del sub-workflow llm.call

Inputs

{
  "prompt_id": "classify_image_v3",
  "prompt_version": "v3",
  "inputs": { "text": "..." },
  "options": {
    "model": "gpt-4.1-mini",
    "temperature": 0.2
  },
  "force_refresh": false
}

Outputs

{
  "output": { ... },
  "meta": {
    "prompt_id": "classify_image_v3",
    "prompt_version": "v3",
    "provider": "openai",
    "model": "gpt-4.1-mini",
    "cache_hit": true,
    "hash": "sha256...",
    "timestamp": "2026-01-12T12:00:00Z"
  }
}


⸻

Sistema de cache (record / replay)

Cache key

Clave estable basada en:

sha256(
  prompt_id +
  prompt_version +
  model +
  normalized(inputs)
)

Flujo interno
	1.	Calcular hash
	2.	Buscar en cache
	3.	Si existe → devolver respuesta (REPLAY)
	4.	Si no existe:
	•	cache_only → error explícito
	•	mock → generar mock
	•	live → llamar al modelo y grabar cache

⸻

Backends de cache posibles
	•	n8n Data Store (simple)
	•	Redis (si ya existe)
	•	Sistema de ficheros (recomendado)

Ejemplo:

/storage/llm_cache/
  classify_image_v3/
    <hash>.json


⸻

Mocks deterministas

El modo mock debe devolver:
	•	JSON válido según schema
	•	Siempre igual para el mismo prompt_id
	•	Útil para probar lógica downstream

Ejemplo:

{
  "type": "whiteboard",
  "confidence": 0.92
}


⸻

Prompts y fixtures versionados en Git

Estructura recomendada:

prompts/
  classify_image/
    prompt.md
    schema.json
    fixtures/
      input_01.json
      output_01.json

Ventajas:
	•	Control de versiones
	•	Revisión por PR
	•	Cambiar prompt_version invalida cache automáticamente

⸻

Force refresh (uso controlado)

Permite regenerar una respuesta aunque exista cache:

"force_refresh": true

Solo debe usarse en desarrollo.

⸻

Flujo de trabajo recomendado

Desarrollo
	•	LLM_MODE=replay
	•	Iterar lógica sin coste
	•	Cambiar a live solo para regenerar fixtures

Producción
	•	LLM_MODE=live
	•	Cache activo para coste y latencia

⸻

Beneficios clave
	•	🚫 Cero llamadas LLM durante iteración
	•	💸 Control total de costes
	•	🔁 Reproducibilidad exacta
	•	🧠 Separación clara entre lógica y IA
	•	📦 Arquitectura escalable para nuevos casos

⸻

Próximos pasos
	1.	Crear sub-workflow llm.call
	2.	Definir estructura prompts/ en el repo
	3.	Implementar cache en /storage
	4.	Migrar workflows existentes al adapter

⸻

Estado objetivo: desarrollo rápido, barato y predecible, con IA tratada como una dependencia controlada y no como un efecto colateral.