import { AdesaoRefeicao, DailyProgress } from '../entities/Adesao';

export interface EvolutionChartData {
  data: string;
  peso?: number | null;
  adesaoPercentual: number;
}

export interface IAdesaoService {
  markAsCompleted(refeicaoId: string, pacienteId: string, concluida: boolean, data?: string): Promise<AdesaoRefeicao>;
  getDailyProgress(pacienteId: string, data: string): Promise<DailyProgress>;
  getAdesaoByData(pacienteId: string, data: string): Promise<AdesaoRefeicao[]>;
  getEvolutionChartData(pacienteId: string, dias: number): Promise<EvolutionChartData[]>;
}
