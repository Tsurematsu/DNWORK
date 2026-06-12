import { useState } from 'react';

export default function DeliveryForm({ onDeliveryChange }) {
  const [formData, setFormData] = useState({ building: '', floor: '', room: '' });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDeliveryChange(newData);
  };

  return (
    <div className="w-full">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">3. Ubicación de entrega</label>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-1 block">Edificio / Bloque</label>
          <input 
            type="text" 
            placeholder="Ej: Edificio B"
            value={formData.building}
            onChange={(e) => handleChange('building', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-50 p-3 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all placeholder:text-zinc-700 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-1 block">Piso</label>
            <input 
              type="text" 
              placeholder="Ej: 5"
              value={formData.floor}
              onChange={(e) => handleChange('floor', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-50 p-3 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all placeholder:text-zinc-700 font-medium"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider mb-1 block">Salón / Oficina</label>
            <input 
              type="text" 
              placeholder="Ej: 512"
              value={formData.room}
              onChange={(e) => handleChange('room', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-50 p-3 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all placeholder:text-zinc-700 font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
