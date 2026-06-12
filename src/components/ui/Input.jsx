export default function Input({ label, type = 'text', placeholder, value, onChange, readOnly = false, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block px-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full bg-zinc-950 border border-zinc-800 text-zinc-50 p-3.5 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all placeholder:text-zinc-700 font-medium ${readOnly ? 'cursor-not-allowed opacity-60' : ''}`}
      />
    </div>
  );
}
