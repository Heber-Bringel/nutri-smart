import { IConsultaRepository } from '../../model/services/IConsultaRepository';
import { Consulta } from '../../model/entities/Consulta';

export class ListConsultasUseCase {
  constructor(private consultaRepository: IConsultaRepository) {}

  async execute(nutricionistaId: string, startDate?: string, endDate?: string): Promise<Consulta[]> {
    return this.consultaRepository.findByNutricionistaId(nutricionistaId, startDate, endDate);
  }
}
