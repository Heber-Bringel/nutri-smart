import { ClinicalNote } from '../../../model/entities/ClinicalNote';

interface ClinicalNoteRow {
  id: string;
  paciente_id: string;
  nutricionista_id: string;
  data_atendimento: string;
  conteudo: string;
  created_at: string;
  updated_at: string;
}

export class ClinicalNoteMapper {
  static toDomain(row: ClinicalNoteRow): ClinicalNote {
    return {
      id: row.id,
      pacienteId: row.paciente_id,
      nutricionistaId: row.nutricionista_id,
      dataAtendimento: row.data_atendimento,
      conteudo: row.conteudo,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
