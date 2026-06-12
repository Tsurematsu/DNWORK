/**
 * NOTA DEL DESARROLLADOR:
 * En este controlador he implementado dos mejoras críticas: la persistencia 
 * en localStorage para que el operador no pierda datos al recargar, y una 
 * notificación sonora usando la Web Audio API para que el personal de la 
 * papelería sepa de inmediato cuando llega un pedido.
 */
import MQTTManager from '../../services/mqttManager';

export default class StoreDashboardController {
  static iniciarConexionMQTT(setOrders, setIsConnected) {
    // Cargar de localStorage
    const saved = localStorage.getItem('dnwork_orders');
    if (saved) setOrders(JSON.parse(saved));

    MQTTManager.connect(
      (nuevaOrden) => {
        setOrders((prev) => {
          const index = prev.findIndex(o => o.id === nuevaOrden.id);
          let updated;
          
          if (index !== -1) {
            // Si la orden existe, actualizamos su estado (ej: de 'delivering' a 'completed')
            updated = prev.map(o => o.id === nuevaOrden.id ? nuevaOrden : o);
          } else {
            // Si es nueva, la agregamos al inicio
            updated = [nuevaOrden, ...prev];
            this.reproducirNotificacion();
          }
          
          localStorage.setItem('dnwork_orders', JSON.stringify(updated));
          return updated;
        });
      },
      (status) => setIsConnected(status)
    );
  }

  static reproducirNotificacion() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) { console.warn(e); }
  }

  static moverTarjeta(orders, orderId, newStatus) {
    const updatedOrder = orders.find(o => o.id === orderId);
    if (updatedOrder) {
      const orderWithNewStatus = { ...updatedOrder, status: newStatus };
      MQTTManager.publishOrder(orderWithNewStatus); // Notificar al cliente
    }

    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('dnwork_orders', JSON.stringify(updated));
    return updated;
  }

  static actualizarOrdenDirecta(orders, updatedOrder) {
    MQTTManager.publishOrder(updatedOrder); // Sincronizar con cliente
    const updated = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
    localStorage.setItem('dnwork_orders', JSON.stringify(updated));
    return updated;
  }

  static desconectar() {
    MQTTManager.disconnect();
  }
}
