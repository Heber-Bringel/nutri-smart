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

    return this.enrichWithPlanAndLastNote(PacienteMapper.toDomain(row));
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

    const pacientes = (rows || []).map(PacienteMapper.toDomain);
    const enriched = await this.enrichList(pacientes);

    return {
      data: enriched,
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

    return this.enrichWithPlanAndLastNote(PacienteMapper.toDomain(row));
  }

  async update(id: string, data: Partial<CreatePacienteData>): Promise<Paciente> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (data.nomeCompleto !== undefined) updateData.nome_completo = data.nomeCompleto;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.dataNascimento !== undefined) updateData.data_nascimento = data.dataNascimento;
    if (data.sexoBiologico !== undefined) updateData.sexo_biologico = data.sexoBiologico;
    if (data.pesoInicial !== undefined) updateData.peso_inicial = data.pesoInicial;
    if (data.altura !== undefined) updateData.altura = data.altura;
    if (data.nivelAtividadeFisica !== undefined) updateData.nivel_atividade_fisica = data.nivelAtividadeFisica;
    if (data.imc !== undefined) updateData.imc = data.imc;
    if (data.tmb !== undefined) updateData.tmb = data.tmb;
    if (data.get !== undefined) updateData.get = data.get;

    const { data: row, error } = await supabase
      .from('pacientes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new PacienteError(error.message);

    return this.enrichWithPlanAndLastNote(PacienteMapper.toDomain(row));
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase.rpc('soft_delete_paciente', { p_id: id });

    if (error) throw new PacienteError('Erro ao excluir paciente.');
  }

  private async enrichList(pacientes: Paciente[]): Promise<Paciente[]> {
    if (pacientes.length === 0) return pacientes;

    const ids = pacientes.map(p => p.id);

    const [plansResult, notesResult] = await Promise.all([
      supabase
        .from('planos_alimentares')
        .select('paciente_id')
        .eq('ativo', true)
        .in('paciente_id', ids),
      supabase
        .from('anotacoes_clinicas')
        .select('paciente_id, data_atendimento')
        .in('paciente_id', ids)
        .order('data_atendimento', { ascending: false }),
    ]);

    const activePlanIds = new Set((plansResult.data || []).map(r => r.paciente_id));

    const lastNoteMap = new Map<string, string>();
    for (const note of (notesResult.data || [])) {
      if (!lastNoteMap.has(note.paciente_id)) {
        lastNoteMap.set(note.paciente_id, note.data_atendimento);
      }
    }

    return pacientes.map(p => ({
      ...p,
      planoAtivo: activePlanIds.has(p.id),
      ultimoAtendimento: lastNoteMap.get(p.id) || p.ultimoAtendimento,
    }));
  }

  private async enrichWithPlanAndLastNote(paciente: Paciente): Promise<Paciente> {
    const [plansResult, notesResult] = await Promise.all([
      supabase
        .from('planos_alimentares')
        .select('id')
        .eq('paciente_id', paciente.id)
        .eq('ativo', true)
        .limit(1),
      supabase
        .from('anotacoes_clinicas')
        .select('data_atendimento')
        .eq('paciente_id', paciente.id)
        .order('data_atendimento', { ascending: false })
        .limit(1),
    ]);

    return {
      ...paciente,
      planoAtivo: (plansResult.data || []).length > 0,
      ultimoAtendimento: (notesResult.data || [])[0]?.data_atendimento || paciente.ultimoAtendimento,
    };
  }
}
