#!/bin/bash

# Responsabilidad:
# - Crear backup de la carpeta de datos de n8n
# - Rotar backups antiguos (mantener 7 días)

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_BASE_DIR="/volume1/backups"
BACKUP_DIR="${BACKUP_BASE_DIR}/n8n"
SOURCE_DIR="/volume1/docker/nido/n8n_data"
RETENTION_DAYS=7

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Iniciando backup n8n..."

# Create compressed backup
if tar -czf "$BACKUP_DIR/n8n_backup_$DATE.tar.gz" -C "$(dirname "$SOURCE_DIR")" "$(basename "$SOURCE_DIR")"; then
    echo "[$(date)] Backup creado exitosamente: $BACKUP_DIR/n8n_backup_$DATE.tar.gz"
else
    echo "[$(date)] Error al crear el backup"
    exit 1
fi

# Rotate old backups
echo "[$(date)] Eliminando backups antiguos (>$RETENTION_DAYS días)..."
find "$BACKUP_DIR" -name "n8n_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] Backup finalizado"
