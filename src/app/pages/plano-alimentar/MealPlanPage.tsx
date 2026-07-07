import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container } from '../../../di/container';
import { Paciente } from '../../../model/entities/Paciente';
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
      // Aqui poderíamos exibir um toast de sucesso.
      alert('Plano alimentar salvo com sucesso!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar plano alimentar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ color: '#9CA3AF', fontSize: 13 }}>Carregando plano alimentar...</div>;
  }

  return (
    <div style={{ paddingBottom: 64 }}>
      {paciente.imc !== undefined && (
        <div style={{ 
          display: 'flex', gap: 24, marginBottom: 32, padding: '16px 20px', 
          backgroundColor: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E5E5' 
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IMC</div>
            <div style={{ fontSize: 14, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace', color: '#111827' }}>{paciente.imc}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TMB</div>
            <div style={{ fontSize: 14, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace', color: '#111827' }}>{paciente.tmb} kcal</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GET</div>
            <div style={{ fontSize: 14, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace', color: '#111827' }}>{paciente.get} kcal</div>
          </div>
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
