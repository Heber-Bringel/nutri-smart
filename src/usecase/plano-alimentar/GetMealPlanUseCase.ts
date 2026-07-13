import { IMealPlanService } from '../../model/services/IMealPlanService';
import { MealPlan } from '../../model/entities/MealPlan';

export class GetMealPlanUseCase {
  constructor(private mealPlanService: IMealPlanService) {}

  async execute(pacienteId: string): Promise<MealPlan | null> {
    return this.mealPlanService.findByPatientId(pacienteId);
  }
}
