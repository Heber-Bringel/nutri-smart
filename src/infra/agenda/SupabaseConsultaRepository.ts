import { IConsultaRepository } from '../../model/services/IConsultaRepository';
import { Consulta, CreateConsultaData, UpdateConsultaData } from '../../model/entities/Consulta';
import { AgendaError } from '../../model/errors/AgendaError';
import { supabase } from '../supabase/client';
import { ConsultaMapper } from './mappers/ConsultaMapper';

export class SupabaseConsultaRepository implements IConsultaRepository {
  async create(data: CreateConsultaData): Promise<Consulta> {
    const horarioFim = this.calcularHorarioFim(data.horarioInicio, data.duracaoMinutos);

    const { data: row, error } = await supabase
      .from('consultas')
      .insert({
        nutricionista_id: data.nutricionistaId,
        paciente_id: data.pacienteId,
        data: data.data,
        horario_inicio: data.horarioInicio,
        duracao_minutos: data.duracaoMinutos,
        horario_fim: horarioFim,
        observacoes: data.observacoes || null,
      })
      .select()
      .single();

    if (error) throw new AgendaError(error.message);
    return ConsultaMapper.toDomain(row);
  }

  async update(id: string, data: UpdateConsultaData): Promise<Consulta> {
    const updates: Record<string, unknown> = {};

    if (data.data !== undefined) updates.data = data.data;
    if (data.horarioInicio !== undefined) updates.horario_inicio = data.horarioInicio;
    if (data.duracaoMinutos !== undefined) updates.duracao_minutos = data.duracaoMinutos;
    if (data.observacoes !== undefined) updates.observacoes = data.observacoes;

    if (data.horarioInicio !== undefined && data.duracaoMinutos !== undefined) {
      updates.horario_fim = this.calcularHorarioFim(data.horarioInicio, data.duracaoMinutos);
    }

    const { data: row, error } = await supabase
      .from('consultas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AgendaError(error.message);
    return ConsultaMapper.toDomain(row);
  }

  async cancel(id: string): Promise<void> {
    const { error } = await supabase
      .from('consultas')
      .update({ status: 'cancelada' })
      .eq('id', id);

    if (error) throw new AgendaError(error.message);
  }

  async findById(id: string): Promise<Consulta | null> {
    const { data: row, error } = await supabase
      .from('consultas')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new AgendaError(error.message);
    return row ? ConsultaMapper.toDomain(row) : null;
  }

  async findByNutricionistaId(
    nutricionistaId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Consulta[]> {
    let query = supabase
      .from('consultas')
      .select('*, pacientes(nome_completo)')
      .eq('nutricionista_id', nutricionistaId)
      .order('data', { ascending: true })
      .order('horario_inicio', { ascending: true });

    if (startDate) query = query.gte('data', startDate);
    if (endDate) query = query.lte('data', endDate);

    const { data: rows, error } = await query;

    if (error) throw new AgendaError(error.message);
    return (rows || []).map(ConsultaMapper.toDomain);
  }

  async findNextByPacienteId(pacienteId: string): Promise<Consulta | null> {
    const hoje = new Date().toISOString().split('T')[0];

    const { data: rows, error } = await supabase
      .from('consultas')
      .select('*')
      .eq('paciente_id', pacienteId)
      .eq('status', 'agendada')
      .gte('data', hoje)
      .order('data', { ascending: true })
      .order('horario_inicio', { ascending: true })
      .limit(1);

    if (error) throw new AgendaError(error.message);
    return rows && rows.length > 0 ? ConsultaMapper.toDomain(rows[0]) : null;
  }

  async findConflicting(
    nutricionistaId: string,
    data: string,
    horarioInicio: string,
    horarioFim: string,
    excludeId?: string
  ): Promise<Consulta[]> {
    let query = supabase
      .from('consultas')
      .select('*')
      .eq('nutricionista_id', nutricionistaId)
      .eq('data', data)
      .eq('status', 'agendada')
      .lt('horario_fim', horarioFim)  // over
      .gt('horario_inicio', horarioInicio);

    if (excludeId) query = query.neq('id', excludeId);

    const { data: rows, error } = await query;

    if (error) throw new AgendaError(error.message);
    return (rows || []).map(ConsultaMapper.toDomain);
  }

  private calcularHorarioFim(horarioInicio: string, duracaoMinutos: number): string {
    const [h, m] = horarioInicio.split(':').map(Number);
    const totalMin = h * 60 + m + duracaoMinutos;
    const hFim = Math.floor(totalMin / 60);
    const mFim = totalMin % 60;
    return `${String(hFim).padStart(2, '0')}:${String(mFim).padStart(2, '0')}`;
  }
}
