export interface AdesaoRefeicao {
  id: string;
  refeicaoId: string;
  pacienteId: string;
  data: string;
  concluida: boolean;
  createdAt: string;
}

export interface DailyProgress {
  data: string;
  totalRefeicoes: number;
  concluidas: number;
  percentual: number;
}
