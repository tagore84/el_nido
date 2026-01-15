# Runbook: Despliegue en Synology

Este documento detalla los pasos para desplegar el proyecto "El Nido" (n8n) en tu NAS Synology.

## Prerrequisitos
- Acceso SSH al Synology.
- Docker instalado en Synology.
- Git instalado en Synology (o subir archivos manualmente).
- Carpeta `/volume1/docker/` existente.

## Estructura de Directorios
Recomendamos clonar el repositorio en `/volume1/docker/nido`.

```bash
/volume1/docker/nido/
├── docs/
├── infra/
│   ├── dev/
│   └── synology/  <-- Aquí ejecutaremos docker-compose
├── workflows/
├── nginx.conf
└── ...
```

## Guía paso a paso

### 1. Obtener el código
Conéctate por SSH a tu Synology y ve a la carpeta de docker:
```bash
ssh -p 2222 Alberto@10.33.1.23
cd /volume1/docker
```

Si es la primera vez:
```bash
git clone https://github.com/tu-usuario/nido.git nido
```

Si ya existe, actualiza:
```bash
cd nido
git pull origin main
```

### 2. Configurar Variables de Entorno
El archivo `.env` contém secretos y **no se sube a Git**. Debes crearlo manualmente en el servidor.

1. Navega a la carpeta de infraestructura de produccion:
   ```bash
   cd infra/synology
   ```
2. Crea el archivo `.env` (puedes usar `vi`, `nano` o copiarlo desde tu ordenador):
   ```bash
   cp .env.example .env
   vi .env
   ```
3. Asegúrate de que tenga los valores correctos (especialmente `N8N_ENCRYPTION_KEY` y `WEBHOOK_URL`).

### 2.1 Archivos de Mapeo (Configuración Dinámica)
Para evitar "hardcodear" IDs en los workflows y facilitar el cambio entre entornos, utilizamos archivos JSON de mapeo en la carpeta de infraestructura (`infra/synology` o `infra/dev`).

Debes crear (o copiar) estos archivos:

1.  **`credentials_map.json`**: Mapea nombres lógicos a IDs de credenciales de n8n.
    *   Ejemplo: `"GOOGLE_CALENDAR_ALBERTO": "FrzV2bMzBnHfLNY2"`
2.  **`workflows_map.json`**: Mapea nombres de workflows a sus IDs internos de n8n.
    *   Ejemplo: `"nido.lib.llm_adapter": "RNCzRY2bi-VzDmnZiq27S"`
3.  **`telegram_chats_map.json`**: Mapea nombres de contactos/grupos a sus Chat IDs de Telegram.
    *   Ejemplo: `"Nido-Alberto-Laura": "-5223730192"`

### 3. Arrancar n8n
Desde la carpeta `infra/synology`:

```bash
sudo docker-compose up -d
```
Esto descargará la imagen y levantará el contenedor `n8n-prod`.

### 4. Configurar Nginx / Reverse Proxy
Tienes dos opciones, dependiendo de cómo ejecutes Nginx:

**Opción A: Usas el Reverse Proxy integrado de Synology (Portal de Inicio de Sesión)**
1. Ve a **Panel de Control** > **Portal de Inicio de Sesión** > **Avanzado** > **Proxy Inverso**.
2. Crea una regla para `https://synology.tail69424a.ts.net`.
3. Destino: `http://localhost:5678`.
4. **Importante**: Synology UI a veces limita las cabeceras personalizadas. Asegúrate de habilitar "Websocket" en la pestaña de encabezados personalizados.

**Opción B: Usas tu propio contenedor Nginx (con el `nginx.conf` del repo)**
Si tienes un contenedor Nginx que monta el archivo `nginx.conf` de la raíz de este proyecto:
1. Asegúrate de reiniciar Nginx para que pille los cambios recientes (soporte de OAuth y WS).
   ```bash
   # Ejemplo si tu contenedor se llama nginx
   docker restart nginx
   ```

### 5. Verificación
1. Abre `https://synology.tail69424a.ts.net/` en tu navegador.
2. Deberías ver la pantalla de login de n8n.
3. Configura las credenciales de Google Calendar (con el Client ID/Secret de Prod).
