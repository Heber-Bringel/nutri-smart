import { IPacienteService, CreatePacienteData } from '../../model/services/IPacienteService';
import { Paciente } from '../../model/entities/Paciente';
import { calcularIdade } from '../../model/calculations/nutricionalCalculations';
import { PacienteError } from '../../model/errors/PacienteError';

export class CreatePacienteUseCase {
  constructor(private pacienteService: IPacienteService) {}

  async execute(data: CreatePacienteData): Promise<Paciente> {
    if (!data.nomeCompleto || !data.email || !data.dataNascimento) {
      throw new PacienteError('Nome, e-mail e data de nascimento são obrigatórios.');
    }

    return this.pacienteService.create(data);
  }
}
