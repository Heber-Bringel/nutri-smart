import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container } from '../../../di/container';
import type { EvolutionChartData } from '../../../model/services/IAdesaoService';
import { EvolutionChart } from '../../components/evolucao/EvolutionChart';
import type { Paciente } from '../../../model/entities/Paciente';

export function EvolutionChartPage() {
  const { paciente } = useOutletContext<{ paciente: Paciente }>();
  const [data, setData] = useState<EvolutionChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Container.getEvolutionChartDataUseCase.execute(paciente.id, 30)
      .then(result => { if (!cancelled) setData(result); })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar dados.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [paciente.id]);

  if (loading) return <div style={{ color: 'var(--color-ink-tertiary)', fontSize: 13 }}>Carregando dados de evolução...</div>;

  return (
    <div style={{ paddingBottom: 64 }}>
      {error && (
        <div style={{
          padding: '10px 14px', background: 'var(--color-danger-subtle)',
          border: '1px solid var(--color-danger-border)',
          color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 24,
        }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', padding: 32,
        }}>
          <h3 style={{
            margin: '0 0 24px', fontSize: 12, fontWeight: 600,
            color: 'var(--color-ink-secondary)', textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Evolução de Peso (Últimos 30 dias)
          </h3>
          <EvolutionChart data={data} />
        </div>
      )}
    </div>
  );
}
