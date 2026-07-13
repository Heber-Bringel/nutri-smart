export interface ReportPatientData {
  nome: string;
  idade: number;
  sexo: string;
  email?: string;
  telefone?: string;
}

export interface ReportClinicalIndicators {
  imc: number;
  tmb: number;
  get: number;
}

export interface ReportMeasurement {
  data: string;
  peso: number;
  circunferenciaCintura?: number;
  circunferenciaQuadril?: number;
}

export interface ReportMeal {
  nome: string;
  horario: string;
  alimentos: string[];
}

export interface ReportMealPlan {
  refeicoes: ReportMeal[];
  recomendacoesGerais?: string;
}

export interface ReportPayload {
  paciente: ReportPatientData;
  indicadores: ReportClinicalIndicators;
  historicoMedidas: ReportMeasurement[];
  planoAlimentar?: ReportMealPlan;
  evolucaoPesoChartImage?: string;
}

export interface IReportGenerator {
  generatePatientReport(data: ReportPayload): Promise<Blob>;
  downloadReport(blob: Blob, filename: string): void;
  printReport(blob: Blob): void;
}
