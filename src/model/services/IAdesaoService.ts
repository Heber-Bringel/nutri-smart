import { AdesaoRefeicao, DailyProgress } from '../entities/Adesao';

export interface EvolutionChartData {
  data: string;
  peso?: number | null;
  adesaoPercentual: number;
}

export interface IAdesaoService {
  markAsCompleted(refeicaoId: string, pacienteId: string, concluida: boolean): Promise<AdesaoRefeicao>;
  getDailyProgress(pacienteId: string, data: string): Promise<DailyProgress>;
  getEvolutionChartData(pacienteId: string, dias: number): Promise<EvolutionChartData[]>;
}
