# Guía de Configuración de Telegram para n8n

Esta guía te explicará paso a paso cómo crear un Bot de Telegram, obtener el Token de API necesario para n8n, y averiguar tu Chat ID personal (y el de Laura) para recibir notificaciones.

## 1. Crear el Bot (BotFather)

1.  Abre Telegram y busca a **@BotFather**.
2.  Inicia el chat (clic en "Start" o "Iniciar").
3.  Envía el comando `/newbot`.
4.  BotFather te pedirá un **nombre** para el bot (ej. "Nido Notificaciones"). Esto es lo que ves en la lista de chats.
5.  BotFather te pedirá un **username** para el bot. Debe ser único y terminar en `bot` (ej. `NidoAlbertoLauraBot`).
6.  **¡IMPORTANTE!** BotFather te responderá con un mensaje que contiene tu **HTTP API Token**.
    -   Se verá algo así: `123456789:ABCdefGHIjklMNOpqrsTUVwxYz`.
    -   **Guarda este Token**, es la credencial que pondrás en n8n.

## 2. Configurar Credenciales en n8n

1.  En n8n, ve a **Credentials** -> **New Credential**.
2.  Busca "Telegram API".
3.  Pega el **Access Token** que te dio BotFather.
4.  Dale un nombre (ej. "Mi Bot Telegram") y guarda.

## 3. Obtener tu Chat ID (ID del Usuario)

Para que el bot sepa a *quién* enviar el mensaje, necesitas el ID numérico de tu usuario.

1.  En Telegram, busca a **@userinfobot** (o cualquier bot similar como "IDBot").
2.  Inicia el chat o envía `/start`.
3.  El bot responderá con tu ID (un número como `12345678`).
    -   Este es tu `ALBERTO_CHAT_ID`.
4.  **Repite este paso desde el Telegram de Laura** para obtener su ID.
    -   Ese será el `LAURA_CHAT_ID`.

## 4. ¡Iniciar el Bot! (Paso Crítico)

Para que el bot pueda escribirte, **tú tienes que haberle hablado primero**.

1.  Busca tu nuevo bot en Telegram (por su username, ej. `@NidoAlbertoLauraBot`).
2.  Dale a **Iniciar** (/start).
3.  Dile a Laura que también busque el bot y le dé a **Iniciar**.

> Si no hacéis esto, n8n dará error diciendo que no puede iniciar conversación con el usuario.

## Resumen de Datos Necesarios

| Dato | Dónde se consigue | Dónde se pone en n8n |
| :--- | :--- | :--- |
| **API Token** | @BotFather | Credenciales de Telegram API |
| **Alberto Chat ID** | @userinfobot (desde tu cuenta) | Nodo "Ask Alberto" (Chat ID) |
| **Laura Chat ID** | @userinfobot (desde cuenta de Laura) | Nodo "Notify Laura" (Chat ID) |
