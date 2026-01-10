#!/bin/bash

# Responsabilidad:
# - Obtener todos los workflows de la instancia n8n local
# - Para cada workflow:
#   - Exportar a JSON
#   - Ejecutar sanitize_workflow.py
#   - Guardar en workflows/<namespace>/<name>.json

echo "Exportando workflows..."
# TODO: Implementar lógica de exportación usando n8n API o CLI
