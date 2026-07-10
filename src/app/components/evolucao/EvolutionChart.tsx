import type { EvolutionChartData } from '../../../model/services/IAdesaoService';

interface EvolutionChartProps {
  data: EvolutionChartData[];
}

export function EvolutionChart({ data }: EvolutionChartProps) {
  const maxPeso = Math.max(...data.map(d => d.peso ?? 0), 0);
  const chartHeight = 250;
  const chartWidth = 600;
  const padding = { top: 24, right: 24, bottom: 40, left: 50 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const hasPeso = data.some(d => d.peso != null);
  const maxAdesao = 100;

  function getPesoY(peso: number) {
    return padding.top + innerH - (peso / (maxPeso || 1)) * innerH * 0.9;
  }

  function getAdesaoY(adesao: number) {
    return padding.top + innerH - (adesao / maxAdesao) * innerH * 0.9;
  }

  function getX(i: number, total: number) {
    return padding.left + (i / Math.max(total - 1, 1)) * innerW;
  }

  const pesoData = data.filter(d => d.peso != null);
  const adesaoData = data;

  const labels = data.filter((_, i) => i % 5 === 0 || i === data.length - 1);

  if (data.length === 0 || data.every(d => !d.peso && d.adesaoPercentual === 0)) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-ink-tertiary)', fontSize: 13 }}>
        Nenhum registro de evolução encontrado.
      </div>
    );
  }

  const pesoColor = '#10B981';
  const adesaoColor = '#6B7280';

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', maxWidth: `${chartWidth}px` }}>

        {/* Grid horizontal */}
        {[0, 25, 50, 75, 100].map(v => {
          const y = getAdesaoY(v);
          return (
            <g key={v}>
              <line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} stroke="var(--color-border-light)" strokeWidth="1" />
              <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-tertiary)">{v}</text>
            </g>
          );
        })}

        {/* Linha de adesão */}
        {adesaoData.length > 1 && (
          <polyline
            points={adesaoData.map((d, i) => `${getX(i, adesaoData.length)},${getAdesaoY(d.adesaoPercentual)}`).join(' ')}
            fill="none" stroke={adesaoColor} strokeWidth="2" strokeDasharray="4" />
        )}

        {/* Pontos + valores de adesão */}
        {adesaoData.map((d, i) => {
          const x = getX(i, adesaoData.length);
          const y = getAdesaoY(d.adesaoPercentual);
          return (
            <g key={`adesao-${i}`}>
              <circle cx={x} cy={y} r="3" fill={adesaoColor} stroke="#fff" strokeWidth="1.5">
                <title>{d.adesaoPercentual}% em {new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR')}</title>
              </circle>
              {i % 3 === 0 && (
                <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fill={adesaoColor}>{d.adesaoPercentual}%</text>
              )}
            </g>
          );
        })}

        {/* Linha de peso */}
        {hasPeso && pesoData.length > 1 && (
          <polyline
            points={pesoData.map((d) => {
              const idx = data.indexOf(d);
              return `${getX(idx, data.length)},${getPesoY(d.peso!)}`;
            }).join(' ')}
            fill="none" stroke={pesoColor} strokeWidth="2" />
        )}

        {/* Pontos + valores de peso */}
        {hasPeso && pesoData.map((d, i) => {
          const idx = data.indexOf(d);
          const x = getX(idx, data.length);
          const y = getPesoY(d.peso!);
          return (
            <g key={`peso-${i}`}>
              <circle cx={x} cy={y} r="3" fill={pesoColor} stroke="#fff" strokeWidth="1.5">
                <title>{d.peso} kg em {new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR')}</title>
              </circle>
              {i % 3 === 0 && (
                <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fill={pesoColor} fontFamily="var(--font-mono)">{d.peso}</text>
              )}
            </g>
          );
        })}

        {/* Rótulos do eixo X */}
        {labels.map((d) => {
          const idx = data.indexOf(d);
          const x = getX(idx, data.length);
          return (
            <text key={idx} x={x} y={chartHeight - 5} textAnchor="middle" fontSize="10" fill="var(--color-ink-tertiary)">
              {new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </text>
          );
        })}

        {/* Eixo Y esquerdo - Peso */}
        <text x={10} y={padding.top + innerH / 2} textAnchor="middle" fontSize="10" fill={pesoColor}
          transform={`rotate(-90, 10, ${padding.top + innerH / 2})`}>
          Peso (kg)
        </text>

        {/* Eixo Y direito - Adesão */}
        <text x={chartWidth - 5} y={padding.top + innerH / 2} textAnchor="middle" fontSize="10" fill={adesaoColor}
          transform={`rotate(90, ${chartWidth - 5}, ${padding.top + innerH / 2})`}>
          Adesão (%)
        </text>

        {/* Legenda */}
        <rect x={chartWidth - 130} y={6} width={124} height={28} rx="6" fill="var(--color-bg)" opacity="0.9" />
        <circle cx={chartWidth - 120} cy={14} r="3" fill={pesoColor} />
        <text x={chartWidth - 112} y={17} fontSize="10" fill={pesoColor}>Peso</text>
        <line x1={chartWidth - 120} y1={26} x2={chartWidth - 108} y2={26} stroke={adesaoColor} strokeWidth="2" strokeDasharray="3" />
        <text x={chartWidth - 104} y={29} fontSize="10" fill={adesaoColor}>Adesão</text>
      </svg>
    </div>
  );
}
