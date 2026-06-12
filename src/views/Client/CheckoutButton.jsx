import Utils from '../../services/utils-script';

export default function CheckoutButton({ total, isEnabled, onClick }) {
  return (
    <button 
      disabled={!isEnabled}
      onClick={onClick}
      className={`w-full py-5 rounded-2xl flex items-center justify-between px-6 transition-all transform active:scale-[0.98] ${
        isEnabled 
          ? 'bg-yellow-400 text-black shadow-2xl shadow-yellow-400/20' 
          : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
      }`}
    >
      <div className="flex flex-col items-start text-left">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Total del pedido</span>
        <span className="text-xl font-black tracking-tighter leading-none">{Utils.formatCurrency(total)}</span>
      </div>
...

      <div className="flex items-center gap-2">
        <span className="font-black text-sm uppercase tracking-tighter">Hacer Pedido</span>
        <span className="material-symbols-outlined font-black">arrow_forward</span>
      </div>
    </button>
  );
}
