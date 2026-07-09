import { useState, useMemo } from 'react';
import { GeneratePatientReportUseCase } from '../../usecase/reports/GeneratePatientReportUseCase';
import { ReportPayload } from '../../model/services/IReportGenerator';
import { JsPdfReportAdapter } from '../../infra/reports/JsPdfReportAdapter';

export type TimeWindow = 30 | 60 | 90;

export function usePatientReportViewModel() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(30);
  const [isGenerating, setIsGenerating] = useState(false);

  const mockPayload: ReportPayload = {
    paciente: {
      nome: 'João Silva',
      idade: 35,
      sexo: 'M',
      email: 'joao.silva@example.com',
      telefone: '(11) 98765-4321',
    },
    indicadores: {
      imc: 24.5,
      tmb: 1800,
      get: 2400,
    },
    historicoMedidas: Array.from({ length: 10 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i * 15);
      return {
        data: d.toISOString(),
        peso: 80 - i * 0.5,
        circunferenciaCintura: 90 - i * 0.5,
        circunferenciaAbdominal: 95 - i * 0.5,
        circunferenciaQuadril: 100 - i * 0.5,
      };
    }).reverse(),
    planoAlimentar: {
      refeicoes: [
        {
          nome: 'Café da Manhã',
          horario: '08:00',
          alimentos: ['2 fatias de pão integral', '2 ovos mexidos', '1 xícara de café'],
        },
        {
          nome: 'Almoço',
          horario: '12:30',
          alimentos: ['150g peito de frango', '100g arroz integral', 'Salada à vontade'],
        },
      ],
      recomendacoesGerais: 'Beber 3L de água por dia. Evitar doces e frituras.',
    },
  };

  const filteredMeasurements = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeWindow);
    return mockPayload.historicoMedidas.filter(m => new Date(m.data) >= cutoffDate);
  }, [timeWindow, mockPayload.historicoMedidas]);

  const chartData = useMemo(() => {
    return filteredMeasurements.map(m => ({
      data: new Date(m.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: m.peso,
      cintura: m.circunferenciaCintura,
      abdominal: m.circunferenciaAbdominal,
      quadril: m.circunferenciaQuadril,
    }));
  }, [filteredMeasurements]);

  const generateReport = async (chartBase64?: string, action: 'download' | 'print' = 'download') => {
    setIsGenerating(true);
    try {
      const adapter = new JsPdfReportAdapter();
      const useCase = new GeneratePatientReportUseCase(adapter);
      
      const payload: ReportPayload = {
        ...mockPayload,
        historicoMedidas: filteredMeasurements,
        evolucaoPesoChartImage: chartBase64,
      };

      const blob = await useCase.execute(payload);
      
      if (action === 'download') {
        useCase.download(blob, `relatorio_${mockPayload.paciente.nome.replace(/\s/g, '_')}_${timeWindow}d.pdf`);
      } else {
        useCase.print(blob);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Houve um erro ao gerar o relatório.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    timeWindow,
    setTimeWindow,
    filteredMeasurements,
    chartData,
    generateReport,
    isGenerating,
    patientName: mockPayload.paciente.nome,
  };
}
