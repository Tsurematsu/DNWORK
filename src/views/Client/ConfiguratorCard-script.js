/**
 * NOTA DEL DESARROLLADOR:
 * He definido los precios base como constantes estáticas aquí. Mi objetivo es que
 * si el negocio DNWORK decide cambiar el precio del color, solo haya que editar 
 * un número en este archivo. El método calcularTotal es una función pura, lo 
 * que facilita enormemente las pruebas unitarias.
 */
export default class ConfiguratorController {
  static PRECIO_BN = 200;
  static PRECIO_COLOR = 1000;

  static calcularTotal(copias, esColor) {
    const precioUnitario = esColor ? this.PRECIO_COLOR : this.PRECIO_BN;
    return copias * precioUnitario;
  }

  static validarCopias(valor) {
    if (valor < 1) return 1;
    if (valor > 99) return 99; // Límite razonable
    return valor;
  }
}
