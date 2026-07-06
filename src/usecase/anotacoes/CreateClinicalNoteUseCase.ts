import { IClinicalNoteService, CreateClinicalNoteData } from '../../model/services/IClinicalNoteService';
import { ClinicalNote } from '../../model/entities/ClinicalNote';
import { ClinicalNoteError } from '../../model/errors/ClinicalNoteError';

export class CreateClinicalNoteUseCase {
  constructor(private clinicalNoteService: IClinicalNoteService) {}

  async execute(data: CreateClinicalNoteData): Promise<ClinicalNote> {
    if (!data.pacienteId) {
      throw new ClinicalNoteError('Paciente é obrigatório.');
    }

    if (!data.conteudo || data.conteudo.trim().length === 0) {
      throw new ClinicalNoteError('O conteúdo da anotação não pode estar vazio.');
    }

    return this.clinicalNoteService.create(data);
  }
}
