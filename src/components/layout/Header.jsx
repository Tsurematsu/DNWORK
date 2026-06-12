export default function Header() {
  return (
    <header className="pt-8 pb-6 px-4 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-yellow-400 text-3xl font-black">print</span>
        <h1 className="text-3xl font-black text-yellow-400 tracking-tighter italic">DNWORK</h1>
      </div>
      <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">Tus fotocopias donde estés</p>
      <div className="w-12 h-1 bg-yellow-400 mt-4 rounded-full opacity-50"></div>
    </header>
  );
}
