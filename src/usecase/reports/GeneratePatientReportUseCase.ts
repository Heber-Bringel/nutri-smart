import { IReportGenerator, ReportPayload } from '../../model/services/IReportGenerator';

export class GeneratePatientReportUseCase {
  constructor(private readonly reportGenerator: IReportGenerator) {}

  public async execute(data: ReportPayload): Promise<Blob> {
    if (!data.paciente || !data.indicadores || !data.historicoMedidas) {
      throw new Error("Dados insuficientes para gerar o relatório do paciente.");
    }

    return await this.reportGenerator.generatePatientReport(data);
  }

  public download(blob: Blob, filename: string): void {
    this.reportGenerator.downloadReport(blob, filename);
  }

  public print(blob: Blob): void {
    this.reportGenerator.printReport(blob);
  }
}
