/**
 * NOTA DEL DESARROLLADOR:
 * En esta tarjeta he puesto especial énfasis en la legibilidad rápida.
 * Uso el controlador para determinar qué icono mostrar según la extensión 
 * del archivo. Además, he configurado el 'draggable={true}' para que sea 
 * la pieza móvil dentro de nuestro sistema Kanban.
 */
import OrderCardController from './OrderCard-script';
import Utils from '../../services/utils-script';
import CountdownTimer from '../../components/ui/CountdownTimer';

export default function OrderCard({ order, onUpdateOrder }) {
  const fileInfo = OrderCardController.obtenerIcono(order.filename);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('orderId', order.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const updateEstimate = (val) => {
    const newEstimate = Math.max(1, (order.estimate || 10) + val);
    onUpdateOrder({ ...order, estimate: newEstimate });
  };

  const handleFinalizar = () => {
    onUpdateOrder({ ...order, status: 'completed' });
  };

  return (
    <div 
      draggable={true}
      onDragStart={handleDragStart}
      className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-xl cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${fileInfo.color} rounded-xl flex items-center justify-center text-2xl`}>
          {fileInfo.emoji}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Estimado</span>
          <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
            <button onClick={() => updateEstimate(-1)} className="text-zinc-500 hover:text-yellow-400 text-xs">-</button>
            <span className="text-xs font-black text-yellow-400">{order.estimate || 10}m</span>
            <button onClick={() => updateEstimate(1)} className="text-zinc-500 hover:text-yellow-400 text-xs">+</button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-zinc-50 font-bold text-sm truncate group-hover:text-yellow-400 transition-colors">
          {order.filename}
        </h3>
        <p className="text-zinc-500 text-[11px] font-medium mt-1">
          {order.copies} {order.copies > 1 ? 'copias' : 'copia'} • {order.isColor ? 'Color' : 'B/N'}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
        <span className="material-symbols-outlined text-yellow-400 text-sm">timer</span>
        <CountdownTimer 
          timestamp={order.timestamp} 
          estimate={order.estimate || 10} 
          className="text-[11px] font-black text-zinc-300 tabular-nums"
        />
        <span className="text-[10px] text-zinc-600 font-bold ml-auto uppercase tracking-tighter">Restante</span>
      </div>

      <div className="flex items-center gap-2 mb-4 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
        <span className="material-symbols-outlined text-yellow-400 text-sm">location_on</span>
        <span className="text-[11px] font-bold text-zinc-300 truncate">
          {order.location}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Total Cobrar</span>
          <span className="text-sm font-black text-yellow-400">
            {Utils.formatCurrency(order.total)}
          </span>
        </div>

        {order.status === 'delivering' && (
          <button 
            onClick={handleFinalizar}
            className="w-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black py-2 rounded-lg hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            FINALIZAR PEDIDO
          </button>
        )}
      </div>
    </div>
  );
}
