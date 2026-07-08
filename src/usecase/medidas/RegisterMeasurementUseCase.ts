import { IBodyMeasurementService, CreateMeasurementData } from '../../model/services/IBodyMeasurementService';
import { BodyMeasurement } from '../../model/entities/BodyMeasurement';
import { MeasurementError } from '../../model/errors/MeasurementError';
import { getTodayLocal } from '../../shared/utils/date';

export class RegisterMeasurementUseCase {
  constructor(private measurementService: IBodyMeasurementService) {}

  async execute(data: CreateMeasurementData): Promise<BodyMeasurement> {
    if (!data.pacienteId) {
      throw new MeasurementError('Paciente é obrigatório.');
    }

    if (!data.dataAtendimento) {
      throw new MeasurementError('A data do atendimento é obrigatória.');
    }

    if (data.dataAtendimento > getTodayLocal()) {
      throw new MeasurementError('A data do atendimento não pode ser futura.');
    }

    const fields = [
      data.peso,
      data.circunferenciaCintura,
      data.circunferenciaQuadril,
      data.circunferenciaBraco,
      data.circunferenciaCoxa,
      data.percentualGordura,
      data.dobrasCutaneasMm,
    ];

    for (const val of fields) {
      if (val != null && val < 0) {
        throw new MeasurementError('Os valores das medidas devem ser positivos.');
      }
    }

    return this.measurementService.create(data);
  }
}
