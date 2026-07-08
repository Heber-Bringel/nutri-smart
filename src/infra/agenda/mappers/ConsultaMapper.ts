import { Consulta } from '../../../model/entities/Consulta';

interface ConsultaRow {
  id: string;
  nutricionista_id: string;
  paciente_id: string;
  paciente_nome?: string;
  data: string;
  horario_inicio: string;
  duracao_minutos: number;
  horario_fim: string;
  status: string;
  observacoes?: string | null;
  created_at: string;
  updated_at: string;
}

export class ConsultaMapper {
  static toDomain(row: ConsultaRow): Consulta {
    return {
      id: row.id,
      nutricionistaId: row.nutricionista_id,
      pacienteId: row.paciente_id,
      pacienteNome: row.paciente_nome,
      data: row.data,
      horarioInicio: row.horario_inicio,
      duracaoMinutos: row.duracao_minutos,
      horarioFim: row.horario_fim,
      status: row.status as Consulta['status'],
      observacoes: row.observacoes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
