import { IPacienteService } from '../../model/services/IPacienteService';
import { PacienteError } from '../../model/errors/PacienteError';

export class DeletePacienteUseCase {
  constructor(private pacienteService: IPacienteService) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new PacienteError('ID do paciente é obrigatório.');
    }

    return this.pacienteService.softDelete(id);
  }
}
