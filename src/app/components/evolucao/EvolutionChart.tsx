import type { EvolutionChartData } from '../../../model/services/IAdesaoService';

interface EvolutionChartProps {
  data: EvolutionChartData[];
}

export function EvolutionChart({ data }: EvolutionChartProps) {
  const maxPeso = Math.max(...data.map(d => d.peso ?? 0), 0);
  const chartHeight = 250;
  const chartWidth = 600;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const pesoPoints = data
    .filter(d => d.peso != null)
    .map((d, i) => {
      const x = padding.left + (i / Math.max(data.length - 1, 1)) * innerW;
      const y = padding.top + innerH - ((d.peso ?? 0) / (maxPeso || 1)) * innerH * 0.9;
      return `${x},${y}`;
    });

  const adesaoPoints = data
    .map((d, i) => {
      const x = padding.left + (i / Math.max(data.length - 1, 1)) * innerW;
      const y = padding.top + innerH - (d.adesaoPercentual / 100) * innerH * 0.9;
      return `${x},${y}`;
    });

  const labels = data.filter((_, i) => i % 5 === 0 || i === data.length - 1);

  if (data.length === 0 || data.every(d => !d.peso && d.adesaoPercentual === 0)) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-ink-tertiary)', fontSize: 13 }}>
        Nenhum dado disponível para o período selecionado.
      </div>
    );
  }

  const pesoColor = '#10B981';
  const adesaoColor = '#6B7280';

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', maxWidth: `${chartWidth}px` }}>
        {labels.map((d, i) => {
          const idx = data.indexOf(d);
          const x = padding.left + (idx / Math.max(data.length - 1, 1)) * innerW;
          return (
            <text key={i} x={x} y={chartHeight - 5} textAnchor="middle" fontSize="10" fill="var(--color-ink-tertiary, #9CA3AF)">
              {new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </text>
          );
        })}

        {pesoPoints.length > 1 && (
          <polyline points={pesoPoints.join(' ')} fill="none" stroke={pesoColor} strokeWidth="2" />
        )}

        {adesaoPoints.length > 1 && (
          <polyline points={adesaoPoints.join(' ')} fill="none" stroke={adesaoColor} strokeWidth="2" strokeDasharray="4" />
        )}

        <text x={10} y={padding.top + innerH / 2} textAnchor="middle" fontSize="10" fill={pesoColor} transform={`rotate(-90, 10, ${padding.top + innerH / 2})`}>
          Peso (kg)
        </text>

        <text x={chartWidth - 5} y={padding.top + innerH / 2} textAnchor="middle" fontSize="10" fill={adesaoColor} transform={`rotate(90, ${chartWidth - 5}, ${padding.top + innerH / 2})`}>
          Adesão (%)
        </text>

        <text x={chartWidth - 100} y={15} fontSize="11" fill={pesoColor}>— Peso</text>
        <text x={chartWidth - 50} y={15} fontSize="11" fill={adesaoColor}>- - Adesão</text>
      </svg>
    </div>
  );
}
