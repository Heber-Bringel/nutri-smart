import { Paciente, SexoBiologico, NivelAtividadeFisica } from '../entities/Paciente';

export interface CreatePacienteData {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  sexoBiologico: SexoBiologico;
  pesoInicial: number;
  altura: number;
  nivelAtividadeFisica: NivelAtividadeFisica;
}

export interface PacienteFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface IPacienteService {
  create(data: CreatePacienteData): Promise<Paciente>;
  findAll(filters: PacienteFilters): Promise<PaginatedResult<Paciente>>;
  findById(id: string): Promise<Paciente>;
  softDelete(id: string): Promise<void>;
  resendInvite(email: string): Promise<void>;
}
