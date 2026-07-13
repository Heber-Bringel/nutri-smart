import { IConsultaRepository } from '../../model/services/IConsultaRepository';
import { ConsultaEventEmitter } from '../../model/services/ConsultaEventEmitter';
import { Consulta } from '../../model/entities/Consulta';
import { AgendaError } from '../../model/errors/AgendaError';

export class CancelConsultaUseCase {
  constructor(
    private consultaRepository: IConsultaRepository,
    private eventEmitter: ConsultaEventEmitter
  ) {}

  async execute(id: string): Promise<Consulta> {
    const consulta = await this.consultaRepository.findById(id);
    if (!consulta) throw new AgendaError('Consulta não encontrada.');
    if (consulta.status === 'cancelada') throw new AgendaError('Consulta já está cancelada.');

    await this.consultaRepository.cancel(id);
    const updated: Consulta = { ...consulta, status: 'cancelada' };
    this.eventEmitter.emit('consulta:cancelada', updated);
    return updated;
  }
}
