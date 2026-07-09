import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';

export function NutritionistLayout() {
  const location = useLocation();
  const auth = useAuth();

  const userName = auth.user?.email?.split('@')[0] || 'User';
  const initials = userName.substring(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <header style={{
        padding: '0 40px', height: 48, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 18, height: 18, background: 'var(--color-primary)', borderRadius: 4 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink-primary)' }}>NutriSmart</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <nav style={{ display: 'flex', gap: 4 }}>
            <Link
              to="/dashboard/pacientes"
              style={{
                textDecoration: 'none',
                fontSize: 13,
                padding: '0 12px',
                height: 48,
                display: 'flex',
                alignItems: 'center',
                color: location.pathname.includes('/pacientes') ? 'var(--color-ink-primary)' : 'var(--color-ink-tertiary)',
                fontWeight: location.pathname.includes('/pacientes') ? 500 : 400,
                borderBottom: location.pathname.includes('/pacientes') ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'color 150ms ease-out, border-color 150ms ease-out',
              }}
            >
              Pacientes
            </Link>
            <Link
              to="/dashboard/agenda"
              style={{
                textDecoration: 'none',
                fontSize: 13,
                padding: '0 12px',
                height: 48,
                display: 'flex',
                alignItems: 'center',
                color: location.pathname.includes('/agenda') ? 'var(--color-ink-primary)' : 'var(--color-ink-tertiary)',
                fontWeight: location.pathname.includes('/agenda') ? 500 : 400,
                borderBottom: location.pathname.includes('/agenda') ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'color 150ms ease-out, border-color 150ms ease-out',
              }}
            >
              Agenda
            </Link>
          </nav>
          <div
            title="Sair"
            onClick={() => auth.logout()}
            style={{
              width: 26, height: 26, borderRadius: '50%', background: 'var(--color-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: 'var(--color-ink-secondary)', cursor: 'pointer', fontWeight: 600,
            }}
          >
            {initials}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
