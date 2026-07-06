export class PlanoAlimentarError extends Error {
  constructor(message: string = 'Erro ao processar plano alimentar.') {
    super(message);
    this.name = 'PlanoAlimentarError';
  }
}
