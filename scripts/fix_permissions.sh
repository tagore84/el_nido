#!/bin/bash
# Scripts para arreglar permisos en Synology/Linux
# Ejecutar desde la raíz del proyecto

echo "🔧 Arreglando permisos en 'data' y 'storage'..."

chmod -R 777 data
chmod -R 777 storage

echo "✅ Permisos actualizados a 777 en data/ y storage/."
echo "   Ahora n8n debería poder escribir sin problemas."
