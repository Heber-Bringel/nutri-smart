import { IBodyMeasurementService, CreateMeasurementData, UpdateMeasurementData } from '../../model/services/IBodyMeasurementService';
import { BodyMeasurement } from '../../model/entities/BodyMeasurement';
import { MeasurementError } from '../../model/errors/MeasurementError';
import { supabase } from '../supabase/client';
import { BodyMeasurementMapper } from './mappers/BodyMeasurementMapper';
import { getTodayLocal } from '../../shared/utils/date';

export class SupabaseBodyMeasurementService implements IBodyMeasurementService {
  async create(data: CreateMeasurementData): Promise<BodyMeasurement> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new MeasurementError('Usuário não autenticado.');

    const { data: row, error } = await supabase
      .from('medidas_corporais')
      .insert({
        paciente_id: data.pacienteId,
        nutricionista_id: user.id,
        data_atendimento: data.dataAtendimento ?? getTodayLocal(),
        circunferencia_cintura: data.circunferenciaCintura ?? null,
        circunferencia_quadril: data.circunferenciaQuadril ?? null,
        circunferencia_braco: data.circunferenciaBraco ?? null,
        circunferencia_coxa: data.circunferenciaCoxa ?? null,
        percentual_gordura: data.percentualGordura ?? null,
        dobras_cutaneas_mm: data.dobrasCutaneasMm ?? null,
      })
      .select()
      .single();

    if (error) throw new MeasurementError(error.message);

    if (data.peso != null && data.peso > 0) {
      await supabase.from('historico_peso').upsert({
        paciente_id: data.pacienteId,
        peso: data.peso,
        data_registro: data.dataAtendimento ?? getTodayLocal(),
      }, { onConflict: 'paciente_id, data_registro', ignoreDuplicates: false });
    }

    return BodyMeasurementMapper.toDomain(row);
  }

  async findByPatientId(pacienteId: string): Promise<BodyMeasurement[]> {
    const [{ data: rows, error }, { data: pesos, error: pesosError }] = await Promise.all([
      supabase
        .from('medidas_corporais')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('data_atendimento', { ascending: false }),
      supabase
        .from('historico_peso')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('data_registro', { ascending: false })
    ]);

    if (error) throw new MeasurementError(error.message);
    if (pesosError) throw new MeasurementError(pesosError.message);

    const pesoMap = new Map<string, number>();
    pesos?.forEach(p => {
      if (p.data_registro) {
        pesoMap.set(p.data_registro.split('T')[0], p.peso);
      }
    });

    return (rows || []).map(row => {
      const domain = BodyMeasurementMapper.toDomain(row);
      if (domain.dataAtendimento) {
        domain.peso = pesoMap.get(domain.dataAtendimento.split('T')[0]) || null;
      }
      return domain;
    });
  }

  async update(id: string, data: UpdateMeasurementData): Promise<BodyMeasurement> {
    const { data: row, error } = await supabase
      .from('medidas_corporais')
      .update({
        data_atendimento: data.dataAtendimento,
        circunferencia_cintura: data.circunferenciaCintura ?? null,
        circunferencia_quadril: data.circunferenciaQuadril ?? null,
        circunferencia_braco: data.circunferenciaBraco ?? null,
        circunferencia_coxa: data.circunferenciaCoxa ?? null,
        percentual_gordura: data.percentualGordura ?? null,
        dobras_cutaneas_mm: data.dobrasCutaneasMm ?? null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new MeasurementError(error.message);

    return BodyMeasurementMapper.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('medidas_corporais')
      .delete()
      .eq('id', id);

    if (error) throw new MeasurementError('Erro ao excluir medida.');
  }
}
