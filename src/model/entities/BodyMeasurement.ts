export interface BodyMeasurement {
  id: string;
  pacienteId: string;
  nutricionistaId: string;
  dataAtendimento: string;
  peso?: number | null;
  circunferenciaCintura?: number | null;
  circunferenciaQuadril?: number | null;
  circunferenciaBraco?: number | null;
  circunferenciaCoxa?: number | null;
  percentualGordura?: number | null;
  dobrasCutaneasMm?: number | null;
  createdAt: string;
}
