export class AuthError extends Error {
  constructor(message: string = 'E-mail ou senha inválidos.') {
    super(message);
    this.name = 'AuthError';
  }
}
