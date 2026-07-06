import { IAdesaoService } from '../../model/services/IAdesaoService';
import { DailyProgress } from '../../model/entities/Adesao';

export class GetDailyProgressUseCase {
  constructor(private adesaoService: IAdesaoService) {}

  async execute(pacienteId: string, data?: string): Promise<DailyProgress> {
    const hoje = data || new Date().toISOString().split('T')[0];
    return this.adesaoService.getDailyProgress(pacienteId, hoje);
  }
}
