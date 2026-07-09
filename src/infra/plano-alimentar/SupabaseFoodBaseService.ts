import { IFoodBaseService, CreateCustomFoodData } from '../../model/services/IFoodBaseService';
import { AlimentoBase } from '../../model/entities/AlimentoBase';
import { PlanoAlimentarError } from '../../model/errors/PlanoAlimentarError';
import { supabase } from '../supabase/client';
import { FoodBaseMapper } from './mappers/FoodBaseMapper';

export class SupabaseFoodBaseService implements IFoodBaseService {
  async search(termo: string): Promise<AlimentoBase[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new PlanoAlimentarError('Usuário não autenticado.');

    const { data, error } = await supabase
      .from('alimentos_base')
      .select('*')
      .or(`nutricionista_id.is.null,nutricionista_id.eq.${user.id}`)
      .ilike('nome', `%${termo}%`)
      .order('nome', { ascending: true })
      .limit(20);

    if (error) throw new PlanoAlimentarError(error.message);

    return (data || []).map(FoodBaseMapper.toDomain);
  }

  async createCustom(data: CreateCustomFoodData): Promise<AlimentoBase> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new PlanoAlimentarError('Usuário não autenticado.');

    const { data: row, error } = await supabase
      .from('alimentos_base')
      .insert({
        nome: data.nome,
        porcao: data.porcao,
        unidade_medida: data.unidadeMedida ?? 'g',
        calorias: data.calorias,
        carboidratos: data.carboidratos,
        proteinas: data.proteinas,
        gorduras: data.gorduras,
        nutricionista_id: user.id,
      })
      .select()
      .single();

    if (error) throw new PlanoAlimentarError(error.message);

    return FoodBaseMapper.toDomain(row);
  }
}
