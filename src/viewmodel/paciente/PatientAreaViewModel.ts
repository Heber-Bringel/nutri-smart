import { useState, useEffect } from 'react';
import { Container } from '../../di/container';
import { MealPlan } from '../../model/entities/MealPlan';
import { DailyProgress } from '../../model/entities/Adesao';
import { Consulta } from '../../model/entities/Consulta';
import { getTodayLocal } from '../../shared/utils/date';

export interface PatientAreaViewModelState {
  mealPlan: MealPlan | null;
  progress: DailyProgress | null;
  selectedDate: string;
  loading: boolean;
  error: string | null;
  adesaoMap: Map<string, boolean>;
  nextConsulta: Consulta | null;
}

export interface PatientAreaViewModelActions {
  setSelectedDate: (date: string) => void;
  handleToggle: (refeicaoId: string, concluida: boolean, pacienteId: string) => Promise<void>;
}

export function usePatientAreaViewModel(pacienteId?: string): PatientAreaViewModelState & PatientAreaViewModelActions {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adesaoMap, setAdesaoMap] = useState<Map<string, boolean>>(new Map());
  const [nextConsulta, setNextConsulta] = useState<Consulta | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!pacienteId) { setLoading(false); return; }
    let cancelled = false;

    (async () => {
      try {
        const [plan, prog, estadosRaw, next] = await Promise.all([
          Container.getMealPlanUseCase.execute(pacienteId),
          Container.getDailyProgressUseCase.execute(pacienteId, selectedDate),
          Container.getDailyAdesaoStatesUseCase.execute(pacienteId, selectedDate),
          Container.getNextConsultaUseCase.execute(pacienteId),
        ]);

        // Guard defensivo: garante que estadosRaw é sempre um array iterável
        const estados = Array.isArray(estadosRaw) ? estadosRaw : [];

        if (!cancelled) {
          setMealPlan(plan);
          setProgress(prog);
          const map = new Map<string, boolean>();
          for (const e of estados) {
            map.set(e.refeicaoId, e.concluida);
          }
          setAdesaoMap(map);
          setNextConsulta(next);
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar plano.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [pacienteId, selectedDate]);

  async function handleToggle(refeicaoId: string, concluida: boolean, pacienteId: string) {
    if (!pacienteId) return;

    // Snapshot do estado atual para possível rollback
    const previousMap = new Map(adesaoMap);
    const previousProgress = progress;

    // 1. Atualização Otimista: Feedback imediato na UI
    setAdesaoMap(prev => new Map(prev).set(refeicaoId, concluida));

    if (progress && mealPlan) {
      const total = mealPlan.refeicoes.length;
      let concluidas = progress.concluidas;
      if (concluida) concluidas++;
      else concluidas = Math.max(0, concluidas - 1);
      
      setProgress({
        concluidas,
        totalRefeicoes: total,
        percentual: total > 0 ? Math.round((concluidas / total) * 100) : 0
      });
    }

    try {
      // 2. Persiste em background
      await Container.markMealAsCompletedUseCase.execute(refeicaoId, pacienteId, concluida, selectedDate);

      // 3. Re-sincronização silenciosa (evita que a tela trave aguardando essa promessa)
      Container.getDailyProgressUseCase.execute(pacienteId, selectedDate).then(prog => setProgress(prog)).catch(() => {});
      Container.getDailyAdesaoStatesUseCase.execute(pacienteId, selectedDate).then(estadosRaw => {
        const estados = Array.isArray(estadosRaw) ? estadosRaw : [];
        const map = new Map<string, boolean>();
        for (const e of estados) {
          map.set(e.refeicaoId, e.concluida);
        }
        setAdesaoMap(map);
      }).catch(() => {});
    } catch (err: unknown) {
      // Em caso de erro de rede, faz rollback suave
      setAdesaoMap(previousMap);
      setProgress(previousProgress);
      setError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.');
    }
  }

  function handleSetSelectedDate(date: string) {
    setSelectedDate(date);
    setLoading(true);
  }

  return {
    mealPlan, progress, selectedDate, loading, error, adesaoMap, nextConsulta,
    setSelectedDate: handleSetSelectedDate,
    handleToggle,
  };
}