# Análisis de Referente: Trello y el patrón Drag & Drop

## 1. Verificación del Stack Tecnológico

Para comenzar el análisis, instalé la extensión **Wappalyzer** en mi navegador y abrí la aplicación web de Trello en `trello.com`. Los resultados confirmaron que la interfaz está construida principalmente con **React**, lo cual es evidente también al inspeccionar el árbol de componentes con **React DevTools**, donde se pueden ver componentes con nombres como `BoardComponent`, `ListComponent` y `CardComponent` formando una jerarquía clara. Para la capa de datos, Trello utiliza **GraphQL**, que reemplazó su antigua API REST para permitir consultas más eficientes y específicas desde el cliente.

---

## 2. Descripción de la Interfaz

La interfaz principal de Trello es un **tablero (board)** de desplazamiento horizontal que contiene múltiples **columnas (listas)**. Cada columna representa una etapa o categoría de trabajo —por ejemplo: *Por hacer*, *En progreso*, *Completado*— y dentro de cada una hay **tarjetas (cards)** que representan tareas individuales. El fondo del tablero es configurable, pero la estructura siempre se mantiene: columnas en paralelo, tarjetas apiladas verticalmente dentro de cada una. No existe ninguna navegación a una página distinta para gestionar las tareas; todo ocurre en una sola pantalla, lo que confirma que es una **Single Page Application (SPA)**.

---

## 3. Análisis del Patrón Interactivo

El patrón interactivo central de Trello es el **Drag & Drop** (arrastrar y soltar). Al hacer clic sostenido sobre una tarjeta y moverla hacia otra columna, se desencadena una secuencia precisa de actualizaciones de estado que pude observar directamente en React DevTools:

- **Actualización inmediata del estado local:** En cuanto se suelta la tarjeta, el arreglo de tarjetas de la columna origen pierde ese elemento y el arreglo de la columna destino lo recibe. React detecta el cambio de estado y re-renderiza únicamente los componentes afectados, sin tocar el resto del tablero.

- **Sin recarga de página:** En ningún momento el navegador recarga ni navega a una URL diferente. El comportamiento es completamente fluido y propio de una SPA con gestión de estado en memoria.

- **UI Optimista:** Este es el detalle técnico más importante. Trello aplica el principio de **UI Optimista**: el cambio visual se refleja *instantáneamente* en la pantalla del usuario sin esperar respuesta del servidor. Simultáneamente, en segundo plano, se lanza una mutación GraphQL que persiste el nuevo orden en la base de datos. Si esa petición fallara (por ejemplo, por pérdida de conexión), React revertería la tarjeta a su posición original. Esto garantiza una experiencia de usuario rápida y sin fricciones, aunque la escritura real todavía no haya ocurrido.

En términos de implementación, la librería que usa Trello para esto es **`react-beautiful-dnd`** (detectable en el código fuente), que abstrae los eventos nativos `onDragStart`, `onDragOver` y `onDrop` del HTML5 en una API de React más declarativa.

---

## 4. Relación con el Proyecto DNWORK

Este patrón es exactamente el que implementé en el panel de control del operador en DNWORK. En mi versión, el estado global de pedidos (`orders[]`) vive en `StoreDashboard.jsx`. Cuando el operador arrastra una `OrderCard` de la columna *Nuevos* hacia *Imprimiendo*, el método `moverTarjeta()` del controlador `StoreDashboard-script.js` recibe el arreglo actual, localiza el pedido por su `id` y retorna un nuevo arreglo con el campo `status` actualizado. El `.jsx` toma ese retorno y llama a `setOrders()`, lo que dispara el re-renderizado y mueve la tarjeta visualmente.

La diferencia clave frente a Trello es que mi implementación no necesita persistir en un servidor: el estado vive en memoria y la fuente de verdad de los pedidos llega vía **MQTT** en tiempo real. Donde Trello usa GraphQL para sincronizar con una base de datos, DNWORK usa un broker de mensajería para sincronizar entre el cliente (estudiante) y el negocio (operador), lo cual es una arquitectura distinta pero igualmente reactiva y orientada a eventos.
