import { IAdesaoService } from '../../model/services/IAdesaoService';
import { AdesaoRefeicao } from '../../model/entities/Adesao';

export class GetDailyAdesaoStatesUseCase {
  constructor(private adesaoService: IAdesaoService) {}

  async execute(pacienteId: string, data: string): Promise<AdesaoRefeicao[]> {
    return this.adesaoService.getAdesaoByData(pacienteId, data);
  }
}
