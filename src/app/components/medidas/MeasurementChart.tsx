import { useState } from 'react';
import type { BodyMeasurement } from '../../../model/entities/BodyMeasurement';

type MeasurementKey = 'circunferenciaCintura' | 'circunferenciaQuadril' | 'circunferenciaBraco' | 'circunferenciaCoxa' | 'percentualGordura' | 'dobrasCutaneasMm';

const MEASUREMENT_LABELS: Record<MeasurementKey, string> = {
  circunferenciaCintura: 'Cintura (cm)',
  circunferenciaQuadril: 'Quadril (cm)',
  circunferenciaBraco: 'Braço (cm)',
  circunferenciaCoxa: 'Coxa (cm)',
  percentualGordura: '% Gordura',
  dobrasCutaneasMm: 'Dobras (mm)',
};

const MEASUREMENT_OPTIONS: { key: MeasurementKey; label: string }[] = [
  { key: 'circunferenciaCintura', label: 'Cintura' },
  { key: 'circunferenciaQuadril', label: 'Quadril' },
  { key: 'circunferenciaBraco', label: 'Braço' },
  { key: 'circunferenciaCoxa', label: 'Coxa' },
  { key: 'percentualGordura', label: '% Gordura' },
  { key: 'dobrasCutaneasMm', label: 'Dobras' },
];

interface MeasurementChartProps {
  data: BodyMeasurement[];
}

export function MeasurementChart({ data }: MeasurementChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MeasurementKey>('circunferenciaCintura');

  const chartHeight = 250;
  const chartWidth = 600;
  const padding = { top: 24, right: 24, bottom: 40, left: 50 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const sorted = [...data].sort((a, b) => new Date(a.dataAtendimento).getTime() - new Date(b.dataAtendimento).getTime());
  const filtered = sorted.filter(d => d[selectedMetric] != null);
  const points = filtered.map(d => d[selectedMetric]!);

  const maxVal = Math.max(...points, 0);
  const minVal = Math.min(...points, 0);
  const range = maxVal - minVal || 1;

  function getY(val: number) {
    return padding.top + innerH - ((val - minVal) / range) * innerH * 0.9;
  }

  function getX(i: number) {
    return padding.left + (i / Math.max(filtered.length - 1, 1)) * innerW;
  }

  const dateLabels = sorted.filter((_, i) => i % Math.max(1, Math.floor(sorted.length / 5)) === 0 || i === sorted.length - 1);

  if (points.length < 2) {
    return (
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <h3 style={{
            margin: 0, fontSize: 12, fontWeight: 600,
            color: 'var(--color-ink-secondary)', textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Gráfico de Medidas
          </h3>
        </div>
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', padding: 20, textAlign: 'center',
          color: 'var(--color-ink-tertiary)', fontSize: 13,
        }}>
          Registre ao menos duas medidas para exibir o gráfico.
        </div>
      </div>
    );
  }

  const color = 'var(--color-primary)';

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h3 style={{
          margin: 0, fontSize: 12, fontWeight: 600,
          color: 'var(--color-ink-secondary)', textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Gráfico de Medidas
        </h3>
        <select
          value={selectedMetric}
          onChange={e => setSelectedMetric(e.target.value as MeasurementKey)}
          style={{
            padding: '4px 8px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)', fontSize: 12,
            fontFamily: 'var(--font-body)', outline: 'none',
            background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
            cursor: 'pointer',
          }}
        >
          {MEASUREMENT_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: 20,
      }}>
        <div style={{ overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', maxWidth: `${chartWidth}px` }}>

            {/* Grid horizontal */}
            {Array.from({ length: 5 }, (_, i) => {
              const val = minVal + (range * i) / 4;
              const y = getY(val);
              return (
                <g key={i}>
                  <line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} stroke="var(--color-border-light)" strokeWidth="1" />
                  <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-tertiary)">
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Linha */}
            {filtered.length > 1 && (
              <polyline
                points={filtered.map((_, i) => `${getX(i)},${getY(filtered[i][selectedMetric]!)}`).join(' ')}
                fill="none" stroke={color} strokeWidth="2" />
            )}

            {/* Pontos + valores */}
            {filtered.map((d, i) => {
              const x = getX(i);
              const y = getY(d[selectedMetric]!);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="3" fill={color} stroke="#fff" strokeWidth="1.5">
                    <title>{d[selectedMetric]} {MEASUREMENT_LABELS[selectedMetric]} em {new Date(d.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR')}</title>
                  </circle>
                  {i % Math.max(1, Math.floor(filtered.length / 4)) === 0 && (
                    <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fill={color} fontFamily="var(--font-mono)">
                      {d[selectedMetric]}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Rótulos do eixo X */}
            {dateLabels.map((d) => {
              const idx = sorted.indexOf(d);
              const x = padding.left + (idx / Math.max(sorted.length - 1, 1)) * innerW;
              return (
                <text key={idx} x={x} y={chartHeight - 5} textAnchor="middle" fontSize="10" fill="var(--color-ink-tertiary)">
                  {new Date(d.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </text>
              );
            })}

            {/* Eixo Y */}
            <text x={10} y={padding.top + innerH / 2} textAnchor="middle" fontSize="10" fill={color}
              transform={`rotate(-90, 10, ${padding.top + innerH / 2})`}>
              {MEASUREMENT_LABELS[selectedMetric]}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
