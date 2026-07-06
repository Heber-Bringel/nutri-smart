import { IClinicalNoteService } from '../../model/services/IClinicalNoteService';
import { ClinicalNoteError } from '../../model/errors/ClinicalNoteError';

export class DeleteClinicalNoteUseCase {
  constructor(private clinicalNoteService: IClinicalNoteService) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new ClinicalNoteError('ID da anotação é obrigatório.');
    }

    return this.clinicalNoteService.delete(id);
  }
}
