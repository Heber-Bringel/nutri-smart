export class PacienteError extends Error {
  constructor(message: string = 'Erro ao processar paciente.') {
    super(message);
    this.name = 'PacienteError';
  }
}
