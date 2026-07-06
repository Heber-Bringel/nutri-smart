import { MealPlan, Refeicao, Alimento } from '../entities/MealPlan';

export interface CreateAlimentoData {
  nome: string;
  quantidade: number;
  unidadeMedida?: string;
  calorias: number;
  carboidratos?: number;
  proteinas?: number;
  gorduras?: number;
}

export interface CreateRefeicaoData {
  nome: string;
  ordem: number;
  horarioSugerido?: string | null;
  alimentos: CreateAlimentoData[];
}

export interface CreateMealPlanData {
  pacienteId: string;
  observacoes?: string | null;
  refeicoes: CreateRefeicaoData[];
}

export interface UpdateRefeicaoData {
  id?: string;
  nome: string;
  ordem: number;
  horarioSugerido?: string | null;
  alimentos: CreateAlimentoData[];
}

export interface UpdateMealPlanData {
  observacoes?: string | null;
  refeicoes: UpdateRefeicaoData[];
}

export interface IMealPlanService {
  create(data: CreateMealPlanData): Promise<MealPlan>;
  update(id: string, data: UpdateMealPlanData): Promise<MealPlan>;
  findByPatientId(pacienteId: string): Promise<MealPlan | null>;
  findById(id: string): Promise<MealPlan>;
}
