# 📖 Runbook: Synology

Guía operativa para el entorno de producción.

## Despliegue de Cambios

1.  Conectar por SSH al Synology.
2.  Navegar a la carpeta del proyecto: `cd /volume1/docker/nido`.
3.  Actualizar repositorio: `git pull`.
4.  Si hay cambios en infraestructura: `docker-compose up -d`.
5.  Importar workflows actualizados (usando script de importación).

## Backups

- El script `infra/synology/backup.sh` debe ejecutarse diariamente vía Task Scheduler del Synology.
- Copia la base de datos de n8n y los ficheros de configuración clave.
