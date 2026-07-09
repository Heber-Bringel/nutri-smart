import { IBodyMeasurementService, UpdateMeasurementData } from '../../model/services/IBodyMeasurementService';
import { BodyMeasurement } from '../../model/entities/BodyMeasurement';
import { MeasurementError } from '../../model/errors/MeasurementError';

export class UpdateMeasurementUseCase {
  constructor(private measurementService: IBodyMeasurementService) {}

  async execute(id: string, data: UpdateMeasurementData): Promise<BodyMeasurement> {
    if (!id) {
      throw new MeasurementError('ID da medida é obrigatório.');
    }

    return this.measurementService.update(id, data);
  }
}
