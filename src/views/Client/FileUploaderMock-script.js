export default class FileUploaderController {
  // Lógica para formatear nombres o validar extensiones si fuera necesario
  static validarArchivo(name) {
    const allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];
    const ext = name.split('.').pop().toLowerCase();
    return allowed.includes(ext);
  }
}
