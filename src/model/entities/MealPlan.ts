export interface Alimento {
  id: string;
  refeicaoId: string;
  nome: string;
  quantidade: number;
  unidadeMedida: string;
  calorias: number;
  carboidratos?: number;
  proteinas?: number;
  gorduras?: number;
}

export interface Refeicao {
  id: string;
  planoAlimentarId: string;
  nome: string;
  ordem: number;
  horarioSugerido?: string | null;
  alimentos: Alimento[];
  totalCalorias?: number;
}

export interface MealPlan {
  id: string;
  pacienteId: string;
  nutricionistaId: string;
  ativo: boolean;
  observacoes?: string | null;
  refeicoes: Refeicao[];
  createdAt: string;
  updatedAt: string;
}
