export class AdesaoError extends Error {
  constructor(message: string = 'Erro ao processar adesão.') {
    super(message);
    this.name = 'AdesaoError';
  }
}
