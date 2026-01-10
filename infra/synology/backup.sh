#!/bin/bash

# Responsabilidad:
# - Crear backup de la carpeta de datos de n8n
# - Rotar backups antiguos (mantener X días)
# - Notificar éxito/error (opcional)

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/volume1/backups/n8n"
SOURCE_DIR="/volume1/docker/nido/n8n_data"

echo "Iniciando backup n8n - $DATE"

# TODO: Implementar backup real con tar/rsync
# tar -czf $BACKUP_DIR/n8n_backup_$DATE.tar.gz $SOURCE_DIR

echo "Backup finalizado"
