import { IAdesaoService } from '../../model/services/IAdesaoService';
import { AdesaoRefeicao } from '../../model/entities/Adesao';
import { AdesaoError } from '../../model/errors/AdesaoError';

export class MarkMealAsCompletedUseCase {
  constructor(private adesaoService: IAdesaoService) {}

  async execute(refeicaoId: string, pacienteId: string, concluida: boolean): Promise<AdesaoRefeicao> {
    if (!refeicaoId || !pacienteId) {
      throw new AdesaoError('Refeição e paciente são obrigatórios.');
    }

    return this.adesaoService.markAsCompleted(refeicaoId, pacienteId, concluida);
  }
}
