import { MealPlan, Refeicao, Alimento } from '../../../model/entities/MealPlan';

interface PlanoRow {
  id: string;
  paciente_id: string;
  nutricionista_id: string;
  ativo: boolean;
  observacoes?: string | null;
  created_at: string;
  updated_at: string;
}

interface RefeicaoRow {
  id: string;
  plano_alimentar_id: string;
  nome: string;
  ordem: number;
  horario_sugerido?: string | null;
  created_at: string;
}

interface AlimentoRow {
  id: string;
  refeicao_id: string;
  nome: string;
  quantidade: number;
  unidade_medida: string;
  calorias: number;
  carboidratos?: number | null;
  proteinas?: number | null;
  gorduras?: number | null;
}

export class MealPlanMapper {
  static toDomain(
    planoRow: PlanoRow,
    refeicoesRows: RefeicaoRow[],
    alimentosRows: AlimentoRow[]
  ): MealPlan {
    const alimentosMap = new Map<string, Alimento[]>();
    for (const a of alimentosRows) {
      const list = alimentosMap.get(a.refeicao_id) || [];
      list.push({
        id: a.id,
        refeicaoId: a.refeicao_id,
        nome: a.nome,
        quantidade: a.quantidade,
        unidadeMedida: a.unidade_medida,
        calorias: a.calorias,
        carboidratos: a.carboidratos ?? undefined,
        proteinas: a.proteinas ?? undefined,
        gorduras: a.gorduras ?? undefined,
      });
      alimentosMap.set(a.refeicao_id, list);
    }

    const refeicoes: Refeicao[] = refeicoesRows.map(r => {
      const alimentos = alimentosMap.get(r.id) || [];
      const totalCalorias = alimentos.reduce((sum, a) => sum + a.calorias, 0);
      return {
        id: r.id,
        planoAlimentarId: r.plano_alimentar_id,
        nome: r.nome,
        ordem: r.ordem,
        horarioSugerido: r.horario_sugerido ?? null,
        alimentos,
        totalCalorias,
      };
    });

    return {
      id: planoRow.id,
      pacienteId: planoRow.paciente_id,
      nutricionistaId: planoRow.nutricionista_id,
      ativo: planoRow.ativo,
      observacoes: planoRow.observacoes ?? null,
      refeicoes,
      createdAt: planoRow.created_at,
      updatedAt: planoRow.updated_at,
    };
  }
}
