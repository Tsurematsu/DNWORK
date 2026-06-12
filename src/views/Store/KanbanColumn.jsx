import OrderCard from './OrderCard';

export default function KanbanColumn({ title, status, icon, orders, onDrop, onDragOver }) {
  const columnOrders = orders.filter(order => order.status === status);

  return (
    <div 
      className="flex flex-col h-full bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-yellow-400">{icon}</span>
          <h2 className="font-black text-zinc-50 uppercase tracking-tighter italic">{title}</h2>
        </div>
        <span className="bg-zinc-800 text-zinc-400 text-xs font-black px-2 py-1 rounded-md">
          {columnOrders.length}
        </span>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {columnOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-zinc-800 rounded-2xl p-8">
            <span className="material-symbols-outlined text-5xl mb-2">inventory_2</span>
            <p className="text-xs font-bold uppercase tracking-widest">Sin pedidos</p>
          </div>
        ) : (
          columnOrders.map(order => (
            <OrderCard key={order.id} order={order} onUpdateOrder={(updated) => onDrop(null, updated.status, updated)} />
          ))
        )}
      </div>
    </div>
  );
}
