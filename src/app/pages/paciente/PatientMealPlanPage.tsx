import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import { useNavigate } from 'react-router-dom';
import { usePatientAreaViewModel } from '../../../viewmodel/paciente/PatientAreaViewModel';
import { AdherenceToggle } from '../../components/paciente/AdherenceToggle';
import { ProgressBar } from '../../components/paciente/ProgressBar';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { motion } from 'framer-motion';

export function PatientMealPlanPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const vm = usePatientAreaViewModel(user?.pacienteId);

  if (vm.loading) {
    return (
      <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
        <LoadingSkeleton lines={4} />
      </div>
    );
  }

  const headerBtn = {
    padding: '8px 16px', cursor: 'pointer', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', background: 'var(--color-surface)',
    color: 'var(--color-ink-primary)', fontSize: 13, fontWeight: 500,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: 'var(--color-ink-primary)' }}>Meu Plano Alimentar</h1>
          <p style={{ color: 'var(--color-ink-secondary)', margin: '4px 0 0', fontSize: 13 }}>
            Bem-vindo(a), {user?.nomeCompleto}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/paciente/evolucao')} style={headerBtn}>
            Evolução
          </button>
          <button onClick={logout} style={{...headerBtn, background: 'var(--color-bg)'}}>
            Sair
          </button>
        </div>
      </div>

      {vm.error && (
        <div style={{
          padding: '10px 14px', background: 'var(--color-danger-subtle)',
          border: '1px solid var(--color-danger-border)',
          color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16,
        }}>
          {vm.error}
        </div>
      )}

      {vm.nextConsulta ? (
        <div style={{
          padding: '16px 20px', marginBottom: 24,
          border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-lg)',
          background: 'var(--color-primary-subtle)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: 'var(--color-primary-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Proxima Consulta
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: 'var(--color-ink-primary)' }}>
              {new Date(vm.nextConsulta.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
              })} • {vm.nextConsulta.horarioInicio.slice(0, 5)} às {vm.nextConsulta.horarioFim.slice(0, 5)}
            </p>
            {vm.nextConsulta.observacoes && (
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-ink-secondary)' }}>
                {vm.nextConsulta.observacoes}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          padding: '12px 16px', marginBottom: 24,
          border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
          background: 'var(--color-bg)', textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-ink-tertiary)' }}>
            Nenhuma consulta agendada.
          </p>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <label style={{
          display: 'block', fontSize: 11, color: 'var(--color-ink-secondary)',
          textTransform: 'uppercase', marginBottom: 6, fontWeight: 500, letterSpacing: '0.05em',
        }}>
          Data
        </label>
        <input
          type="date"
          value={vm.selectedDate}
          onChange={e => vm.setSelectedDate(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)', fontSize: 13,
            fontFamily: 'var(--font-mono)', outline: 'none',
            color: 'var(--color-ink-primary)', background: 'var(--color-surface)',
            transition: 'border-color 150ms ease-out',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {vm.progress && (
        <ProgressBar
          concluidas={vm.progress.concluidas}
          total={vm.progress.totalRefeicoes}
          percentual={vm.progress.percentual}
        />
      )}

      {!vm.mealPlan ? (
        <div style={{
          textAlign: 'center', padding: 48, color: 'var(--color-ink-tertiary)',
          border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
        }}>
          <p style={{ fontSize: 14 }}>Nenhum plano alimentar disponível.</p>
          <p style={{ fontSize: 13 }}>Seu nutricionista ainda não cadastrou um plano para você.</p>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {vm.mealPlan.refeicoes
            .sort((a, b) => a.ordem - b.ordem)
            .map(refeicao => (
              <motion.div
                variants={itemVariants}
                key={refeicao.id}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  marginBottom: 16,
                  background: 'var(--color-surface)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-ink-primary)' }}>
                      {refeicao.nome}
                    </h3>
                    {refeicao.horarioSugerido && (
                      <span style={{ fontSize: 12, color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {refeicao.horarioSugerido}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                      {refeicao.totalCalorias ?? 0} kcal
                    </span>
                    <AdherenceToggle
                      refeicaoId={refeicao.id}
                      concluida={vm.adesaoMap.get(refeicao.id) ?? false}
                      onToggle={(id, concluida) => vm.handleToggle(id, concluida, user?.pacienteId || '')}
                    />
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg)' }}>
                      <th style={thStyle}>Alimento</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Qtd</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Cal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refeicao.alimentos.map(ali => (
                      <tr key={ali.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                        <td style={tdStyle}>{ali.nome}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{ali.quantidade}{ali.unidadeMedida}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{ali.calorias}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ))}
        </motion.div>
      )}
    </motion.div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '8px 12px', fontWeight: 500,
  fontSize: 11, color: 'var(--color-ink-secondary)', textTransform: 'uppercase',
  letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)',
};
const tdStyle: React.CSSProperties = {
  padding: '8px 12px', color: 'var(--color-ink-primary)', fontSize: 13,
};