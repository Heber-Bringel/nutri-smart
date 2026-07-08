import { AlimentoBase } from '../../../model/entities/AlimentoBase';

interface AlimentoBaseRow {
  id: string;
  nome: string;
  porcao: number;
  unidade_medida: string;
  calorias: number;
  carboidratos: number;
  proteinas: number;
  gorduras: number;
  nutricionista_id?: string | null;
  created_at: string;
}

export class FoodBaseMapper {
  static toDomain(row: AlimentoBaseRow): AlimentoBase {
    return {
      id: row.id,
      nome: row.nome,
      porcao: row.porcao,
      unidadeMedida: row.unidade_medida,
      calorias: row.calorias,
      carboidratos: row.carboidratos,
      proteinas: row.proteinas,
      gorduras: row.gorduras,
      nutricionistaId: row.nutricionista_id ?? null,
      createdAt: row.created_at,
    };
  }
}
