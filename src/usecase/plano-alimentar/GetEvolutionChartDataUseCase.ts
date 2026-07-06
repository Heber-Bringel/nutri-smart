import { IAdesaoService, EvolutionChartData } from '../../model/services/IAdesaoService';

export class GetEvolutionChartDataUseCase {
  constructor(private adesaoService: IAdesaoService) {}

  async execute(pacienteId: string, dias: number = 30): Promise<EvolutionChartData[]> {
    return this.adesaoService.getEvolutionChartData(pacienteId, dias);
  }
}
