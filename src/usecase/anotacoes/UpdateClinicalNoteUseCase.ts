import { IClinicalNoteService, UpdateClinicalNoteData } from '../../model/services/IClinicalNoteService';
import { ClinicalNote } from '../../model/entities/ClinicalNote';
import { ClinicalNoteError } from '../../model/errors/ClinicalNoteError';

export class UpdateClinicalNoteUseCase {
  constructor(private clinicalNoteService: IClinicalNoteService) {}

  async execute(id: string, data: UpdateClinicalNoteData): Promise<ClinicalNote> {
    if (!id) {
      throw new ClinicalNoteError('ID da anotação é obrigatório.');
    }

    return this.clinicalNoteService.update(id, data);
  }
}
