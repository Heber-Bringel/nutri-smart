import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container } from '../../../di/container';
import type { Paciente } from '../../../model/entities/Paciente';
import { MealPlanForm } from '../../components/plano-alimentar/MealPlanForm';

interface RefeicaoForm {
  nome: string;
  ordem: number;
  horarioSugerido: string;
  alimentos: { nome: string; quantidade: number; unidadeMedida: string; calorias: number }[];
}

export function MealPlanPage() {
  const { paciente } = useOutletContext<{ paciente: Paciente }>();
  const [observacoes, setObservacoes] = useState('');
  const [refeicoes, setRefeicoes] = useState<RefeicaoForm[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Container.getMealPlanUseCase.execute(paciente.id)
      .then(existingPlan => {
        if (!cancelled && existingPlan) {
          setObservacoes(existingPlan.observacoes || '');
          setRefeicoes(existingPlan.refeicoes || []);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar plano alimentar.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [paciente.id]);

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      const existingPlan = await Container.getMealPlanUseCase.execute(paciente.id);

      const refeicoesData = refeicoes.map(r => ({
        nome: r.nome,
        ordem: r.ordem,
        horarioSugerido: r.horarioSugerido || null,
        alimentos: r.alimentos.map(a => ({
          nome: a.nome,
          quantidade: a.quantidade,
          unidadeMedida: a.unidadeMedida,
          calorias: a.calorias,
        })),
      }));

      if (existingPlan) {
        await Container.updateMealPlanUseCase.execute(existingPlan.id, {
          observacoes,
          refeicoes: refeicoesData,
        });
      } else {
        await Container.createMealPlanUseCase.execute({
          pacienteId: paciente.id,
          observacoes,
          refeicoes: refeicoesData,
        });
      }
      setSuccessMsg('Plano alimentar salvo com sucesso!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar plano alimentar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ color: 'var(--color-ink-tertiary)', fontSize: 13 }}>Carregando plano alimentar...</div>;
  }

  return (
    <div style={{ paddingBottom: 64 }}>
      {paciente.imc !== undefined && (
        <div style={{
          display: 'flex', gap: 24, marginBottom: 32, padding: '16px 20px',
          background: 'var(--color-subtle)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <div>
            <div style={{
              fontSize: 11, color: 'var(--color-ink-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              IMC
            </div>
            <div style={{
              fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-mono)',
              color: 'var(--color-ink-primary)',
            }}>
              {paciente.imc}
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 11, color: 'var(--color-ink-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              TMB
            </div>
            <div style={{
              fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-mono)',
              color: 'var(--color-ink-primary)',
            }}>
              {paciente.tmb} kcal
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 11, color: 'var(--color-ink-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              GET
            </div>
            <div style={{
              fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-mono)',
              color: 'var(--color-ink-primary)',
            }}>
              {paciente.get} kcal
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div style={{
          padding: '10px 14px', background: 'var(--color-success-subtle)',
          border: '1px solid var(--color-success-border)',
          color: 'var(--color-primary-text)', borderRadius: 'var(--radius-md)',
          fontSize: 13, marginBottom: 24,
        }}>
          {successMsg}
        </div>
      )}

      <MealPlanForm
        observacoes={observacoes}
        refeicoes={refeicoes}
        onObservacoesChange={setObservacoes}
        onRefeicoesChange={setRefeicoes}
        onSave={handleSave}
        saving={saving}
        erro={error}
      />
    </div>
  );
}
