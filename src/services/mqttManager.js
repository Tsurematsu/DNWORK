/**
 * NOTA DEL DESARROLLADOR:
 * He refactorizado este Singleton para que soporte múltiples escuchadores (listeners).
 * Mi lógica anterior solo permitía un callback, lo que causaba que el Cliente o el
 * Negocio dejaran de recibir actualizaciones. Ahora, cualquier componente puede
 * suscribirse y todos serán notificados en tiempo real.
 */
import mqtt from 'mqtt';

const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const TOPIC_PEDIDOS = 'uts/dnwork/pedidos/v1';

export default class MQTTManager {
  static client = null;
  static listeners = new Set();
  static statusListeners = new Set();

  static connect(onMessage, onStatusChange) {
    if (onMessage) this.listeners.add(onMessage);
    if (onStatusChange) this.statusListeners.add(onStatusChange);

    if (this.client) {
      // Si ya está conectado, informamos el estado actual al nuevo listener
      if (onStatusChange) onStatusChange(this.client.connected);
      return;
    }

    console.log('Iniciando conexión Singleton MQTT...');
    this.client = mqtt.connect(BROKER_URL);

    this.client.on('connect', () => {
      console.log('Conectado al Broker EMQX');
      this.statusListeners.forEach(fn => fn(true));
      this.client.subscribe(TOPIC_PEDIDOS);
    });

    this.client.on('message', (topic, message) => {
      if (topic === TOPIC_PEDIDOS) {
        try {
          const order = JSON.parse(message.toString());
          this.listeners.forEach(fn => fn(order));
        } catch (e) {
          console.error('Error parseando mensaje:', e);
        }
      }
    });

    this.client.on('error', () => this.statusListeners.forEach(fn => fn(false)));
    this.client.on('close', () => this.statusListeners.forEach(fn => fn(false)));
  }

  static publishOrder(order) {
    if (!this.client || !this.client.connected) {
      const tempClient = mqtt.connect(BROKER_URL);
      tempClient.on('connect', () => {
        tempClient.publish(TOPIC_PEDIDOS, JSON.stringify(order), { qos: 1 });
        tempClient.end();
      });
      return;
    }
    this.client.publish(TOPIC_PEDIDOS, JSON.stringify(order), { qos: 1 });
  }

  static disconnect() {
    // En una SPA usualmente no queremos desconectar el Singleton
    // pero dejamos el método por si se requiere limpieza profunda
  }
}
