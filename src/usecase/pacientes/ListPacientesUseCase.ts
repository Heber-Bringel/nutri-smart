import { IPacienteService, PacienteFilters } from '../../model/services/IPacienteService';
import { Paciente } from '../../model/entities/Paciente';
import { PaginatedResult } from '../../model/services/IPacienteService';

export class ListPacientesUseCase {
  constructor(private pacienteService: IPacienteService) {}

  async execute(filters: PacienteFilters = {}): Promise<PaginatedResult<Paciente>> {
    return this.pacienteService.findAll(filters);
  }
}
