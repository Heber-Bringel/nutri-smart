import { CreateConsultaData, UpdateConsultaData, Consulta } from '../entities/Consulta';

export interface IAgendamentoValidator {
  validateCreate(data: CreateConsultaData, existing: Consulta[]): Promise<void>;
  validateUpdate(id: string, data: UpdateConsultaData, existing: Consulta[]): Promise<void>;
}
