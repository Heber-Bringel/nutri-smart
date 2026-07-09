import React, { useState } from 'react';
import { usePatientReportViewModel, TimeWindow } from '../../../viewmodel/reports/PatientReportViewModel';
import { EvolutionChart } from '../charts/EvolutionChart';

export const PatientReportDashboard: React.FC = () => {
  const {
    timeWindow,
    setTimeWindow,
    chartData,
    generateReport,
    isGenerating,
    patientName
  } = usePatientReportViewModel();

  const [chartImage, setChartImage] = useState<string | undefined>();

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <header className="flex justify-between items-end border-b pb-4 border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Evolução e Relatórios</h1>
            <p className="text-slate-500">Paciente: {patientName}</p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 font-medium">Período:</label>
              <select 
                className="border-slate-300 rounded-md text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={timeWindow}
                onChange={(e) => setTimeWindow(Number(e.target.value) as TimeWindow)}
              >
                <option value={30}>Últimos 30 dias</option>
                <option value={60}>Últimos 60 dias</option>
                <option value={90}>Últimos 90 dias</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => generateReport(chartImage, 'download')}
                disabled={isGenerating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50 transition-colors"
              >
                {isGenerating ? 'Gerando...' : 'Baixar Relatório PDF'}
              </button>
              <button
                onClick={() => generateReport(chartImage, 'print')}
                disabled={isGenerating}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-md shadow-sm disabled:opacity-50 transition-colors"
              >
                Imprimir
              </button>
            </div>
          </div>
        </header>

        <section>
          <EvolutionChart 
            data={chartData} 
            onCapture={setChartImage}
          />
        </section>

      </div>
    </div>
  );
};
