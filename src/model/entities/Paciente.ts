export type SexoBiologico = 'masculino' | 'feminino';

export type NivelAtividadeFisica =
  | 'sedentario'
  | 'levemente_ativo'
  | 'moderadamente_ativo'
  | 'muito_ativo'
  | 'extremamente_ativo';

export interface Paciente {
  id: string;
  nutricionistaId: string;
  usuarioId?: string | null;
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  sexoBiologico: SexoBiologico;
  pesoInicial: number;
  altura: number;
  nivelAtividadeFisica: NivelAtividadeFisica;
  imc?: number;
  tmb?: number;
  get?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
