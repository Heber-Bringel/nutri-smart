import { AlimentoBase } from '../entities/AlimentoBase';

export interface CreateCustomFoodData {
  nome: string;
  porcao: number;
  unidadeMedida?: string;
  calorias: number;
  carboidratos: number;
  proteinas: number;
  gorduras: number;
}

export interface IFoodBaseService {
  search(termo: string): Promise<AlimentoBase[]>;
  createCustom(data: CreateCustomFoodData): Promise<AlimentoBase>;
}
