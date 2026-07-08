import { Paciente } from '../../../model/entities/Paciente';

interface PacienteRow {
  id: string;
  nutricionista_id: string;
  usuario_id?: string | null;
  nome_completo: string;
  email?: string | null;
  data_nascimento: string;
  sexo_biologico: string;
  peso_inicial: number;
  altura: number;
  nivel_atividade_fisica: string;
  imc?: number | null;
  tmb?: number | null;
  get?: number | null;
  plano_ativo?: boolean | null;
  ultimo_atendimento?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export class PacienteMapper {
  static toDomain(row: PacienteRow): Paciente {
    return {
      id: row.id,
      nutricionistaId: row.nutricionista_id,
      usuarioId: row.usuario_id ?? null,
      nomeCompleto: row.nome_completo,
      email: row.email ?? '',
      dataNascimento: row.data_nascimento,
      sexoBiologico: row.sexo_biologico as Paciente['sexoBiologico'],
      pesoInicial: row.peso_inicial,
      altura: row.altura,
      nivelAtividadeFisica: row.nivel_atividade_fisica as Paciente['nivelAtividadeFisica'],
      imc: row.imc ?? undefined,
      tmb: row.tmb ?? undefined,
      get: row.get ?? undefined,
      planoAtivo: row.plano_ativo ?? undefined,
      ultimoAtendimento: row.ultimo_atendimento ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at ?? null,
    };
  }
}
