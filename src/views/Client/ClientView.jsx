/**
 * NOTA DEL DESARROLLADOR: 
 * Este es el corazón de la experiencia del estudiante. He diseñado esta vista para que sea
 * un flujo lineal "mobile-first". Mi lógica aquí es orquestar los estados de la orden, 
 * el archivo y la ubicación, asegurando que el CheckoutButton solo se active cuando 
 * todo sea válido. Tras el envío, cambio a una "UI Optimista" con barra de progreso 
 * para reducir la ansiedad del usuario mientras espera sus copias.
 */
import { useState } from 'react';
import ClientViewController from './ClientView-script';
import Header from '../../components/layout/Header';
import FileUploaderMock from './FileUploaderMock';
import ConfiguratorCard from './ConfiguratorCard';
import DeliveryForm from './DeliveryForm';
import CheckoutButton from './CheckoutButton';
import CountdownTimer from '../../components/ui/CountdownTimer';

export default function ClientView({ onOrderSuccess }) {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [config, setConfig] = useState({ copies: 1, isColor: false, total: 200 });
  const [delivery, setDelivery] = useState({ building: '', floor: '', room: '' });
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [liveStatus, setLiveStatus] = useState('new'); // 'new', 'printing', 'delivering', 'completed'
  const [liveOrder, setLiveOrder] = useState(null);

  const isFormValid = fileData && delivery.building && delivery.floor && delivery.room;

  const handleOrderSubmit = async () => {
    const order = ClientViewController.prepararOrden(fileData, config, delivery);
    setCurrentOrderId(order.id);
    setLiveOrder(order);
    const success = await ClientViewController.enviarOrden(order);
    if (success) {
      setOrderSuccess(true);
      if (onOrderSuccess) onOrderSuccess();
      // Empezar a escuchar actualizaciones
      ClientViewController.escucharActualizaciones(order.id, (data) => {
        if (typeof data === 'string') {
          setLiveStatus(data);
        } else {
          setLiveStatus(data.status);
          setLiveOrder(data);
        }
      });
    }
  };

  const handleConfirmDelivery = async () => {
    const orderData = { 
      filename: fileData?.name, 
      copies: config.copies, 
      isColor: config.isColor, 
      total: config.total, 
      location: `${delivery.building}, Piso ${delivery.floor}, Salón ${delivery.room}` 
    };
    await ClientViewController.finalizarOrden(currentOrderId, orderData);
    window.location.reload(); // Recargamos para permitir un nuevo pedido
  };

  if (orderSuccess) {
    const estimatedTime = liveOrder?.estimate || 10;
    
    // Mapeo de progreso visual
    const progressWidth = {
      'new': '15%',
      'printing': '50%',
      'delivering': '85%',
      'completed': '100%'
    }[liveStatus] || '10%';

    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500 bg-zinc-950">
        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-yellow-400/40 animate-bounce">
          <span className="material-symbols-outlined text-black text-6xl">delivery_dining</span>
        </div>
        
        <h1 className="text-4xl font-black text-zinc-50 mb-2 tracking-tighter italic">¡EN CAMINO!</h1>
        <p className="text-zinc-400 mb-8 max-w-[280px] mx-auto text-sm">
          {liveStatus === 'new' && 'Hemos recibido tu pedido correctamente.'}
          {liveStatus === 'printing' && '¡Tu documento ya está en la impresora!'}
          {liveStatus === 'delivering' && 'El repartidor ya va hacia tu ubicación.'}
          {liveStatus === 'completed' && '¡Pedido entregado con éxito!'}
        </p>

        {/* Barra de progreso visual DINÁMICA */}
        <div className="w-full bg-zinc-900 h-3 rounded-full mb-4 overflow-hidden border border-zinc-800">
          <div 
            className="bg-yellow-400 h-full transition-all duration-1000 ease-out" 
            style={{ width: progressWidth }}
          ></div>
        </div>
        
        <div className="flex justify-between w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-10 px-1">
          <span className={liveStatus === 'new' ? 'text-yellow-400' : ''}>Recibido</span>
          <span className={liveStatus === 'printing' ? 'text-yellow-400 animate-pulse' : ''}>Imprimiendo</span>
          <span className={liveStatus === 'delivering' ? 'text-yellow-400 animate-bounce' : ''}>En camino</span>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl w-full mb-8">
          <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">Tiempo Estimado</span>
          <div className="flex items-baseline justify-center gap-2">
            <CountdownTimer 
              timestamp={liveOrder?.timestamp} 
              estimate={estimatedTime} 
              className="text-3xl font-black text-yellow-400 tracking-tighter tabular-nums"
            />
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">min</span>
          </div>
        </div>

        <button 
          onClick={handleConfirmDelivery}
          className="w-full bg-green-500 text-white font-black py-4 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 mb-6 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">task_alt</span>
          CONFIRMAR ENTREGA
        </button>

        <button 
          onClick={() => window.location.reload()}
          className="text-zinc-500 font-bold text-xs uppercase tracking-widest hover:text-yellow-400 transition-colors"
        >
          ← Volver al inicio
        </button>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes progress {
            0% { width: 10%; }
            50% { width: 50%; }
            100% { width: 90%; }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto relative min-h-screen pb-32">
      <Header />
      
      <div className="px-4 space-y-6">
        <FileUploaderMock onFileSelect={setFileData} />
        <ConfiguratorCard onConfigChange={setConfig} />
        <DeliveryForm onDeliveryChange={setDelivery} />
      </div>

      <footer className="fixed bottom-0 max-w-md w-full p-4 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/50">
        <CheckoutButton 
          total={config.total} 
          isEnabled={isFormValid} 
          onClick={handleOrderSubmit} 
        />
      </footer>
    </div>
  );
}
