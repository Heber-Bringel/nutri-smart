import React, { useState } from 'react';
import { usePatientReportViewModel, TimeWindow } from '../../../viewmodel/reports/PatientReportViewModel';
import { EvolutionChart } from '../../components/charts/EvolutionChart';
import { useOutletContext } from 'react-router-dom';
import { Paciente } from '../../../model/entities/Paciente';
import { EvolutionSkeleton } from '../../components/shared/Skeleton';
import { FadeIn } from '../../components/shared/FadeIn';

export const PatientReportDashboard: React.FC = () => {
  const { paciente } = useOutletContext<{ paciente: Paciente }>();
  const {
    timeWindow,
    setTimeWindow,
    chartData,
    generateReport,
    isGenerating,
    isLoading,
    error
  } = usePatientReportViewModel(paciente?.id);

  const [chartImage, setChartImage] = useState<string | undefined>();

  if (isLoading) return <EvolutionSkeleton />;
  if (error) return <div style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <FadeIn>
    <div>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderBottom: '1px solid var(--color-border)', paddingBottom: 20, marginBottom: 24
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--color-ink-primary)' }}>Relatório e Evolução</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-ink-secondary)' }}>
            Gerador de PDF e histórico de medidas
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Período</label>
            <select 
              style={{
                padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                background: 'var(--color-surface)', color: 'var(--color-ink-primary)', fontSize: 13, outline: 'none', cursor: 'pointer'
              }}
              value={timeWindow}
              onChange={(e) => setTimeWindow(Number(e.target.value) as TimeWindow)}
            >
              <option value={30}>Últimos 30 dias</option>
              <option value={60}>Últimos 60 dias</option>
              <option value={90}>Últimos 90 dias</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => generateReport(chartImage, 'print')}
              disabled={isGenerating}
              style={{
                padding: '8px 16px', background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, cursor: 'pointer'
              }}
            >
              Imprimir
            </button>
            <button
              onClick={() => generateReport(chartImage, 'download')}
              disabled={isGenerating}
              style={{
                padding: '8px 16px', background: 'var(--color-primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                opacity: isGenerating ? 0.7 : 1
              }}
            >
              {isGenerating ? 'Gerando...' : 'Baixar PDF'}
            </button>
          </div>
        </div>
      </header>

      <section style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <EvolutionChart 
          data={chartData} 
          onCapture={setChartImage}
        />
        {chartData.length === 0 && (
          <div style={{ marginTop: 16, textAlign: 'center', color: 'var(--color-ink-tertiary)', fontSize: 13 }}>
            Nenhum dado encontrado no período selecionado.
          </div>
        )}
      </section>
    </div>
    </FadeIn>
  );
};
