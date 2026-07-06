import { BodyMeasurement } from '../entities/BodyMeasurement';

export interface CreateMeasurementData {
  pacienteId: string;
  dataAtendimento?: string;
  circunferenciaCintura?: number | null;
  circunferenciaQuadril?: number | null;
  circunferenciaBraco?: number | null;
  circunferenciaCoxa?: number | null;
  percentualGordura?: number | null;
  dobrasCutaneasMm?: number | null;
}

export interface UpdateMeasurementData {
  dataAtendimento?: string;
  circunferenciaCintura?: number | null;
  circunferenciaQuadril?: number | null;
  circunferenciaBraco?: number | null;
  circunferenciaCoxa?: number | null;
  percentualGordura?: number | null;
  dobrasCutaneasMm?: number | null;
}

export interface IBodyMeasurementService {
  create(data: CreateMeasurementData): Promise<BodyMeasurement>;
  findByPatientId(pacienteId: string): Promise<BodyMeasurement[]>;
  update(id: string, data: UpdateMeasurementData): Promise<BodyMeasurement>;
  delete(id: string): Promise<void>;
}
