import { IFoodBaseService, CreateCustomFoodData } from '../../model/services/IFoodBaseService';
import { AlimentoBase } from '../../model/entities/AlimentoBase';
import { PlanoAlimentarError } from '../../model/errors/PlanoAlimentarError';

export class CreateCustomFoodUseCase {
  constructor(private foodBaseService: IFoodBaseService) {}

  async execute(data: CreateCustomFoodData): Promise<AlimentoBase> {
    if (!data.nome || data.nome.trim().length === 0) {
      throw new PlanoAlimentarError('O nome do alimento é obrigatório.');
    }

    if (data.calorias < 0) {
      throw new PlanoAlimentarError('As calorias devem ser um valor positivo.');
    }

    return this.foodBaseService.createCustom({
      nome: data.nome.trim(),
      porcao: data.porcao || 100,
      unidadeMedida: data.unidadeMedida ?? 'g',
      calorias: data.calorias,
      carboidratos: data.carboidratos || 0,
      proteinas: data.proteinas || 0,
      gorduras: data.gorduras || 0,
    });
  }
}
