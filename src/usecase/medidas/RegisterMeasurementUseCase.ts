import { IBodyMeasurementService, CreateMeasurementData } from '../../model/services/IBodyMeasurementService';
import { BodyMeasurement } from '../../model/entities/BodyMeasurement';
import { MeasurementError } from '../../model/errors/MeasurementError';

export class RegisterMeasurementUseCase {
  constructor(private measurementService: IBodyMeasurementService) {}

  async execute(data: CreateMeasurementData): Promise<BodyMeasurement> {
    if (!data.pacienteId) {
      throw new MeasurementError('Paciente é obrigatório.');
    }

    return this.measurementService.create(data);
  }
}
