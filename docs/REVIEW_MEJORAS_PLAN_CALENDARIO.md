# Review & Improvement Notes – Calendar Web View (El Nido)

Este documento recoge las observaciones y recomendaciones de mejora sobre el **plan de implementación actual** para la vista web de calendario integrada en Home Assistant, basada en n8n + frontend HTML.

El objetivo es reforzar **robustez**, **seguridad**, **eficiencia operativa** y **experiencia de usuario**, manteniendo la simplicidad del diseño.

---

## 1. Estrategia de refresco del frontend

### Situación actual en el plan
- Auto-refresh del frontend **cada minuto** para detectar actualizaciones del JSON cacheado.

### Problemas detectados
- Tráfico innecesario (especialmente en wallpanels siempre encendidos).
- No alinea con el requisito funcional real (“actualiza cada hora + botón manual”).
- Carga continua sin valor añadido en la mayoría de los casos.

### Recomendación
- Cambiar a una de estas opciones:
  - **Opción A (recomendada):**
    - Refresco al cargar la página.
    - Refresco manual mediante botón.
    - Refresco automático cada **60 minutos**.
  - **Opción B (más avanzada):**
    - Usar `ETag` o `Last-Modified` en el endpoint `/api/events`.
    - El frontend refresca solo si el contenido ha cambiado.
- Evitar refrescos por debajo de 5–10 minutos salvo necesidad real.

---

## 2. Separación explícita de endpoints (`/api/events` y `/api/update`)

### Situación actual en el plan
- El frontend lee directamente `data/events.json`.
- El botón llama a `/api/update` (proxy a n8n).

### Riesgos
- Acoplamiento fuerte entre frontend y estructura de ficheros.
- Menor flexibilidad para cambiar backend o ubicación del cache.
- Difícil añadir headers HTTP (cache, seguridad, observabilidad).

### Recomendación
Definir claramente dos endpoints lógicos:

- `GET /api/events`
  - Devuelve el JSON de eventos.
  - Internamente puede leer `events.json`.
  - Permite añadir:
    - `Cache-Control`
    - `ETag`
    - `Last-Modified`

- `POST /api/update`
  - Dispara el workflow de n8n.
  - Devuelve estado simple (`ok`, `error`).

---

## 3. Seguridad del endpoint de actualización

### Situación actual en el plan
- Dashboard accesible sin login en red local.
- Endpoint `/api/update` sin protección explícita.

### Riesgos
- Cualquier dispositivo en la LAN podría disparar el refresh.
- Futuro riesgo si se expone mediante túnel (Tailscale, Nginx, etc.).
- Posible spam accidental o loops.

### Recomendación mínima
- Proteger `/api/update` con:
  - Token por query (`?token=...`) **o**
  - Header `X-API-KEY`.
- Validar el token en n8n antes de ejecutar el workflow.
- (Opcional) Rate limit en Nginx solo para `/api/update`.

---

## 4. Ventana temporal de eventos demasiado corta

### Situación actual en el plan
- Cache de eventos limitada a **30 días futuros**.

### Limitaciones
- Navegación a meses siguientes vacía.
- Menor utilidad como “calendario” real.
- No encaja bien con vistas mensuales.

### Recomendación
- Cachear:
  - **+90 a +180 días** hacia adelante.
  - **–7 a –30 días** hacia atrás (contexto).

---

## 5. Representación visual: agenda vs calendario real

### Situación actual en el plan
- Renderizado de eventos “agrupados por día” (agenda).

### Observación
- Funciona como listado, pero no como calendario completo.
- No permite navegación natural mes/semana/día.
- Menor valor visual en dashboard.

### Recomendación
- Usar una librería de calendario madura (ej. FullCalendar):
  - Vistas: mes / semana / día / lista.
  - Soporte nativo para:
    - eventos all-day,
    - timezones,
    - navegación.

---

## 6. Ubicación del frontend (Nginx vs Home Assistant)

### Situación actual en el plan
- Frontend servido desde un contenedor Nginx en Synology.

### Recomendación
- Mantener **Nginx en Synology** si ya existe para este propósito.
- Formalizar `/api/events` y `/api/update` para claridad.

---

## 7. Escritura atómica del fichero de cache

### Riesgo
- Lectura del fichero mientras se está escribiendo.

### Recomendación
- Escribir primero `events.json.tmp`.
- Renombrar a `events.json` al finalizar.

---

## 8. Esquema del JSON de eventos

### Recomendación
Definir un esquema claro y estable, por ejemplo:

```json
{
  "generated_at": "2026-01-24T11:00:00+01:00",
  "total_events": 42,
  "calendars": ["Personal", "Trabajo"],
  "events": []
}
```

---

## 9. Timezone y coherencia temporal

### Recomendación
- Forzar `Europe/Madrid` en n8n y frontend.
- Guardar fechas en ISO 8601 con offset.

---

## 10. Observabilidad básica en la UI

### Recomendación
Mostrar:
- Última actualización.
- Número de eventos.
- Estado del último refresh manual.

---

## Conclusión

El plan actual es correcto como MVP, pero estos ajustes mejoran seguridad, eficiencia y experiencia de usuario, y dejan el sistema preparado para crecer sin refactor grande.
