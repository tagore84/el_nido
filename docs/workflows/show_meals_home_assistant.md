# Integración del log de comidas (El Nido) en Home Assistant

Este documento describe **cómo leer un fichero CSV de comidas/cenas alojado en Synology** y **mostrarlo en un dashboard de Home Assistant**, usando **n8n como capa intermedia**.

La solución está pensada para:
- Mantener Home Assistant simple (sin parsear CSV).
- Centralizar la lógica en n8n (donde ya vive El Nido).
- Funcionar correctamente en móvil y wallpanel.

---

## 1. Arquitectura general

```
[ Synology ]
   ├─ CSV (meals.csv)
   └─ n8n
        ├─ Lee CSV
        ├─ Lo transforma a JSON
        └─ Expone Webhook HTTP

[ Home Assistant ]
   ├─ REST sensor (consulta webhook)
   └─ Lovelace dashboard (renderizado)
```

**Idea clave**: Home Assistant **no accede directamente al CSV**. Consume un JSON generado por n8n.

---

## 2. Formato esperado del CSV

Ejemplo de columnas:

```csv
timestamp,date_str,who,type,food,source
2026-01-18T21:15:00,18/01/2026,Alberto,cena,Pizza casera,telegram
```

Campos típicos:
- `timestamp`: ISO 8601 (ordenable)
- `date_str`: fecha legible
- `who`: persona
- `type`: comida / cena
- `food`: descripción
- `source`: origen (telegram, manual, etc.)

---

## 3. Workflow n8n

### 3.1 Requisitos

- El CSV **debe estar bajo un path permitido** por n8n:
  - `/data/...` o `/storage/...`
- Ejemplo recomendado:
  ```
  /storage/meals/meals.csv
  ```

---

### 3.2 Nodos del workflow

1. **Webhook**
   - Método: `GET`
   - Path: `/nido/meals`

2. **Read Binary File**
   - File Path: `/storage/meals/meals.csv`

3. **Code (JavaScript)**
   - Parsea el CSV
   - Ordena por timestamp descendente
   - Limita resultados
   - Genera JSON final

4. **Respond to Webhook**
   - Status: `200`
   - Body: JSON

---

### 3.3 Código del nodo `Code`

```javascript
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const cols = line.split(",").map(c => c.trim());
    const obj = {};
    headers.forEach((h, idx) => obj[h] = cols[idx] ?? "");
    rows.push(obj);
  }
  return rows;
}

const b = $input.first().binary?.data;
if (!b?.data) throw new Error("No binary data found");

const csvText = Buffer.from(b.data, 'base64').toString('utf8');
const items = parseCsv(csvText);

items.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));

const maxItems = 50;
const lastItems = items.slice(0, maxItems);

return [
  {
    json: {
      last: lastItems[0] ?? null,
      items: lastItems,
      total_rows: items.length,
      generated_at: new Date().toISOString(),
    }
  }
];
```

---

### 3.4 Respuesta del webhook

Ejemplo:

```json
{
  "last": {
    "date_str": "18/01/2026",
    "type": "cena",
    "who": "Alberto",
    "food": "Pizza casera"
  },
  "items": [ ... ],
  "total_rows": 123,
  "generated_at": "2026-01-19T10:15:00Z"
}
```

---

## 4. Home Assistant – REST sensor

En `configuration.yaml` (o tu include de sensores):

```yaml
rest:
  - resource: https://TU_N8N_DOMAIN/webhook/nido/meals
    method: GET
    scan_interval: 300
    sensor:
      - name: Nido Meals Log
        value_template: >
          {{ value_json.last.food if value_json.last else 'Sin datos' }}
        json_attributes:
          - last
          - items
          - total_rows
          - generated_at
```

Resultado:
- **Estado del sensor**: última comida
- **Atributos**: lista completa para dashboards

---

## 5. Dashboard Lovelace

### 5.1 Opción simple – Markdown card

```yaml
type: markdown
title: Comidas y cenas (últimas 10)
content: >
  {% set items = state_attr('sensor.nido_meals_log', 'items') or [] %}
  {% if items | length == 0 %}
  Sin datos.
  {% else %}
  {% for it in items[:10] %}
  - **{{ it.date_str }}** ({{ it.type }} · {{ it.who }}): {{ it.food }}
  {% endfor %}
  {% endif %}
```

---

### 5.2 Alternativa

- `custom:flex-table-card` para vista tipo tabla
- Mushroom + chips para última comida
- Timeline si más adelante migras a eventos

---

## 6. Buenas prácticas

- Mantener el CSV pequeño o limitar filas en n8n.
- Usar siempre `timestamp` ISO.
- Centralizar cualquier lógica futura (agrupaciones, estadísticas) en n8n.

---

## 7. Extensiones futuras (El Nido)

- Totales por persona / semana.
- Detección automática de cenas fuera de casa.
- Cruce con calorías o gasto energético.
- Generación de insights diarios en Telegram / dashboard.

---

**Estado**: listo para producción en wallpanel, móvil y desktop.

