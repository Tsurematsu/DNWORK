/**
 * NOTA DEL DESARROLLADOR:
 * Aquí manejo la preparación del "contrato de datos" que viajará por la red.
 * He centralizado la lógica de creación del payload para que la vista no tenga
 * que preocuparse por formatos de fecha o IDs. Al usar MQTTManager.publishOrder,
 * aseguro que el envío sea asíncrono y no bloquee la interfaz del estudiante.
 */
import MQTTManager from '../../services/mqttManager';

export default class ClientViewController {
  static prepararOrden(fileData, config, delivery) {
    return {
      id: `ord-${Date.now()}`,
      filename: fileData?.name || 'documento.pdf',
      copies: config.copies,
      isColor: config.isColor,
      total: config.total,
      location: `${delivery.building}, Piso ${delivery.floor}, Salón ${delivery.room}`,
      status: 'new',
      estimate: parseInt(localStorage.getItem('dnwork_delivery_time') || '10'),
      timestamp: new Date().toISOString()
    };
  }

  static async enviarOrden(order) {
    try {
      MQTTManager.publishOrder(order);
      return true;
    } catch (error) {
      console.error('Error al enviar la orden:', error);
      return false;
    }
  }

  static escucharActualizaciones(orderId, onUpdate) {
    MQTTManager.connect((data) => {
      if (data.id === orderId) {
        onUpdate(data); // Pasamos el objeto completo, no solo el status
      }
    }, () => {});
  }

  static async finalizarOrden(orderId, currentData) {
    try {
      const completedOrder = {
        ...currentData,
        id: orderId,
        status: 'completed',
        timestamp_completed: new Date().toISOString()
      };
      MQTTManager.publishOrder(completedOrder);
      return true;
    } catch (error) {
      console.error('Error al finalizar la orden:', error);
      return false;
    }
  }
}
