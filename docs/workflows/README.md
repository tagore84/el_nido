# 📚 Documentación de Workflows n8n

Bienvenido a la documentación de los workflows de automatización de Nido. Aquí encontrarás detalles sobre cómo funcionan, se interconectan y se utilizan los diferentes procesos automáticos.

## 🧭 General

- **[Lógica de Enrutado y Arquitectura (routing.md)](./routing.md)**: **¡Empieza aquí!** Explica cómo el "Router Maestro" recibe los mensajes de Telegram, usa IA para entenderlos y los deriva al workflow correspondiente. Incluye un diagrama global.

## 📖 Workflows Específicos

Documentación detallada de procesos concretos:

- **[Gestión de Partidos de Fútbol](./flujo_partidos_futbol.md)**: Cómo funciona el sistema de convocatorias, confirmación de asistencia y gestión de equipos para el fútbol semanal.
- **[Pizarra de Cocina (Whiteboard)](./pizarra_cocina.md)**: El flujo que permite digitalizar eventos escritos a mano en la pizarra de la cocina simplemente enviando una foto.
- **[API de Comidas para Home Assistant](./show_meals_home_assistant.md)**: Documentación técnica sobre cómo exponemos el registro de comidas para que sea visualizable desde el dashboard de Home Assistant.

## 📂 Estructura de Carpetas

Los archivos `.json` de los workflows se encuentran en la carpeta raíz `workflows/` del repositorio.
