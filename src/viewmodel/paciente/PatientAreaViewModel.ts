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
    if (!pacienteId) return;
    let cancelled = false;

    (async () => {
      try {
        const [plan, prog, estados, next] = await Promise.all([
          Container.getMealPlanUseCase.execute(pacienteId),
          Container.getDailyProgressUseCase.execute(pacienteId, selectedDate),
          Container.getDailyAdesaoStatesUseCase.execute(pacienteId, selectedDate),
          Container.getNextConsultaUseCase.execute(pacienteId),
        ]);

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

    try {
      await Container.markMealAsCompletedUseCase.execute(refeicaoId, pacienteId, concluida, selectedDate);
      setAdesaoMap(prev => new Map(prev).set(refeicaoId, concluida));

      const [prog, estados] = await Promise.all([
        Container.getDailyProgressUseCase.execute(pacienteId, selectedDate),
        Container.getDailyAdesaoStatesUseCase.execute(pacienteId, selectedDate),
      ]);
      setProgress(prog);
      const map = new Map<string, boolean>();
      for (const e of estados) {
        map.set(e.refeicaoId, e.concluida);
      }
      setAdesaoMap(map);
    } catch (err: unknown) {
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