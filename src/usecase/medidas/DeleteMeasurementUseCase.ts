import { IBodyMeasurementService } from '../../model/services/IBodyMeasurementService';
import { MeasurementError } from '../../model/errors/MeasurementError';

export class DeleteMeasurementUseCase {
  constructor(private measurementService: IBodyMeasurementService) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new MeasurementError('ID da medida é obrigatório.');
    }

    return this.measurementService.delete(id);
  }
}
