import { IAdesaoService, EvolutionChartData } from '../../model/services/IAdesaoService';
import { AdesaoRefeicao, DailyProgress } from '../../model/entities/Adesao';
import { AdesaoError } from '../../model/errors/AdesaoError';
import { supabase } from '../supabase/client';
import { AdesaoMapper } from './mappers/AdesaoMapper';
import { getTodayLocal, toLocalDateString } from '../../shared/utils/date';

export class SupabaseAdesaoService implements IAdesaoService {
  async markAsCompleted(refeicaoId: string, pacienteId: string, concluida: boolean, data?: string): Promise<AdesaoRefeicao> {
    const hoje = data || getTodayLocal();

    const { data: existing } = await supabase
      .from('adesao_refeicoes')
      .select('*')
      .eq('refeicao_id', refeicaoId)
      .eq('data', hoje)
      .maybeSingle();

    if (existing) {
      const { data: row, error } = await supabase
        .from('adesao_refeicoes')
        .update({ concluida })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new AdesaoError(error.message);
      return AdesaoMapper.toDomain(row);
    }

    const { data: row, error } = await supabase
      .from('adesao_refeicoes')
      .insert({
        refeicao_id: refeicaoId,
        paciente_id: pacienteId,
        data: hoje,
        concluida,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        const { data: retry } = await supabase
          .from('adesao_refeicoes')
          .update({ concluida })
          .eq('refeicao_id', refeicaoId)
          .eq('data', hoje)
          .select()
          .single();

        if (retry) return AdesaoMapper.toDomain(retry);
      }
      throw new AdesaoError(error.message);
    }

    return AdesaoMapper.toDomain(row);
  }

  async getAdesaoByData(pacienteId: string, data: string): Promise<AdesaoRefeicao[]> {
    const { data: rows, error } = await supabase
      .from('adesao_refeicoes')
      .select('*')
      .eq('paciente_id', pacienteId)
      .eq('data', data);

    if (error) throw new AdesaoError(error.message);
    return (rows || []).map(AdesaoMapper.toDomain);
  }

  async getDailyProgress(pacienteId: string, data: string): Promise<DailyProgress> {
    const { count: total, error: totalError } = await supabase
      .from('refeicoes')
      .select('*', { count: 'exact', head: true })
      .in('plano_alimentar_id', 
        supabase.from('planos_alimentares').select('id').eq('paciente_id', pacienteId).eq('ativo', true) as any
      );

    if (totalError) throw new AdesaoError(totalError.message);

    const { count: concluidas, error: adError } = await supabase
      .from('adesao_refeicoes')
      .select('*', { count: 'exact', head: true })
      .eq('paciente_id', pacienteId)
      .eq('data', data)
      .eq('concluida', true);

    if (adError) throw new AdesaoError(adError.message);

    const totalRefeicoes = total ?? 0;
    const concluidasCount = concluidas ?? 0;

    return AdesaoMapper.toDailyProgress(pacienteId, data, {
      total: totalRefeicoes,
      concluidas: concluidasCount,
    });
  }

  async getEvolutionChartData(pacienteId: string, dias: number): Promise<EvolutionChartData[]> {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    const inicio = toLocalDateString(dataInicio);

    const { data: historicoPeso } = await supabase
      .from('historico_peso')
      .select('data_registro, peso')
      .eq('paciente_id', pacienteId)
      .gte('data_registro', inicio)
      .order('data_registro', { ascending: true });

    const { data: adesao } = await supabase
      .from('adesao_refeicoes')
      .select('data, concluida')
      .eq('paciente_id', pacienteId)
      .gte('data', inicio);

    const pesoMap = new Map<string, number>();
    for (const p of historicoPeso || []) {
      pesoMap.set(p.data_registro, p.peso);
    }

    const adesaoPorData = new Map<string, { total: number; concluidas: number }>();
    for (const a of adesao || []) {
      const entry = adesaoPorData.get(a.data) || { total: 0, concluidas: 0 };
      entry.total++;
      if (a.concluida) entry.concluidas++;
      adesaoPorData.set(a.data, entry);
    }

    const chartData: EvolutionChartData[] = [];
    const hoje = new Date();
    for (let i = dias; i >= 0; i--) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const dataStr = toLocalDateString(d);

      const adEntry = adesaoPorData.get(dataStr);
      chartData.push({
        data: dataStr,
        peso: pesoMap.get(dataStr) ?? null,
        adesaoPercentual: adEntry && adEntry.total > 0
          ? Math.round((adEntry.concluidas / adEntry.total) * 100)
          : 0,
      });
    }

    return chartData;
  }
}
