import { IPacienteService, CreatePacienteData } from '../../model/services/IPacienteService';
import { Paciente } from '../../model/entities/Paciente';
import { PacienteError } from '../../model/errors/PacienteError';

export class UpdatePacienteUseCase {
  constructor(private pacienteService: IPacienteService) {}

  async execute(id: string, data: Partial<CreatePacienteData>): Promise<Paciente> {
    if (!id) {
      throw new PacienteError('ID do paciente é obrigatório.');
    }

    if (data.nomeCompleto !== undefined && !data.nomeCompleto.trim()) {
      throw new PacienteError('Nome é obrigatório.');
    }

    return this.pacienteService.update(id, data);
  }
}
