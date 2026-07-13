import { IConsultaRepository } from '../../model/services/IConsultaRepository';
import { IAgendamentoValidator } from '../../model/services/IAgendamentoValidator';
import { ConsultaEventEmitter } from '../../model/services/ConsultaEventEmitter';
import { UpdateConsultaData, Consulta } from '../../model/entities/Consulta';
import { AgendaError } from '../../model/errors/AgendaError';

export class UpdateConsultaUseCase {
  constructor(
    private consultaRepository: IConsultaRepository,
    private validator: IAgendamentoValidator,
    private eventEmitter: ConsultaEventEmitter
  ) {}

  async execute(id: string, data: UpdateConsultaData): Promise<Consulta> {
    const existing = await this.consultaRepository.findById(id);
    if (!existing) throw new AgendaError('Consulta não encontrada.');
    if (existing.status === 'cancelada') throw new AgendaError('Não é possível alterar uma consulta cancelada.');

    const allOnDate = await this.consultaRepository.findByNutricionistaId(
      existing.nutricionistaId,
      data.data || existing.data,
      data.data || existing.data
    );

    // Consultas canceladas liberam o horário e não devem gerar conflito.
    const ativas = allOnDate.filter(c => c.status !== 'cancelada');

    await this.validator.validateUpdate(id, data, ativas);

    const updated = await this.consultaRepository.update(id, data);
    this.eventEmitter.emit('consulta:atualizada', updated);
    return updated;
  }
}
