import React, { useMemo } from 'react';
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
  const patientData = useMemo(() => {
    return chartData.map(d => ({
      data: d.data,
      peso: d.peso,
      adesao: d.adesao // Valor real vindo do viewmodel
    }));
  }, [chartData]);

  // Cálculos para o Painel de Resumo
  const stats = useMemo(() => {
    const pesosValidos = patientData.filter(d => d.peso != null && d.peso > 0);
    const pesoAtual = pesosValidos.length > 0 ? pesosValidos[pesosValidos.length - 1].peso : 0;
    const pesoInicial = pesosValidos.length > 0 ? pesosValidos[0].peso : 0;
    
    const variacaoPeso = (pesoAtual && pesoInicial) ? Number((pesoAtual - pesoInicial).toFixed(1)) : 0;
    
    const adesoesValidas = patientData.filter(d => d.adesao != null && d.adesao > 0);
    const adesaoMedia = adesoesValidas.length > 0 
      ? Math.round(adesoesValidas.reduce((acc, curr) => acc + (curr.adesao as number), 0) / adesoesValidas.length) 
      : 0;

    return { pesoAtual, variacaoPeso, adesaoMedia };
  }, [patientData]);

  const historyTable = useMemo(() => {
    return [...patientData].reverse().filter(d => (d.peso && d.peso > 0) || (d.adesao && d.adesao > 0));
  }, [patientData]);

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

  const cardStyle: React.CSSProperties = {
    flex: 1, padding: 20, background: 'var(--color-surface)',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: 4
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 24, fontWeight: 700, color: 'var(--color-ink-primary)', fontFamily: 'var(--font-mono)'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      {/* PAINEL DE RESUMO (WIDGETS) */}
      <motion.div 
        initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', damping: 24, delay: 0.05 }}
        style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
      >
        <div style={cardStyle}>
          <span style={labelStyle}>Peso Atual</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={valueStyle}>{stats.pesoAtual ? `${stats.pesoAtual} kg` : '--'}</span>
          </div>
        </div>

        <div style={cardStyle}>
          <span style={labelStyle}>Variação no Mês</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={valueStyle}>{stats.variacaoPeso > 0 ? `+${stats.variacaoPeso}` : stats.variacaoPeso} kg</span>
            {stats.variacaoPeso !== 0 && (
              <span style={{ fontSize: 13, fontWeight: 600, color: stats.variacaoPeso <= 0 ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                {stats.variacaoPeso <= 0 ? '↓ Ótimo' : '↑ Cuidado'}
              </span>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <span style={labelStyle}>Média de Adesão</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={valueStyle}>{stats.adesaoMedia}%</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: stats.adesaoMedia >= 80 ? 'var(--color-primary)' : 'var(--color-warning)' }}>
              {stats.adesaoMedia >= 80 ? '★ Excelente' : 'Abaixo da meta'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* GRÁFICO */}
      <motion.section 
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.1 }}
        style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', padding: '24px 24px 16px 0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          height: 380
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
              formatter={(value, name) => [
                name === 'Adesão ao Plano' ? `${value}%` : `${value} kg`,
                name === 'Adesão ao Plano' ? 'Adesão' : 'Peso'
              ]}
            />
            <Legend wrapperStyle={{ paddingTop: 20, fontSize: 13, color: 'var(--color-ink-primary)' }} />
            <Line 
              connectNulls={true} yAxisId="left" type="monotone" dataKey="peso" name="Peso" 
              stroke="var(--color-primary)" strokeWidth={3} isAnimationActive={true} 
              activeDot={{ r: 6, strokeWidth: 0 }} dot={{ r: 4, strokeWidth: 0, fill: 'var(--color-primary)' }} 
            />
            <Line 
              connectNulls={true} yAxisId="right" type="monotone" dataKey="adesao" name="Adesão ao Plano" 
              stroke="#3b82f6" strokeWidth={3} isAnimationActive={true} 
              dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }} 
              label={{ position: 'top', fill: '#3b82f6', fontSize: 12, fontWeight: 600, formatter: (val: any) => val ? `${val}%` : '' }}
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </motion.section>

      {/* TABELA DE HISTÓRICO */}
      <motion.section
        initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', damping: 24, delay: 0.15 }}
        style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-ink-primary)' }}>Histórico Detalhado</h3>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--color-ink-tertiary)' }}>
            * Seu peso é atualizado no sistema a cada nova consulta com o nutricionista.
          </p>
        </div>
        {historyTable.length === 0 ? (
           <p style={{ margin: 0, fontSize: 13, color: 'var(--color-ink-tertiary)' }}>Nenhum registro de evolução neste período.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 500, color: 'var(--color-ink-secondary)', borderBottom: '2px solid var(--color-border)' }}>DATA</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 500, color: 'var(--color-ink-secondary)', borderBottom: '2px solid var(--color-border)' }}>PESO</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 500, color: 'var(--color-ink-secondary)', borderBottom: '2px solid var(--color-border)' }}>ADESÃO</th>
                </tr>
              </thead>
              <tbody>
                {historyTable.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--color-ink-primary)' }}>{row.data}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--color-ink-primary)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{row.peso ? `${row.peso} kg` : '--'}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--color-ink-primary)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{row.adesao ? `${row.adesao}%` : '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
};
