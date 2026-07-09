import { useAuth } from '../../../viewmodel/auth/AuthViewModel';

export function PatientDietPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: 32 }}>
      <div style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, background: 'var(--color-primary)',
          borderRadius: 10, margin: '0 auto 20px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>N</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-ink-primary)', marginBottom: 8 }}>
          Área do Paciente
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-ink-secondary)', marginBottom: 24 }}>
          Bem-vindo(a), {user?.nomeCompleto} ({user?.email})
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-ink-tertiary)', marginBottom: 32 }}>
          Seu plano alimentar está disponível em <strong>Meu Plano</strong>.
        </p>
        <button
          onClick={logout}
          style={{
            padding: '8px 16px', cursor: 'pointer', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
            color: 'var(--color-ink-primary)', fontSize: 13, fontWeight: 500,
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
