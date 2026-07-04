import { IPacienteService, CreatePacienteData, PacienteFilters, PaginatedResult } from '../../model/services/IPacienteService';
import { Paciente } from '../../model/entities/Paciente';
import { PacienteError } from '../../model/errors/PacienteError';
import { supabase } from '../supabase/client';
import { PacienteMapper } from './mappers/PacienteMapper';

export class SupabasePacienteService implements IPacienteService {
  async create(data: CreatePacienteData): Promise<Paciente> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new PacienteError('Usuário não autenticado.');

    const { data: row, error } = await supabase
      .from('pacientes')
      .insert({
        nutricionista_id: user.id,
        nome_completo: data.nomeCompleto,
        email: data.email,
        data_nascimento: data.dataNascimento,
        sexo_biologico: data.sexoBiologico,
        peso_inicial: data.pesoInicial,
        altura: data.altura,
        nivel_atividade_fisica: data.nivelAtividadeFisica,
        imc: data.imc,
        tmb: data.tmb,
        get: data.get,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new PacienteError('Já existe um paciente cadastrado com este e-mail.');
      }
      throw new PacienteError(error.message);
    }

    return PacienteMapper.toDomain(row);
  }

  async findAll(filters: PacienteFilters = {}): Promise<PaginatedResult<Paciente>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new PacienteError('Usuário não autenticado.');

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('pacientes')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .eq('nutricionista_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.search) {
      query = query.ilike('nome_completo', `%${filters.search}%`);
    }

    const { data: rows, error, count } = await query;

    if (error) throw new PacienteError(error.message);

    return {
      data: (rows || []).map(PacienteMapper.toDomain),
      total: count ?? 0,
    };
  }

  async findById(id: string): Promise<Paciente> {
    const { data: row, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new PacienteError('Paciente não encontrado.');
    }

    return PacienteMapper.toDomain(row);
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('pacientes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new PacienteError('Erro ao excluir paciente.');
  }

  async resendInvite(email: string): Promise<void> {
    // O trigger on_auth_user_created_paciente vincula automaticamente
    // o paciente ao usuário quando ele confirmar o e-mail.
    // Para reenvio, seria necessário uma Edge Function com service_role.
    throw new PacienteError('Funcionalidade de reenvio disponível em breve.');
  }
}
