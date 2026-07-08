import { IConsultaRepository } from '../../model/services/IConsultaRepository';
import { Consulta } from '../../model/entities/Consulta';

export class GetNextConsultaUseCase {
  constructor(private consultaRepository: IConsultaRepository) {}

  async execute(pacienteId: string): Promise<Consulta | null> {
    return this.consultaRepository.findNextByPacienteId(pacienteId);
  }
}
