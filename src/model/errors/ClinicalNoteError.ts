export class ClinicalNoteError extends Error {
  constructor(message: string = 'Erro ao processar anotação clínica.') {
    super(message);
    this.name = 'ClinicalNoteError';
  }
}
