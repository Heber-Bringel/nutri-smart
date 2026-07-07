import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container } from '../../../di/container';
import { EvolutionChartData } from '../../../model/services/IAdesaoService';
import { EvolutionChart } from '../../components/evolucao/EvolutionChart';
import { Paciente } from '../../../model/entities/Paciente';

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

  if (loading) return <div style={{ color: '#9CA3AF', fontSize: 13 }}>Carregando dados de evolução...</div>;

  return (
    <div style={{ paddingBottom: 64 }}>
      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 6, fontSize: 13, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: 32 }}>
          <h3 style={{ margin: '0 0 24px', fontSize: 14, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Evolução de Peso (Últimos 30 dias)
          </h3>
          <EvolutionChart data={data} />
        </div>
      )}
    </div>
  );
}
