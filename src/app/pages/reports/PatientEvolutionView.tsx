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
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { motion } from 'framer-motion';

export const PatientEvolutionView: React.FC = () => {
  const { user } = useAuth();
  // O paciente enxerga os últimos 30 dias por padrão
  const { chartData, isLoading, error } = usePatientReportViewModel(user?.pacienteId, 30);

  // Filtramos os dados para garantir que apenas o peso e adesão sejam exibidos
  const patientData = chartData.map(d => ({
    data: d.data,
    peso: d.peso,
    adesao: d.adesao // Valor real vindo do viewmodel
  }));

  if (isLoading) {
    return (
      <div>
        <LoadingSkeleton lines={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'var(--color-danger)' }}>
        {error}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
    >

      <motion.section 
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.1 }}
        style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          height: 400
        }}
      >
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
            <Line connectNulls={true} yAxisId="left" type="monotone" dataKey="peso" name="Peso (kg)" stroke="var(--color-primary)" strokeWidth={3} isAnimationActive={true} activeDot={{ r: 6, strokeWidth: 0 }} dot={{ r: 4, strokeWidth: 0, fill: 'var(--color-primary)' }} />
            <Line connectNulls={true} yAxisId="right" type="monotone" dataKey="adesao" name="Adesão ao Plano (%)" stroke="#3b82f6" strokeWidth={3} isAnimationActive={true} dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
        )}
      </motion.section>
    </motion.div>
  );
};
