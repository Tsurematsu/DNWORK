/**
 * NOTA DEL DESARROLLADOR:
 * He diseñado este login para que sea puramente decorativo pero inmersivo.
 * Mi intención es separar claramente el flujo del cliente del administrativo.
 * Al presionar "Ingresar", delego al controlador para que dispare el cambio 
 * de vista en la SPA.
 */
import MockLoginController from './MockLogin-script';

export default function MockLogin({ onLogin }) {
  const handleSubmit = (e) => {
    MockLoginController.procesarLogin(e, onLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-black text-3xl font-bold">print</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-50 tracking-tighter italic">DNWORK ADMIN</h1>
          <p className="text-zinc-500 text-sm">Panel de Gestión de Pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Usuario</label>
            <input 
              type="text" 
              defaultValue="admin_uts"
              readOnly
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 p-3 rounded-lg outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Contraseña</label>
            <input 
              type="password" 
              defaultValue="••••••••"
              readOnly
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 p-3 rounded-lg outline-none cursor-not-allowed"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl hover:bg-yellow-500 transition-all transform active:scale-[0.98] shadow-lg shadow-yellow-400/10 mt-4"
          >
            INGRESAR AL DASHBOARD
          </button>
        </form>
        
        <p className="text-center text-zinc-600 text-xs mt-6 uppercase tracking-tighter">
          Acceso restringido para personal de papelería
        </p>
      </div>
    </div>
  );
}
