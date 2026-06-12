/**
 * NOTA DEL DESARROLLADOR:
 * Este componente es el más interactivo de la rúbrica. He separado la lógica de 
 * cálculo matemático en su controlador (-script.js) para mantener este JSX 
 * limpio y enfocado solo en los estados de 'copies' e 'isColor'. Cada vez que 
 * el usuario toca un botón, notifico al padre mediante 'onConfigChange'.
 */
import { useState, useEffect } from 'react';
import ConfiguratorController from './ConfiguratorCard-script';
import Utils from '../../services/utils-script';

export default function ConfiguratorCard({ onConfigChange }) {
  const [copies, setCopies] = useState(1);
  const [isColor, setIsColor] = useState(false);

  const total = ConfiguratorController.calcularTotal(copies, isColor);

  // Notificar al padre cada vez que cambie la config
  useEffect(() => {
    onConfigChange({ copies, isColor, total });
  }, [copies, isColor, total]);

  const handleUpdateCopies = (val) => {
    setCopies(prev => ConfiguratorController.validarCopias(prev + val));
  };

  return (
    <div className="w-full">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">2. Configura tu impresión</label>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-zinc-50 font-bold text-lg leading-none">Cantidad</h3>
            <p className="text-zinc-500 text-xs mt-1">Número de copias</p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button 
              onClick={() => handleUpdateCopies(-1)}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-zinc-800 text-zinc-400 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="text-xl font-black text-yellow-400 w-8 text-center">{copies}</span>
            <button 
              onClick={() => handleUpdateCopies(1)}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-zinc-800 text-zinc-400 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-zinc-50 font-bold text-lg leading-none">Tipo de impresión</h3>
            <p className="text-zinc-500 text-xs mt-1">{isColor ? 'Color ($1000)' : 'B/N ($200)'}</p>
          </div>
          <button 
            onClick={() => setIsColor(!isColor)}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isColor ? 'bg-yellow-400' : 'bg-zinc-800'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${isColor ? 'left-7 shadow-lg shadow-black/20' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 font-bold uppercase tracking-tighter">Subtotal</span>
          <span className="text-2xl font-black text-yellow-400 tracking-tighter">
            {Utils.formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
