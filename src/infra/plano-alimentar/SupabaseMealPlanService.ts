import { IMealPlanService, CreateMealPlanData, UpdateMealPlanData } from '../../model/services/IMealPlanService';
import { MealPlan } from '../../model/entities/MealPlan';
import { PlanoAlimentarError } from '../../model/errors/PlanoAlimentarError';
import { supabase } from '../supabase/client';
import { MealPlanMapper } from './mappers/MealPlanMapper';

export class SupabaseMealPlanService implements IMealPlanService {
  async create(data: CreateMealPlanData): Promise<MealPlan> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new PlanoAlimentarError('Usuário não autenticado.');

    const { data: plano, error: planoError } = await supabase
      .from('planos_alimentares')
      .insert({
        paciente_id: data.pacienteId,
        nutricionista_id: user.id,
        ativo: true,
        observacoes: data.observacoes ?? null,
      })
      .select()
      .single();

    if (planoError) throw new PlanoAlimentarError(planoError.message);

    const refeicoesData = data.refeicoes.map((r, i) => ({
      plano_alimentar_id: plano.id,
      nome: r.nome,
      ordem: r.ordem ?? i + 1,
      horario_sugerido: r.horarioSugerido ?? null,
    }));

    const { data: refeicoes, error: refError } = await supabase
      .from('refeicoes')
      .insert(refeicoesData)
      .select();

    if (refError) throw new PlanoAlimentarError(refError.message);

    const alimentosData = refeicoes.flatMap(refeicao => {
      const refData = data.refeicoes.find(r => r.nome === refeicao.nome && r.ordem === refeicao.ordem);
      return (refData?.alimentos || []).map(a => ({
        refeicao_id: refeicao.id,
        nome: a.nome,
        quantidade: a.quantidade,
        unidade_medida: a.unidadeMedida ?? 'g',
        calorias: a.calorias,
        carboidratos: a.carboidratos ?? null,
        proteinas: a.proteinas ?? null,
        gorduras: a.gorduras ?? null,
      }));
    });

    if (alimentosData.length > 0) {
      const { error: alimError } = await supabase
        .from('alimentos')
        .insert(alimentosData);

      if (alimError) throw new PlanoAlimentarError(alimError.message);
    }

    const { data: allAlimentos, error: alimQueryError } = await supabase
      .from('alimentos')
      .select('*')
      .in('refeicao_id', refeicoes.map(r => r.id));

    if (alimQueryError) throw new PlanoAlimentarError(alimQueryError.message);

    return MealPlanMapper.toDomain(plano, refeicoes, allAlimentos || []);
  }

  async update(id: string, data: UpdateMealPlanData): Promise<MealPlan> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new PlanoAlimentarError('Usuário não autenticado.');

    const { error: updateError } = await supabase
      .from('planos_alimentares')
      .update({ observacoes: data.observacoes ?? null, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) throw new PlanoAlimentarError(updateError.message);

    const { data: existingRefeicoes } = await supabase
      .from('refeicoes')
      .select('id')
      .eq('plano_alimentar_id', id);

    if (existingRefeicoes && existingRefeicoes.length > 0) {
      await supabase
        .from('alimentos')
        .delete()
        .in('refeicao_id', existingRefeicoes.map(r => r.id));

      await supabase
        .from('refeicoes')
        .delete()
        .eq('plano_alimentar_id', id);
    }

    const refeicoesData = data.refeicoes.map((r, i) => ({
      plano_alimentar_id: id,
      nome: r.nome,
      ordem: r.ordem ?? i + 1,
      horario_sugerido: r.horarioSugerido ?? null,
    }));

    const { data: refeicoes, error: refError } = await supabase
      .from('refeicoes')
      .insert(refeicoesData)
      .select();

    if (refError) throw new PlanoAlimentarError(refError.message);

    const alimentosData = refeicoes.flatMap(refeicao => {
      const refData = data.refeicoes.find(r => r.nome === refeicao.nome && r.ordem === refeicao.ordem);
      return (refData?.alimentos || []).map(a => ({
        refeicao_id: refeicao.id,
        nome: a.nome,
        quantidade: a.quantidade,
        unidade_medida: a.unidadeMedida ?? 'g',
        calorias: a.calorias,
        carboidratos: a.carboidratos ?? null,
        proteinas: a.proteinas ?? null,
        gorduras: a.gorduras ?? null,
      }));
    });

    if (alimentosData.length > 0) {
      const { error: alimError } = await supabase
        .from('alimentos')
        .insert(alimentosData);

      if (alimError) throw new PlanoAlimentarError(alimError.message);
    }

    const { data: allAlimentos, error: alimQueryError } = await supabase
      .from('alimentos')
      .select('*')
      .in('refeicao_id', refeicoes.map(r => r.id));

    if (alimQueryError) throw new PlanoAlimentarError(alimQueryError.message);

    const { data: plano } = await supabase
      .from('planos_alimentares')
      .select('*')
      .eq('id', id)
      .single();

    return MealPlanMapper.toDomain(plano!, refeicoes, allAlimentos || []);
  }

  async findByPatientId(pacienteId: string): Promise<MealPlan | null> {
    const { data: planos } = await supabase
      .from('planos_alimentares')
      .select('*')
      .eq('paciente_id', pacienteId)
      .eq('ativo', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!planos || planos.length === 0) return null;

    const plano = planos[0];

    const { data: refeicoes } = await supabase
      .from('refeicoes')
      .select('*')
      .eq('plano_alimentar_id', plano.id)
      .order('ordem', { ascending: true });

    const { data: alimentos } = await supabase
      .from('alimentos')
      .select('*')
      .in('refeicao_id', (refeicoes || []).map(r => r.id));

    return MealPlanMapper.toDomain(plano, refeicoes || [], alimentos || []);
  }

  async findById(id: string): Promise<MealPlan> {
    const { data: plano, error } = await supabase
      .from('planos_alimentares')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new PlanoAlimentarError('Plano alimentar não encontrado.');

    const { data: refeicoes } = await supabase
      .from('refeicoes')
      .select('*')
      .eq('plano_alimentar_id', id)
      .order('ordem', { ascending: true });

    const { data: alimentos } = await supabase
      .from('alimentos')
      .select('*')
      .in('refeicao_id', (refeicoes || []).map(r => r.id));

    return MealPlanMapper.toDomain(plano, refeicoes || [], alimentos || []);
  }
}
