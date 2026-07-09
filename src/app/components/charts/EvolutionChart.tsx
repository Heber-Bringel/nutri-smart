import React, { useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import html2canvas from 'html2canvas';

interface EvolutionChartProps {
  data: Array<{
    data: string;
    peso: number;
    cintura?: number;
    abdominal?: number;
    quadril?: number;
  }>;
  onCapture?: (base64Image: string) => void;
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ data, onCapture }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleCapture = async () => {
    if (chartRef.current && onCapture) {
      const originalWidth = chartRef.current.style.width;
      const w = chartRef.current.clientWidth;
      
      // html2canvas fails with ResponsiveContainer if the width is not explicitly set in pixels
      if (w > 0) {
        chartRef.current.style.width = `${w}px`;
      }
      
      try {
        const canvas = await html2canvas(chartRef.current, { scale: 2 });
        onCapture(canvas.toDataURL('image/png'));
      } finally {
        chartRef.current.style.width = originalWidth;
      }
    }
  };

  React.useEffect(() => {
    if (onCapture) {
      // Allow recharts to render before capturing
      setTimeout(handleCapture, 500);
    }
  }, [data, onCapture]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: 400, background: 'var(--color-surface)', position: 'relative', padding: '10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
          <XAxis dataKey="data" tick={{ fontSize: 12, fill: 'var(--color-ink-secondary)' }} axisLine={false} tickLine={false} dy={10} />
          <YAxis yAxisId="left" tick={{ fontSize: 12, fill: 'var(--color-ink-secondary)' }} axisLine={false} tickLine={false} dx={-10} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: 'var(--color-ink-secondary)' }} axisLine={false} tickLine={false} dx={10} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13 }}
          />
          <Legend wrapperStyle={{ paddingTop: 20, fontSize: 13, color: 'var(--color-ink-primary)' }} />
          <Line yAxisId="left" type="monotone" dataKey="peso" name="Peso (kg)" stroke="var(--color-primary)" strokeWidth={3} isAnimationActive={false} activeDot={{ r: 6, strokeWidth: 0 }} dot={{ r: 4, strokeWidth: 0, fill: 'var(--color-primary)' }} />
          <Line yAxisId="right" type="monotone" dataKey="cintura" name="Cintura (cm)" stroke="#f97316" strokeWidth={2} isAnimationActive={false} dot={{ r: 3, strokeWidth: 0, fill: '#f97316' }} />
          <Line yAxisId="right" type="monotone" dataKey="quadril" name="Quadril (cm)" stroke="#f43f5e" strokeWidth={2} isAnimationActive={false} dot={{ r: 3, strokeWidth: 0, fill: '#f43f5e' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
