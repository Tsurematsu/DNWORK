export default class OrderCardController {
  static obtenerIcono(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    
    const map = {
      pdf: { emoji: '📄', color: 'bg-red-500/10 text-red-500' },
      doc: { emoji: '📝', color: 'bg-blue-500/10 text-blue-500' },
      docx: { emoji: '📝', color: 'bg-blue-500/10 text-blue-500' },
      ppt: { emoji: '📊', color: 'bg-orange-500/10 text-orange-500' },
      pptx: { emoji: '📊', color: 'bg-orange-500/10 text-orange-500' }
    };

    return map[ext] || { emoji: '📁', color: 'bg-zinc-500/10 text-zinc-500' };
  }
}
