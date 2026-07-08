import { IClinicalNoteService } from '../../model/services/IClinicalNoteService';
import { ClinicalNote } from '../../model/entities/ClinicalNote';

export class ListClinicalNotesUseCase {
  constructor(private clinicalNoteService: IClinicalNoteService) {}

  async execute(pacienteId: string): Promise<ClinicalNote[]> {
    return this.clinicalNoteService.findByPatientId(pacienteId);
  }
}
