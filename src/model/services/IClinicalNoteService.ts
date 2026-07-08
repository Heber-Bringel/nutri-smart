import { ClinicalNote } from '../entities/ClinicalNote';

export interface CreateClinicalNoteData {
  pacienteId: string;
  dataAtendimento?: string;
  conteudo: string;
}

export interface UpdateClinicalNoteData {
  dataAtendimento?: string;
  conteudo?: string;
}

export interface IClinicalNoteService {
  create(data: CreateClinicalNoteData): Promise<ClinicalNote>;
  findByPatientId(pacienteId: string): Promise<ClinicalNote[]>;
  update(id: string, data: UpdateClinicalNoteData): Promise<ClinicalNote>;
  delete(id: string): Promise<void>;
}
