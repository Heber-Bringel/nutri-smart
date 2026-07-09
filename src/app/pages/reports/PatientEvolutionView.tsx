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
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import { useNavigate } from 'react-router-dom';

export const PatientEvolutionView: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // O paciente enxerga os últimos 30 dias por padrão
  const { chartData, isLoading, error } = usePatientReportViewModel(user?.pacienteId, 30);

  // Filtramos os dados para garantir que apenas o peso e adesão sejam exibidos
  const patientData = chartData.map(d => ({
    data: d.data,
    peso: d.peso,
    adesao: d.adesao // Valor real vindo do viewmodel
  }));

  const headerBtn = {
    padding: '8px 16px', cursor: 'pointer', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', background: 'var(--color-surface)',
    color: 'var(--color-ink-primary)', fontSize: 13, fontWeight: 500,
  };

  if (isLoading) return <div style={{ padding: 32 }}>Carregando evolução...</div>;
  if (error) return <div style={{ padding: 32, color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto', animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: 'var(--color-ink-primary)' }}>Minha Evolução</h1>
          <p style={{ color: 'var(--color-ink-secondary)', margin: '4px 0 0', fontSize: 13 }}>
            Histórico de Peso e Adesão (últimos 6 meses)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/paciente/meu-plano')} style={headerBtn}>
            Meu Plano
          </button>
          <button onClick={logout} style={{...headerBtn, background: 'var(--color-bg)'}}>
            Sair
          </button>
        </div>
      </div>

      <section style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        height: 400
      }}>
        {patientData.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-ink-tertiary)', fontSize: 13 }}>
            Nenhum dado encontrado para gerar o gráfico.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={patientData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
            <XAxis dataKey="data" tick={{ fontSize: 12, fill: 'var(--color-ink-secondary)' }} axisLine={false} tickLine={false} dy={10} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: 'var(--color-ink-secondary)' }} axisLine={false} tickLine={false} dx={-10} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--color-ink-secondary)' }} axisLine={false} tickLine={false} dx={10} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13 }}
            />
            <Legend wrapperStyle={{ paddingTop: 20, fontSize: 13, color: 'var(--color-ink-primary)' }} />
            <Line yAxisId="left" type="monotone" dataKey="peso" name="Peso (kg)" stroke="var(--color-primary)" strokeWidth={3} isAnimationActive={false} activeDot={{ r: 6, strokeWidth: 0 }} dot={{ r: 4, strokeWidth: 0, fill: 'var(--color-primary)' }} />
            <Line yAxisId="right" type="monotone" dataKey="adesao" name="Adesão ao Plano (%)" stroke="#3b82f6" strokeWidth={3} isAnimationActive={false} dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
        )}
      </section>
    </div>
  );
};
