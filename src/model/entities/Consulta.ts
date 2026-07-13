export type ConsultaStatus = 'agendada' | 'realizada' | 'cancelada';

export interface Consulta {
  id: string;
  nutricionistaId: string;
  pacienteId: string;
  pacienteNome?: string;
  data: string;
  horarioInicio: string;
  duracaoMinutos: number;
  horarioFim: string;
  status: ConsultaStatus;
  observacoes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultaData {
  nutricionistaId: string;
  pacienteId: string;
  data: string;
  horarioInicio: string;
  duracaoMinutos: number;
  observacoes?: string | null;
}

export interface UpdateConsultaData {
  data?: string;
  horarioInicio?: string;
  duracaoMinutos?: number;
  observacoes?: string | null;
}
