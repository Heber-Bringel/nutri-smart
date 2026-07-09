import { useState, useMemo, useEffect } from 'react';
import { ReportPayload } from '../../model/services/IReportGenerator';
import { Container } from '../../di/container';


export type TimeWindow = 30 | 60 | 90;

function calculateAge(birthDate: string): number {
  const diff = Date.now() - new Date(birthDate).getTime();
  const ageDate = new Date(diff); 
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function usePatientReportViewModel(pacienteId?: string, initialTimeWindow: TimeWindow = 30) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(initialTimeWindow);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [payloadData, setPayloadData] = useState<ReportPayload | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adesaoRawData, setAdesaoRawData] = useState<any[]>([]);

  useEffect(() => {
    if (!pacienteId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        const evolucaoAdesaoRaw = await Container.getEvolutionChartDataUseCase.execute(pacienteId as string, 365).catch(() => []);

        // Sort by date ascending to show chart properly
        const medidas = [...medidasRaw].sort((a, b) => new Date(a.dataAtendimento).getTime() - new Date(b.dataAtendimento).getTime());

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
            data: m.dataAtendimento,
            peso: m.peso || 0,
            circunferenciaCintura: m.circunferenciaCintura || undefined,
            circunferenciaQuadril: m.circunferenciaQuadril || undefined,
          })),
          planoAlimentar: mealPlan ? {
            refeicoes: mealPlan.refeicoes.map(r => ({
              nome: r.nome,
              horario: r.horarioSugerido || '',
              alimentos: r.alimentos.map(a => `${a.quantidade || ''} ${a.unidadeMedida || ''} de ${a.nome}`.trim()),
            })),
            recomendacoesGerais: mealPlan.observacoes || undefined,
          } : undefined,
        };

        setAdesaoRawData(evolucaoAdesaoRaw);
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
    
    // Calcula a data de corte de forma segura (YYYY-MM-DD)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeWindow);
    // Ajuste fuso horário local para a string ISO YYYY-MM-DD
    const tzOffset = cutoffDate.getTimezoneOffset() * 60000;
    const cutoffString = new Date(cutoffDate.getTime() - tzOffset).toISOString().split('T')[0];
    
    // Comparação de string YYYY-MM-DD garante que não há bugs de Timezone/JS Engine
    return payloadData.historicoMedidas.filter(m => m.data >= cutoffString);
  }, [timeWindow, payloadData]);

  const chartData = useMemo(() => {
    const dataPoints = [];
    const hoje = new Date();
    // Offset local timezone
    const tzOffset = hoje.getTimezoneOffset() * 60000;
    
    for (let i = timeWindow; i >= 0; i--) {
      const d = new Date(hoje.getTime());
      d.setDate(d.getDate() - i);
      const dataStrIso = new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
      
      const measurement = payloadData?.historicoMedidas.find(m => m.data === dataStrIso);
      const adesao = adesaoRawData.find(a => a.data === dataStrIso);
      
      if (measurement || adesao) {
        dataPoints.push({
          data: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          peso: measurement?.peso || adesao?.peso || undefined,
          cintura: measurement?.circunferenciaCintura ?? undefined,
          quadril: measurement?.circunferenciaQuadril ?? undefined,
          adesao: adesao && adesao.adesaoPercentual > 0 ? adesao.adesaoPercentual : undefined,
        });
      }
    }
    return dataPoints;
  }, [timeWindow, payloadData, adesaoRawData]);

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
