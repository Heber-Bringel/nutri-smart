import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IReportGenerator, ReportPayload } from '../../model/services/IReportGenerator';

export class JsPdfReportAdapter implements IReportGenerator {
  public async generatePatientReport(data: ReportPayload): Promise<Blob> {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório do Paciente', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Nome: ${data.paciente.nome}`, 14, 30);
    doc.text(`Idade: ${data.paciente.idade} anos`, 14, 38);
    doc.text(`Sexo: ${data.paciente.sexo}`, 14, 46);
    if (data.paciente.email) doc.text(`Email: ${data.paciente.email}`, 14, 54);
    
    doc.setFontSize(14);
    doc.text('Indicadores Clínicos', 14, 68);
    autoTable(doc, {
      startY: 74,
      head: [['IMC', 'Taxa Metabólica Basal (TMB)', 'Gasto Energético Total (GET)']],
      body: [
        [data.indicadores.imc.toFixed(2), `${data.indicadores.tmb} kcal`, `${data.indicadores.get} kcal`]
      ],
    });

    let currentY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text('Histórico de Medidas', 14, currentY);
    
    const historicoBody = data.historicoMedidas.map(m => [
      new Date(m.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      `${m.peso} kg`,
      m.circunferenciaCintura ? `${m.circunferenciaCintura} cm` : '-',
      m.circunferenciaAbdominal ? `${m.circunferenciaAbdominal} cm` : '-',
      m.circunferenciaQuadril ? `${m.circunferenciaQuadril} cm` : '-'
    ]);

    autoTable(doc, {
      startY: currentY + 6,
      head: [['Data', 'Peso', 'Cintura', 'Abdominal', 'Quadril']],
      body: historicoBody,
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 10;

    if (data.evolucaoPesoChartImage) {
      if (currentY + 60 > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(14);
      doc.text('Evolução de Peso', 14, currentY);
      
      const imgProps = doc.getImageProperties(data.evolucaoPesoChartImage);
      const pdfWidth = doc.internal.pageSize.getWidth() - 28;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      doc.addImage(data.evolucaoPesoChartImage, 'PNG', 14, currentY + 6, pdfWidth, pdfHeight);
      
      currentY += pdfHeight + 20;
    }

    if (data.planoAlimentar) {
      if (currentY + 20 > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Plano Alimentar Vigente', 14, currentY);
      currentY += 6;

      data.planoAlimentar.refeicoes.forEach(ref => {
        if (currentY + 15 > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${ref.nome} - ${ref.horario}`, 14, currentY);
        doc.setFont('helvetica', 'normal');
        currentY += 6;
        
        ref.alimentos.forEach(alim => {
          if (currentY + 8 > doc.internal.pageSize.getHeight()) {
            doc.addPage();
            currentY = 20;
          }
          doc.text(`• ${alim}`, 18, currentY);
          currentY += 6;
        });
        currentY += 4;
      });

      if (data.planoAlimentar.recomendacoesGerais) {
        if (currentY + 10 > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('Recomendações Gerais', 14, currentY);
        currentY += 6;
        doc.setFont('helvetica', 'normal');
        
        const textLines = doc.splitTextToSize(data.planoAlimentar.recomendacoesGerais, doc.internal.pageSize.getWidth() - 28);
        doc.text(textLines, 14, currentY);
      }
    }

    return doc.output('blob');
  }

  public downloadReport(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public printReport(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  }
}
