import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import { motion, AnimatePresence } from 'framer-motion';

export function PatientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tabStyle = (active: boolean) => ({
    padding: '10px 20px', cursor: 'pointer', borderRadius: 'var(--radius-lg)',
    border: active ? '1px solid var(--color-primary)' : '1px solid transparent', 
    background: active ? 'var(--color-primary-subtle)' : 'transparent',
    color: active ? 'var(--color-primary-text)' : 'var(--color-ink-secondary)', 
    fontSize: 14, fontWeight: 500, transition: 'all 150ms ease-out',
  });

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: 'var(--color-ink-primary)' }}>Área do Paciente</h1>
          <p style={{ color: 'var(--color-ink-secondary)', margin: '4px 0 0', fontSize: 13 }}>
            Bem-vindo(a), {user?.nomeCompleto}
          </p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-ink-primary)', fontSize: 13, fontWeight: 500 }}>
          Sair
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
        <button onClick={() => navigate('/paciente/meu-plano')} style={tabStyle(location.pathname === '/paciente/meu-plano')}>
          Meu Plano Alimentar
        </button>
        <button onClick={() => navigate('/paciente/evolucao')} style={tabStyle(location.pathname === '/paciente/evolucao')}>
          Minha Evolução
        </button>
      </div>

      {/* Como o <AnimatedRoutes> pai (App.tsx) agora tratará o prefixo '/paciente' como uma única página, o reload visual é suprimido. Usamos este AnimatePresence interno para animar apenas o corpo das abas na troca. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
