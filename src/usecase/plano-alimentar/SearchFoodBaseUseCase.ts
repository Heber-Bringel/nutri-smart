import { IFoodBaseService } from '../../model/services/IFoodBaseService';
import { AlimentoBase } from '../../model/entities/AlimentoBase';
import { PlanoAlimentarError } from '../../model/errors/PlanoAlimentarError';

export class SearchFoodBaseUseCase {
  constructor(private foodBaseService: IFoodBaseService) {}

  async execute(termo: string): Promise<AlimentoBase[]> {
    if (!termo || termo.trim().length === 0) {
      return [];
    }

    return this.foodBaseService.search(termo.trim());
  }
}
