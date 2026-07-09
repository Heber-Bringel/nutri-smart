import { IMealPlanService, CreateMealPlanData } from '../../model/services/IMealPlanService';
import { MealPlan } from '../../model/entities/MealPlan';
import { PlanoAlimentarError } from '../../model/errors/PlanoAlimentarError';

export class CreateMealPlanUseCase {
  constructor(private mealPlanService: IMealPlanService) {}

  async execute(data: CreateMealPlanData): Promise<MealPlan> {
    if (!data.pacienteId) {
      throw new PlanoAlimentarError('Paciente é obrigatório.');
    }

    if (!data.refeicoes || data.refeicoes.length === 0) {
      throw new PlanoAlimentarError('O plano deve conter pelo menos uma refeição.');
    }

    for (const refeicao of data.refeicoes) {
      if (!refeicao.alimentos || refeicao.alimentos.length === 0) {
        throw new PlanoAlimentarError(`A refeição "${refeicao.nome}" deve conter ao menos um alimento.`);
      }
    }

    return this.mealPlanService.create(data);
  }
}
