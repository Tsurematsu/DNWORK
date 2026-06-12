/**
 * NOTA DEL DESARROLLADOR:
 * He centralizado el formateo de moneda aquí para evitar inconsistencias.
 * Mi lógica utiliza Intl.NumberFormat para asegurar que los precios se 
 * muestren según el estándar colombiano (COP), lo cual es crucial para 
 * la confianza del cliente en el campus.
 */
export default class Utils {
  static formatCurrency(amount) {
    const formatted = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    return `$ ${formatted} COP`;
  }

  static calculateRemainingTime(timestamp, estimateMinutes) {
    const start = new Date(timestamp).getTime();
    const deadline = start + (estimateMinutes * 60 * 1000);
    const now = new Date().getTime();
    const diff = deadline - now;

    if (diff <= 0) return "00:00";

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
