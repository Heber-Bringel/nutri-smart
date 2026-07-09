import { AdesaoRefeicao, DailyProgress } from '../../../model/entities/Adesao';

interface AdesaoRow {
  id: string;
  refeicao_id: string;
  paciente_id: string;
  data: string;
  concluida: boolean;
  created_at: string;
}

interface ProgressRow {
  total: number;
  concluidas: number;
}

export class AdesaoMapper {
  static toDomain(row: AdesaoRow): AdesaoRefeicao {
    return {
      id: row.id,
      refeicaoId: row.refeicao_id,
      data: row.data,
      concluida: row.concluida,
      createdAt: row.created_at,
    };
  }

  static toDailyProgress(data: string, row: ProgressRow): DailyProgress {
    return {
      data,
      totalRefeicoes: row.total,
      concluidas: row.concluidas,
      percentual: row.total > 0 ? Math.round((row.concluidas / row.total) * 100) : 0,
    };
  }
}
