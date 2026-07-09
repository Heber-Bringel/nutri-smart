import React from 'react';
import { usePatientReportViewModel } from '../../../viewmodel/reports/PatientReportViewModel';
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

export const PatientEvolutionView: React.FC = () => {
  // O paciente enxerga apenas 30 dias (mockado aqui via viewmodel, limitando dados)
  const { chartData } = usePatientReportViewModel();

  // Filtramos os dados para garantir que apenas os últimos 30 dias sejam visíveis e apenas peso
  const patientData = chartData.slice(-30).map(d => ({
    data: d.data,
    peso: d.peso,
    adesao: 80 + Math.random() * 20 // Mock adesão entre 80 e 100%
  }));

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b pb-4 border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">Minha Evolução</h1>
          <p className="text-slate-500">Histórico de Peso e Adesão (Últimos 30 dias)</p>
        </header>

        <section className="w-full h-80 bg-white p-4 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={patientData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="peso" name="Peso (kg)" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="adesao" name="Adesão ao Plano (%)" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
};
