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
      const canvas = await html2canvas(chartRef.current);
      onCapture(canvas.toDataURL('image/png'));
    }
  };

  React.useEffect(() => {
    if (onCapture) {
      // Allow recharts to render before capturing
      setTimeout(handleCapture, 500);
    }
  }, [data, onCapture]);

  return (
    <div ref={chartRef} className="w-full h-80 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Evolução de Medidas</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="peso" name="Peso (kg)" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="cintura" name="Cintura (cm)" stroke="#82ca9d" />
          <Line yAxisId="right" type="monotone" dataKey="abdominal" name="Abdominal (cm)" stroke="#ffc658" />
          <Line yAxisId="right" type="monotone" dataKey="quadril" name="Quadril (cm)" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
