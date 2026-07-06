import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../../di/container';
import { EvolutionChartData } from '../../../model/services/IAdesaoService';
import { EvolutionChart } from '../../components/evolucao/EvolutionChart';

export function EvolutionChartPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<EvolutionChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    Container.getEvolutionChartDataUseCase.execute(id, 30)
      .then(result => { if (!cancelled) setData(result); })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar dados.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate(`/dashboard/pacientes/${id}`)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
          ← Voltar
        </button>
      </div>

      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Evolução do Paciente</h1>

      {loading && <div>Carregando dados...</div>}

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && <EvolutionChart data={data} />}
    </div>
  );
}
