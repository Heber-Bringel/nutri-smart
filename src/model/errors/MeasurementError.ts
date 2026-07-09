export class MeasurementError extends Error {
  constructor(message: string = 'Erro ao processar medida corporal.') {
    super(message);
    this.name = 'MeasurementError';
  }
}
