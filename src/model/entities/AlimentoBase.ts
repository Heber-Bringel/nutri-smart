export interface AlimentoBase {
  id: string;
  nome: string;
  porcao: number;
  unidadeMedida: string;
  calorias: number;
  carboidratos: number;
  proteinas: number;
  gorduras: number;
  nutricionistaId?: string | null;
  createdAt: string;
}
