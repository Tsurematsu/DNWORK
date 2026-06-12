export default class MockLoginController {
  static procesarLogin(e, onSuccess) {
    e.preventDefault();
    // En un MVP real aquí habría validación, pero según fase-flujo-negocio.md:
    // "El controlador intercepta el evento, evita la recarga y ejecuta la función que cambia el estado global"
    console.log('Login simulado exitoso');
    onSuccess();
  }
}
