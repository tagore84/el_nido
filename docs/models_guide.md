# Modelos de Inteligencia Artificial integrados oficialmente en n8n v2.2.6

Este documento recopila **todos los modelos de IA disponibles mediante integraciones oficiales en n8n (v2.2.6)**, excluyendo llamadas HTTP genéricas. Está orientado a **decisiones de arquitectura**, especialmente para escenarios de routing, fallback, control de coste y calidad.

---

## Tabla de modelos disponibles

| Proveedor | Nombre del modelo | ID del modelo (n8n) | Entradas aceptadas | Salidas aceptadas | Descripción |
|---------|------------------|--------------------|-------------------|------------------|-------------|
| OpenAI | GPT-4 | `gpt-4` / `gpt-4-32k` | Texto | Texto | Modelo de máxima calidad de OpenAI. Razonamiento profundo, seguimiento de instrucciones complejo. Alto coste. |
| OpenAI | GPT-3.5 Turbo | `gpt-3.5-turbo` | Texto | Texto | Modelo rápido y barato. Ideal para chatbots, clasificación, resumen y routing. |
| OpenAI | Text Embeddings | `text-embedding-3-small` / `text-embedding-3-large` | Texto | Vectores | Generación de embeddings para búsqueda semántica y RAG. |
| OpenAI | Whisper | `whisper-1` | Audio | Texto | Transcripción de audio a texto. |
| Azure OpenAI | GPT-4 | `gpt-4` (deployment Azure) | Texto | Texto | GPT-4 en entorno Azure, orientado a enterprise y compliance. |
| Azure OpenAI | GPT-3.5 Turbo | `gpt-35-turbo` | Texto | Texto | GPT-3.5 Turbo en ecosistema Microsoft. |
| Google Vertex AI | Gemini 1.5 Pro | `models/gemini-1.5-pro` | Texto, Imagen | Texto | Modelo multimodal avanzado con contexto largo. |
| Google Vertex AI | Gemini 1.5 Flash | `models/gemini-1.5-flash` | Texto, Imagen | Texto | Rápido y barato, ideal para routing y OCR ligero. |
| Google Vertex AI | Gemini 2.0 (exp) | `models/gemini-2.0-exp` | Texto, Imagen | Texto | Modelo experimental para pruebas. |
| Anthropic | Claude 2 | `claude-2` | Texto | Texto | Excelente para análisis documental y contexto largo. |
| Anthropic | Claude Instant | `claude-instant-1` | Texto | Texto | Versión rápida y económica. |
| Cohere | Command | `command` | Texto | Texto | Buen equilibrio coste/calidad. |
| Cohere | Command-Light | `command-light` | Texto | Texto | Muy barato y rápido para tareas simples. |
| Hugging Face | Inference API | `<model_id>` | Texto, Imagen, Audio | Texto, Imagen, Audio | Acceso a miles de modelos open-source. |
| AWS Bedrock | Titan Text Lite | `amazon.titan-text-lite-v1` | Texto | Texto | Ultra barato, calidad básica. |
| AWS Bedrock | Titan Text Express | `amazon.titan-text-express-v1` | Texto | Texto | Mejor calidad manteniendo bajo coste. |
| AWS Bedrock | Claude 2 | `anthropic.claude-v2` | Texto | Texto | Claude servido desde AWS. |
| Ollama | Llama 2 7B | `llama2` | Texto | Texto | Modelo local open-source ligero. |
| Ollama | Llama 2 13B | `llama2:13b` | Texto | Texto | Buen compromiso calidad/recursos. |
| Ollama | Llama 2 70B | `llama2:70b` | Texto | Texto | Alta calidad local, requiere hardware potente. |
| Ollama | Llama 2 Uncensored | `llama2-uncensored` | Texto | Texto | Variante sin filtros, solo investigación. |

---

## Notas clave para arquitectura en n8n

- Google Vertex AI y Hugging Face usan IDs dinámicos según credenciales.
- Ollama no soporta AI Agent ni tool calling.
- Gemini Flash y modelos nano son ideales para routing.
- Titan Lite y Command-Light destacan en coste ultra bajo.
- Claude sobresale en análisis largo y texto estructurado.

---

## Recomendación estratégica

Diseñar listas ordenadas de modelos por caso de uso (primary → fallback), separando claramente routing, ejecución principal y respaldo barato.
