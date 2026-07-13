import { BodyMeasurement } from '../../../model/entities/BodyMeasurement';

interface BodyMeasurementRow {
  id: string;
  paciente_id: string;
  nutricionista_id: string;
  data_atendimento: string;
  circunferencia_cintura?: number | null;
  circunferencia_quadril?: number | null;
  circunferencia_braco?: number | null;
  circunferencia_coxa?: number | null;
  percentual_gordura?: number | null;
  dobras_cutaneas_mm?: number | null;
  created_at: string;
}

export class BodyMeasurementMapper {
  static toDomain(row: BodyMeasurementRow): BodyMeasurement {
    return {
      id: row.id,
      pacienteId: row.paciente_id,
      nutricionistaId: row.nutricionista_id,
      dataAtendimento: row.data_atendimento,
      circunferenciaCintura: row.circunferencia_cintura ?? null,
      circunferenciaQuadril: row.circunferencia_quadril ?? null,
      circunferenciaBraco: row.circunferencia_braco ?? null,
      circunferenciaCoxa: row.circunferencia_coxa ?? null,
      percentualGordura: row.percentual_gordura ?? null,
      dobrasCutaneasMm: row.dobras_cutaneas_mm ?? null,
      createdAt: row.created_at,
    };
  }
}
