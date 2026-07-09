import { IAdesaoService } from '../../model/services/IAdesaoService';
import { DailyProgress } from '../../model/entities/Adesao';
import { getTodayLocal } from '../../shared/utils/date';

export class GetDailyProgressUseCase {
  constructor(private adesaoService: IAdesaoService) {}

  async execute(pacienteId: string, data?: string): Promise<DailyProgress> {
    const hoje = data || getTodayLocal();
    return this.adesaoService.getDailyProgress(pacienteId, hoje);
  }
}
