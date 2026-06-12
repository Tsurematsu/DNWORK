/**
 * NOTA DEL DESARROLLADOR:
 * Dado que es un MVP, he implementado una simulación de carga. Mi lógica 
 * captura el nombre del archivo real, pero espera 1 segundo con un spinner 
 * para darle al usuario la sensación de que el documento se está procesando 
 * en el servidor de DNWORK.
 */
import { useState } from 'react';
import FileUploaderController from './FileUploaderMock-script';

export default function FileUploaderMock({ onFileSelect }) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setIsUploading(true);
    // Simulamos carga de 1 segundo según requerimiento
    setTimeout(() => {
      setFile(selectedFile);
      setIsUploading(false);
      onFileSelect(selectedFile);
    }, 1000);
  };

  return (
    <div className="w-full">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">1. Sube tu archivo (PDF/DOCX)</label>
      
      <div className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
        file ? 'border-yellow-400/50 bg-yellow-400/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
      }`}>
        <input 
          type="file" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
        />

        {isUploading ? (
          <div className="flex flex-col items-center animate-pulse">
            <span className="material-symbols-outlined text-yellow-400 text-4xl mb-2 animate-spin">sync</span>
            <span className="text-zinc-400 font-bold text-sm">Procesando documento...</span>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-yellow-400/20">
              <span className="material-symbols-outlined text-black text-4xl">description</span>
            </div>
            <span className="text-zinc-50 font-bold text-sm truncate max-w-[200px]">{file.name}</span>
            <span className="text-yellow-400 text-xs mt-1 font-bold uppercase">Listo para imprimir</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-zinc-400 text-3xl">upload_file</span>
            </div>
            <span className="text-zinc-400 font-bold text-sm">Toca para seleccionar archivo</span>
            <span className="text-zinc-600 text-xs mt-1">PDF, Word o PowerPoint</span>
          </div>
        )}
      </div>
    </div>
  );
}
