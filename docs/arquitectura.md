# 🧩 Arquitectura

## Componentes

- **Orquestador**: n8n (Dockerizado).
- **Almacenamiento**: Sistema de ficheros local (Synology) y Git.
- **Red**: Docker network interna para comunicación entre servicios si fuera necesario.

## Entornos

### Desarrollo (Local)
- Enfocado en la velocidad de iteración.
- Datos de prueba.

### Producción (Synology)
- Enfocado en la estabilidad.
- Ejecución programada (Cron) o por Webhooks.
- Backups automáticos de la carpeta de datos de n8n.
