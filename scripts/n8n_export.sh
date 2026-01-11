#!/bin/bash
# Export all workflows from n8n container to the mounted local directory

echo "Exporting workflows from n8n-dev..."
docker exec -u node n8n-dev n8n export:workflow --all --output=/data/workflows/

echo "Export complete."
