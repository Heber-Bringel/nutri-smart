import { IBodyMeasurementService } from '../../model/services/IBodyMeasurementService';
import { BodyMeasurement } from '../../model/entities/BodyMeasurement';

export class ListMeasurementsUseCase {
  constructor(private measurementService: IBodyMeasurementService) {}

  async execute(pacienteId: string): Promise<BodyMeasurement[]> {
    return this.measurementService.findByPatientId(pacienteId);
  }
}
