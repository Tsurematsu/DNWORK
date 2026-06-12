/**
 * NOTA DEL DESARROLLADOR:
 * Para el Dashboard de la papelería, he optado por una estructura de Kanban.
 * He implementado el Drag & Drop nativo de HTML5 para que el operador pueda
 * gestionar pedidos de forma táctil o con mouse. La conexión MQTT se inicia
 * automáticamente al montar el componente para recibir órdenes en vivo.
 */
import { useState, useEffect } from 'react';
import StoreDashboardController from './StoreDashboard-script';
import KanbanColumn from './KanbanColumn';

export default function StoreDashboard() {
  const [orders, setOrders] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState(10); // Tiempo en minutos
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    StoreDashboardController.iniciarConexionMQTT(setOrders, setIsConnected);
    
    // Cargar tiempo de entrega inicial
    const savedTime = localStorage.getItem('dnwork_delivery_time');
    if (savedTime) setDeliveryTime(parseInt(savedTime));

    return () => StoreDashboardController.desconectar();
  }, []);

  const handleUpdateDeliveryTime = (val) => {
    const newTime = Math.max(1, deliveryTime + val);
    setDeliveryTime(newTime);
    localStorage.setItem('dnwork_delivery_time', newTime.toString());
  };

  const handleClearOrders = () => {
    if (confirm('¿Estás seguro de que deseas eliminar TODOS los pedidos?')) {
      setOrders([]);
      localStorage.removeItem('dnwork_orders');
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetStatus, updatedOrderData = null) => {
    let updatedOrders;
    if (updatedOrderData) {
      // Si viene de una actualización directa de la tarjeta (tiempo o botón finalizar)
      updatedOrders = StoreDashboardController.actualizarOrdenDirecta(orders, updatedOrderData);
    } else {
      // Si viene de un evento Drag & Drop real
      const orderId = e.dataTransfer.getData('orderId');
      if (!orderId) return;
      updatedOrders = StoreDashboardController.moverTarjeta(orders, orderId, targetStatus);
    }
    setOrders(updatedOrders);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 flex flex-col overflow-hidden">
      {/* Header del Dashboard */}
      <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-black font-bold">dashboard</span>
          </div>
          <h1 className="text-xl font-black text-zinc-50 tracking-tighter italic uppercase">Panel de Control</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              {isConnected ? 'MQTT Online' : 'Desconectado'}
            </span>
          </div>
        </div>
      </header>

      {/* Tablero Kanban */}
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 p-6 h-[calc(100vh-5rem)] overflow-hidden">
        <KanbanColumn 
          title="Nuevos" 
          status="new" 
          icon="move_to_inbox"
          orders={orders} 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
        <KanbanColumn 
          title="Imprimiendo" 
          status="printing" 
          icon="print"
          orders={orders} 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
        <KanbanColumn 
          title="En Camino" 
          status="delivering" 
          icon="delivery_dining"
          orders={orders} 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      </main>

      {/* PANEL DE DEBUG FLOTANTE */}
      <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ${showDebug ? 'w-64' : 'w-12'}`}>
        {showDebug ? (
          <div className="bg-zinc-900 border-2 border-yellow-400 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Debug Config</h3>
              <button onClick={() => setShowDebug(false)} className="text-zinc-500 hover:text-white">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1">Tiempo de Entrega Global (min)</label>
                <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <button onClick={() => handleUpdateDeliveryTime(-1)} className="text-zinc-400 hover:text-yellow-400">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="text-lg font-black text-white">{deliveryTime}m</span>
                  <button onClick={() => handleUpdateDeliveryTime(1)} className="text-zinc-400 hover:text-yellow-400">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={handleClearOrders}
                className="w-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                LIMPIAR PEDIDOS
              </button>

              <p className="text-[8px] text-zinc-600 leading-tight italic">
                * Este valor es el tiempo por defecto para nuevos pedidos.
              </p>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowDebug(true)}
            className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          >
            <span className="material-symbols-outlined text-black font-black">settings</span>
          </button>
        )}
      </div>
    </div>
  );
}
