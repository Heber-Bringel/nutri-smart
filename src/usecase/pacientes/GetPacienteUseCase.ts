import { IPacienteService } from '../../model/services/IPacienteService';
import { Paciente } from '../../model/entities/Paciente';
import { PacienteError } from '../../model/errors/PacienteError';

export class GetPacienteUseCase {
  constructor(private pacienteService: IPacienteService) {}

  async execute(id: string): Promise<Paciente> {
    if (!id) {
      throw new PacienteError('ID do paciente é obrigatório.');
    }

    return this.pacienteService.findById(id);
  }
}
