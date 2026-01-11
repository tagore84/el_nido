# Configuración de Google Calendar en n8n

Para conectar n8n con Google Calendar, necesitas configurar credenciales OAuth2 en Google Cloud Console.

## Paso 1: Crear Proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un **Nuevo Proyecto** (ej: `el-nido-n8n`).

## Paso 2: Habilitar API de Google Calendar
1. En el menú de navegación, ve a **APIs y servicios** > **Biblioteca**.
2. Busca "Google Calendar API".
3. Haz clic en **Habilitar**.

## Paso 3: Configurar Pantalla de Consentimiento OAuth
1. Ve a **APIs y servicios** > **Pantalla de consentimiento de OAuth**.
2. Selecciona **Externo** (a menos que tengas una organización de Google Workspace, en cuyo caso usa Interno).
3. Rellena los datos básicos (Nombre de la app, correos).
4. No hace falta añadir alcances (scopes) especiales por ahora, n8n los pedirá.
5. **Importante**: En "Usuarios de prueba", añade tu propia dirección de correo (la que usas para el calendario) si elegiste "Externo" y la app está en modo "Prueba".

## Paso 4: Crear Credenciales OAuth
1. Ve a **APIs y servicios** > **Credenciales**.
2. Haz clic en **Crear credenciales** > **ID de cliente de OAuth**.
3. Tipo de aplicación: **Aplicación web**.
4. Nombre: `n8n Local` (o lo que prefieras).
5. **Orígenes de JavaScript autorizados**:
   - `http://localhost:5678` (para local)
   - `https://tu-dominio-synology.com` (para prod)
6. **URI de redireccionamiento autorizados**:
   - `http://localhost:5678/rest/oauth2-credential/callback`
   - `https://tu-dominio-synology.com/rest/oauth2-credential/callback`
7. Haz clic en **Crear**.
8. **Copia el "ID de cliente" y el "Secreto de cliente"**.

## Paso 5: Configurar en n8n
1. Abre n8n (`http://localhost:5678`).
2. Ve a **Credentials** > **Add Credential**.
3. Busca **Google Calendar OAuth2 API**.
4. Pega el **Client ID** y **Client Secret**.
5. Haz clic en **Sign In with Google** para conectar tu cuenta.
6. Acepta los permisos.
