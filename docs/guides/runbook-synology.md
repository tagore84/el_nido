# Runbook: Despliegue en Synology

Este documento detalla los pasos para desplegar el ecosistema "El Nido" en tu NAS Synology. El despliegue incluye:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **n8n** | 5678 | Motor de automatización y workflows |
| **Nido Web Frontend** | 3005 | Interfaz web para dispositivos |
| **Nido Web Backend** | 8008 | API backend para Nido Web |

> [!NOTE]
> El **Hub Central** (puerto 3000) se gestiona desde un repositorio separado: [synology_hub](https://github.com/tagore84/synology_hub)

## Prerrequisitos
- Acceso SSH al Synology.
- Docker instalado en Synology.
- Git instalado en Synology (o subir archivos manualmente).
- Carpeta `/volume1/docker/` existente.

## Estructura de Directorios
Recomendamos clonar el repositorio en `/volume1/docker/nido`.

```bash
/volume1/docker/nido/
├── apps/
│   └── nido-web/      # Frontend + Backend web
├── data/
├── docs/
├── infra/
│   ├── dev/
│   └── synology/      <-- Aquí ejecutaremos docker-compose
├── prompts/
├── storage/
└── workflows/
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
El archivo `.env` contiene secretos y **no se sube a Git**. Debes crearlo manualmente en el servidor.

1. Navega a la carpeta de infraestructura de producción:
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

### 3. Arrancar todos los servicios
Desde la carpeta `infra/synology`:

```bash
sudo docker-compose up -d --build
```

Esto construirá las imágenes y levantará los 3 servicios:
- `n8n-prod` (puerto 5678)
- `nido-web-frontend` (puerto 3005)
- `nido-web-backend` (puerto 8008)

Para ver los logs:
```bash
sudo docker-compose logs -f
```

Para reiniciar un servicio específico:
```bash
sudo docker-compose restart nido-web-frontend
```

### 4. Configurar Nginx / Reverse Proxy
Tienes dos opciones, dependiendo de cómo ejecutes Nginx:

**Opción A: Usas el Reverse Proxy integrado de Synology (Portal de Inicio de Sesión)**
1. Ve a **Panel de Control** > **Portal de Inicio de Sesión** > **Avanzado** > **Proxy Inverso**.
2. Crea reglas para cada servicio:

| Origen | Destino |
|--------|---------|
| `https://synology.tail69424a.ts.net/` | `http://localhost:3000` (Hub - repo separado) |
| `https://synology.tail69424a.ts.net/n8n/*` | `http://localhost:5678` |
| `https://synology.tail69424a.ts.net/nido/*` | `http://localhost:3005` |
| `https://synology.tail69424a.ts.net/api/*` | `http://localhost:8008` |

3. **Importante**: Para n8n, asegúrate de habilitar "Websocket" en la pestaña de encabezados personalizados.

**Opción B: Usas tu propio contenedor Nginx**
Configura las rutas en tu `nginx.conf` y reinicia:
```bash
docker restart nginx
```

### 5. Verificación
1. Abre `https://synology.tail69424a.ts.net/` - Deberías ver el **Hub Central**
2. Abre `https://synology.tail69424a.ts.net/n8n/` - Deberías ver el login de **n8n**
3. Haz clic en cualquier dispositivo del Hub - Deberías ver **Nido Web**
4. Configura las credenciales de Google Calendar en n8n (con el Client ID/Secret de Prod)

### 6. Troubleshooting

**Los contenedores no arrancan:**
```bash
sudo docker-compose logs <nombre-servicio>
```

**Cambios en el código no se reflejan:**
```bash
sudo docker-compose up -d --build --force-recreate
```

**Reiniciar todo desde cero:**
```bash
sudo docker-compose down
sudo docker-compose up -d --build
```
