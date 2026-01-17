# Caso de Uso: Gestión Integral de Compra, Inventario y Comidas – El Nido

## 1. Objetivo

Diseñar un sistema integrado que permita:
- Gestionar el inventario doméstico de productos habituales.
- Automatizar la lista de la compra.
- Proponer comidas diarias basadas en los productos disponibles.
- Registrar qué se come (en casa, a domicilio o en restaurantes).
- Estimar y analizar el gasto en alimentación.
- Diferenciar el consumo entre Alberto, Laura o ambos.

El sistema se apoya en Home Assistant como interfaz de estado y control, n8n como motor de automatización e inteligencia, y Telegram / Notion como canales de entrada y visualización.

## 2. Componentes del Sistema

### 2.1 Home Assistant
Fuente de verdad del estado del inventario y capa de interacción rápida mediante dashboards, botones y sensores.

### 2.2 n8n
Orquestación de flujos, OCR, clasificación, lógica de negocio, llamadas a LLMs e integraciones externas.

### 2.3 Canales de Entrada
- Telegram (tres chats diferenciados)
- Home Assistant
- Notion
- Fotos de tickets y pantallazos

## 3. Inventario Doméstico
Catálogo base versionado en Git con productos habituales, precios estimados y reglas de reposición.

## 4. Flujo 1 – Reposición Automática tras la Compra
Procesamiento de tickets físicos u online para actualizar automáticamente el inventario y la lista de la compra.

## 5. Flujo 2 – Propuesta Inteligente de Comidas
Propuestas diarias de comidas basadas en el inventario disponible y estimación de costes.

## 6. Flujo 3 – Confirmación de Comida
Selección explícita de la comida realizada y registro histórico.

## 7. Flujo 4 – Comida a Domicilio (Glovo)
OCR de pedidos, asociación por persona y registro de gasto real.

## 8. Flujo 5 – Comidas en Restaurante
Procesamiento de tickets de restaurantes con desglose por persona.

## 9. Estimación de Coste de Comidas Caseras
Cálculo aproximado a partir de precios de ingredientes y reglas de consumo.

## 10. Analítica y Reporting
Informes semanales y mensuales de gasto, hábitos y distribución del consumo.

## 11. Beneficios Clave
Reducción de fricción diaria, control de gasto y sistema extensible y versionado.

## 12. Futuras Extensiones
Nutrición, optimización de compra, predicción de consumo e integración con supermercados.

## 13. Encaje en la Arquitectura El Nido
Prompts, catálogos y flujos versionados, Home Assistant como estado y n8n como cerebro.
