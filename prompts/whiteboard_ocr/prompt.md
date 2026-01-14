# Whiteboard OCR - Calendar Extraction

Extrae TODO el texto de esta pizarra con formato estructurado.

Es un calendario mensual físico (pizarra blanca/magnética).

## Instrucciones

1. **Identifica el MES y AÑO**
   - Busca indicadores visuales (título, encabezado)
   - Si no está claro, deduce del contexto o usa el año actual

2. **Para cada celda con texto:**
   - Extrae la **fecha exacta** en formato `YYYY-MM-DD`
   - Extrae el **texto fielmente** tal como aparece
   - Identifica si hay una **hora explícita** (formato HH:MM)

3. **Consideraciones:**
   - Ignora decoraciones, imanes decorativos sin texto relevante
   - Si hay texto ilegible, indica `[ilegible]`
   - Mantén abreviaturas como aparecen

## Output

Devuelve un JSON ESTRICTAMENTE siguiendo el esquema proporcionado.
