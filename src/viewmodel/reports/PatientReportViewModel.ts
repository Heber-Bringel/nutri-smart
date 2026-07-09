import { useState, useMemo, useEffect } from 'react';
import { ReportPayload } from '../../model/services/IReportGenerator';
import { Container } from '../../di/container';
import { Paciente } from '../../model/entities/Paciente';

export type TimeWindow = 30 | 60 | 90;

function calculateAge(birthDate: string): number {
  const diff = Date.now() - new Date(birthDate).getTime();
  const ageDate = new Date(diff); 
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function usePatientReportViewModel(pacienteId?: string) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [payloadData, setPayloadData] = useState<ReportPayload | null>(null);

  useEffect(() => {
    if (!pacienteId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    async function loadData() {
      try {
        const paciente = await Container.getPacienteUseCase.execute(pacienteId as string);
        const mealPlan = await Container.getMealPlanUseCase.execute(pacienteId as string).catch(() => null);
        const medidasRaw = await Container.listMeasurementsUseCase.execute(pacienteId as string).catch(() => []);

        // Sort by date ascending to show chart properly
        const medidas = [...medidasRaw].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        if (cancelled) return;

        const payload: ReportPayload = {
          paciente: {
            nome: paciente.nomeCompleto,
            idade: calculateAge(paciente.dataNascimento),
            sexo: paciente.sexoBiologico === 'masculino' ? 'M' : 'F',
            email: paciente.email,
          },
          indicadores: {
            imc: paciente.imc || 0,
            tmb: paciente.tmb || 0,
            get: paciente.get || 0,
          },
          historicoMedidas: medidas.map(m => ({
            data: m.data,
            peso: m.peso,
            circunferenciaCintura: m.cintura,
            circunferenciaAbdominal: m.abdominal,
            circunferenciaQuadril: m.quadril,
          })),
          planoAlimentar: mealPlan ? {
            refeicoes: mealPlan.refeicoes.map(r => ({
              nome: r.nome,
              horario: r.horario,
              alimentos: r.alimentos.map(a => `${a.quantidade || ''} ${a.unidade || ''} de ${a.nome}`.trim()),
            })),
            recomendacoesGerais: mealPlan.observacoes,
          } : undefined,
        };

        setPayloadData(payload);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados para o relatório.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [pacienteId]);

  const filteredMeasurements = useMemo(() => {
    if (!payloadData) return [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeWindow);
    return payloadData.historicoMedidas.filter(m => new Date(m.data) >= cutoffDate);
  }, [timeWindow, payloadData]);

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
    if (!payloadData) return;
    setIsGenerating(true);
    try {
      const useCase = Container.generatePatientReportUseCase;
      
      const payload: ReportPayload = {
        ...payloadData,
        historicoMedidas: filteredMeasurements,
        evolucaoPesoChartImage: chartBase64,
      };

      const blob = await useCase.execute(payload);
      
      if (action === 'download') {
        useCase.download(blob, `relatorio_${payloadData.paciente.nome.replace(/\s/g, '_')}_${timeWindow}d.pdf`);
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
    isLoading,
    error,
    patientName: payloadData?.paciente.nome || '',
  };
}
