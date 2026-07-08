export class AgendaError extends Error {
  constructor(message: string = 'Erro na agenda.') {
    super(message);
    this.name = 'AgendaError';
  }
}

export class ChoqueHorarioError extends AgendaError {
  constructor() {
    super('Já existe uma consulta neste horário.');
    this.name = 'ChoqueHorarioError';
  }
}
