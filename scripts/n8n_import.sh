#!/bin/bash
# Import all workflows from the mounted local directory to n8n container

echo "Importing workflows to n8n-dev..."
docker exec -u node n8n-dev n8n import:workflow --input=/data/workflows/

echo "Import complete."
