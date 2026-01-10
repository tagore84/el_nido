# 🧠 Fundamentos de El Nido

Este documento establece los pilares filosóficos y técnicos del proyecto.

## 1. Source of Truth (Fuente de Verdad)

**Git es la única fuente de verdad.**

- Lo que no está en Git, no existe oficialmente.
- La instancia de producción (Synology) es efímera en configuración: debe poder reconstruirse enteramente desde el repositorio.
- **Prohibido**: Hacer cambios en producción y no llevarlos al repositorio.

## 2. Flujo de Desarrollo

El ciclo de vida de cualquier funcionalidad es:

1.  **Local (Dev)**: Se edita o crea el workflow en la instancia local de n8n.
2.  **Exportación**: Se exporta el workflow a JSON.
3.  **Sanitización**: Se limpian credenciales y IDs específicos de la instancia.
4.  **Commit**: Se sube a Git.
5.  **Despliegue**: Se hace pull en Synology y se importa el workflow.

## 3. Reglas de Oro

- **Secretos fuera**: Nunca comitear `.env` reales, tokens o contraseñas.
- **Reproducibilidad**: Si se borra el contenedor de Docker, el sistema debe levantar igual tras un `docker-compose up` y una importación de workflows.
- **Atomicidad**: Los workflows deben ser pequeños y modulares (ver Convenciones).
