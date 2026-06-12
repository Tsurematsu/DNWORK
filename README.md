# PrintGO / DNWORK - MVP (Delivery de Impresiones Universitarias)

¡Hola! Soy el Desarrollador Senior a cargo de este proyecto. He construido **PrintGO / DNWORK**, una solución interactiva diseñada para resolver la necesidad crítica de movilidad y tiempo de los estudiantes de las Unidades Tecnológicas de Santander (UTS). 

Este README detalla mi visión técnica, las decisiones de arquitectura y el funcionamiento de esta aplicación de "dos caras".

---

## 🚀 La Visión del Proyecto
El objetivo era transformar una idea de negocio en un producto digital funcional antes de la medianoche. La app permite que un estudiante suba un documento desde su salón (ej: Edificio B, Piso 5) y lo reciba impreso en minutos, pagando contra entrega. 

Para lograr esto, he diseñado una **Single Page Application (SPA)** con dos flujos sincronizados en tiempo real:
1.  **Vista Cliente (Estudiante):** Mobile-first, rápida y optimista.
2.  **Vista Negocio (Papelería):** Un tablero Kanban administrativo para gestionar la cola de impresión.

---

## 🌐 Demo en Vivo
Puedes probar la aplicación directamente aquí:  
👉 **[https://dnwork.vercel.app/](https://dnwork.vercel.app/)**

---

## 📸 Visuales del Proyecto

### 📱 Vista del Cliente (Mobile-First)
| Inicio y Configuración | Detalle de Pedido |
| :---: | :---: |
| ![Cliente Dashboard](https://tsurematsu.github.io/DNWORK/screenhost/cliente_dashboard_scroll_0.png) | ![Nuevo Pedido](https://tsurematsu.github.io/DNWORK/screenhost/cliente_nuevoPedido.png) |

### 💻 Vista del Negocio (Panel Administrativo)
| Login Inmersivo | Dashboard Kanban | Gestión de Pedido |
| :---: | :---: | :---: |
| ![Login Admin](https://tsurematsu.github.io/DNWORK/screenhost/damin_login.png) | ![Admin Dashboard](https://tsurematsu.github.io/DNWORK/screenhost/admin_dashboard.png) | ![Gestor Pedido](https://tsurematsu.github.io/DNWORK/screenhost/admin_gestorPedido.png) |

---

## 🏗️ Arquitectura y Patrones de Diseño
He aplicado una **separación estricta de responsabilidades** para garantizar que el código sea mantenible y escalable:

### 1. Patrón Vista-Controlador (VC)
*   **Vistas (`.jsx`):** Son las dueñas del estado de React (`useState`). Su única misión es renderizar la UI y reaccionar a cambios. No contienen lógica matemática ni de red.
*   **Controladores (`-script.js`):** Son clases puras con métodos estáticos. Aquí he encapsulado el cálculo de precios, las validaciones de archivos y la preparación de los mensajes MQTT. Esto permite probar la lógica de negocio sin depender de la interfaz.

### 2. Comunicación Multidifusión (MQTT)
Para conectar al cliente con el negocio sin necesidad de un servidor backend complejo, he implementado un servicio **`MQTTManager`**. 
*   Utiliza el broker público `emqx.io` vía WebSockets.
*   Diseñé un sistema de **múltiples escuchadores (listeners)** para que cualquier componente pueda suscribirse a las actualizaciones de las órdenes sin interferir con otros.

---

## 🛠️ Componentes Clave y su Porqué

### 📂 FileUploaderMock
Como es un MVP, mi lógica simula la carga. Capturo el nombre del archivo real, pero añado un retraso artificial de 1 segundo con un spinner. Esto genera "confianza de procesamiento" en el usuario, una técnica de UX muy común.

### 🧮 ConfiguratorCard
Es el componente más interactivo. Calcula el precio subtotal en vivo ($200 B/N, $1000 Color). Separé esta matemática en su controlador para asegurar precisión total.

### ⏱️ CountdownTimer (Sincronizado)
Este es mi detalle favorito. He creado un contador en reversa dinámico que se muestra tanto al estudiante como al operador. Lo que lo hace especial es que **reacciona a la red**: si el operador ajusta el tiempo estimado en el Dashboard, el reloj del cliente se ajusta automáticamente en su pantalla.

### 📋 StoreDashboard (Kanban)
He implementado un tablero Kanban con **Drag & Drop nativo**. El operador simplemente arrastra las tarjetas para cambiar el estado (Nuevos -> Imprimiendo -> En Camino). Cada movimiento dispara un mensaje MQTT que actualiza la barra de progreso del estudiante.

---

## 🔄 El Flujo de Trabajo (User Flow)

1.  **Pedido:** El estudiante sube su PDF, configura sus copias y pone su ubicación.
2.  **Transmisión:** Al presionar "Hacer Pedido", se publica un JSON estructurado en el broker MQTT.
3.  **Recepción:** El Dashboard del negocio emite un **beep sonoro** (Web Audio API) y muestra la tarjeta en la columna "Nuevos".
4.  **Gestión:** El operador arrastra la tarjeta. El cliente ve cómo su barra de progreso avanza de "Recibido" a "Imprimiendo".
5.  **Entrega:** Cuando el repartidor sale, el operador ajusta el tiempo si es necesario y, finalmente, marca como terminado. El cliente confirma la recepción y la cola se limpia.

---

## 🎨 Estética y Estilo
He mantenido una línea de diseño **Premium Dark Mode**:
*   **Colores:** `zinc-950` para profundidad, `yellow-400` para acentos de alta energía.
*   **Herramientas:** Utilicé **Tailwind CSS v4** (configurado vía CSS con `@theme`) para un rendimiento de estilos superior.
*   **Iconografía:** Google Material Symbols Outlined para un look moderno y limpio.

---

## 📦 Instalación y Ejecución
Para ver el proyecto en acción localmente:

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Generar build de producción
npm run build
```

---

**Nota final:** Este proyecto no es solo código; es una herramienta pensada para funcionar en el caos de una papelería universitaria real. He puesto especial cuidado en que cada interacción se sienta instantánea y fiable.

¡Espero que disfrutes usando PrintGO / DNWORK tanto como yo disfruté construyéndolo! 🚀