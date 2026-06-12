export default function Button({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) {
  const baseStyles = "font-black py-4 px-6 rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg";
  
  const variants = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-500 shadow-yellow-400/10",
    secondary: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 shadow-black/20",
    outline: "bg-transparent border border-zinc-800 text-zinc-400 hover:border-zinc-700"
  };

  const disabledStyles = "opacity-50 cursor-not-allowed grayscale";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : ''} ${className}`}
    >
      {children}
    </button>
  );
}
