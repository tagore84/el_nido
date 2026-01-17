# Guía de Escritura de Prompts

Esta guía documenta cómo escribir prompts efectivos para el sistema El Nido y qué variables dinámicas están disponibles para su uso.

## Variables Dinámicas

El sistema permite inyectar información dinámica en el momento de la ejecución. Estas variables se reemplazan automáticamente en el contenido del archivo `prompt.md` antes de ser enviado al LLM.

### Variables Disponibles

| Variable | Descripción | Formato | Ejemplo |
| :--- | :--- | :--- | :--- |
| `{{current_date}}` | La fecha actual del sistema. Útil para cálculos de fechas relativas (ej. "próximo jueves"). | YYYY-MM-DD | `2026-01-16` |

*Nota: Actualmente solo se soportan estas variables. Si necesitas nuevas variables, se deben implementar en el workflow `nido.lib.llm_adapter`.*

## Estructura de un Prompt

Un prompt en El Nido generalmente sigue esta estructura:

1.  **Identidad y Propósito**: Quién es el asistente y qué debe hacer.
2.  **Contexto Dinámico**: Inyección de variables como la fecha.
3.  **Instrucciones**: Reglas paso a paso de extracción o análisis.
4.  **Formato de Salida**: Instrucción explícita de adherirse al esquema JSON.

### Ejemplo

```markdown
Eres un asistente inteligente. Tu tarea es extraer eventos del calendario.

Fecha de hoy: {{current_date}}

Instrucciones:
1. Analiza el texto de entrada.
2. Si menciona "mañana", usa la fecha de hoy + 1 día.
...
```

## Contexto de Entrada (Input)

Además del texto del prompt, el LLM recibe el contenido a procesar en un bloque separado llamado "Input". No necesitas incluir `{{input_text}}` en tu archivo `prompt.md`, ya que el sistema lo adjunta automáticamente al final del mensaje del sistema (o como mensaje de usuario, dependiendo del modelo).

El LLM recibe la información así:

```text
Prompt:
(Tu contenido de prompt.md con variables reemplazadas)

Schema:
(Tu contenido de schema.json)

Input:
(El texto o imagen a procesar)
```
