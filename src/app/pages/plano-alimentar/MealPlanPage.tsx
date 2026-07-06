import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [refeicoes, setRefeicoes] = useState<RefeicaoForm[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    Container.getPacienteUseCase.execute(id)
      .then(p => { if (!cancelled) setPaciente(p); })
      .catch(() => { if (!cancelled) setError('Erro ao carregar paciente.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  async function handleSave() {
    if (!id || !paciente) return;
    setSaving(true);
    setError(null);

    try {
      const existingPlan = await Container.getMealPlanUseCase.execute(id);

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
          pacienteId: id,
          observacoes,
          refeicoes: refeicoesData,
        });
      }

      navigate(`/dashboard/pacientes/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar plano alimentar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>Carregando...</div>;
  }

  if (!paciente) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
          {error || 'Paciente não encontrado.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate(`/dashboard/pacientes/${id}`)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
          ← Voltar
        </button>
      </div>

      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Plano Alimentar</h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Paciente: {paciente.nomeCompleto}
      </p>

      {paciente.imc && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '6px', fontSize: '0.9rem' }}>
          <span><strong>IMC:</strong> {paciente.imc}</span>
          <span><strong>TMB:</strong> {paciente.tmb} kcal</span>
          <span><strong>GET:</strong> {paciente.get} kcal</span>
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
