import { Consulta, CreateConsultaData, UpdateConsultaData } from '../entities/Consulta';

export interface IConsultaRepository {
  create(data: CreateConsultaData): Promise<Consulta>;
  update(id: string, data: UpdateConsultaData): Promise<Consulta>;
  cancel(id: string): Promise<void>;
  findById(id: string): Promise<Consulta | null>;
  findByNutricionistaId(nutricionistaId: string, startDate?: string, endDate?: string): Promise<Consulta[]>;
  findNextByPacienteId(pacienteId: string): Promise<Consulta | null>;
  findConflicting(
    nutricionistaId: string,
    data: string,
    horarioInicio: string,
    horarioFim: string,
    excludeId?: string
  ): Promise<Consulta[]>;
}
