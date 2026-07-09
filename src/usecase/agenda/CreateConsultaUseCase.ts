import { IConsultaRepository } from '../../model/services/IConsultaRepository';
import { IAgendamentoValidator } from '../../model/services/IAgendamentoValidator';
import { ConsultaEventEmitter } from '../../model/services/ConsultaEventEmitter';
import { CreateConsultaData, Consulta } from '../../model/entities/Consulta';
import { AgendaError } from '../../model/errors/AgendaError';

export class CreateConsultaUseCase {
  constructor(
    private consultaRepository: IConsultaRepository,
    private validator: IAgendamentoValidator,
    private eventEmitter: ConsultaEventEmitter
  ) {}

  async execute(data: CreateConsultaData): Promise<Consulta> {
    if (!data.nutricionistaId || !data.pacienteId || !data.data || !data.horarioInicio) {
      throw new AgendaError('Preencha todos os campos obrigatórios.');
    }

    const existing = await this.consultaRepository.findByNutricionistaId(
      data.nutricionistaId, data.data, data.data
    );

    await this.validator.validateCreate(data, existing);

    const consulta = await this.consultaRepository.create(data);
    this.eventEmitter.emit('consulta:criada', consulta);
    return consulta;
  }
}
