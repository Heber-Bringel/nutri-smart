import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';

export function NutritionistLayout() {
  const location = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await auth.logout();
      navigate('/login', { replace: true });
    } catch {
      // Se falhar, libera o botão para tentar novamente
      setLoggingOut(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <header style={{
        padding: '0 40px', height: 48, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)',
      }}>
        {/* Logo NutriSmart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/nutrismart-logo.png"
            alt="NutriSmart"
            style={{ height: 40, width: 'auto', objectFit: 'contain' }}
          />
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-ink-primary)', letterSpacing: '-0.01em' }}>
            NutriSmart
          </span>
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

          {/* Botão de logout */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sair"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: loggingOut ? 'var(--color-ink-tertiary)' : 'var(--color-ink-secondary)',
                fontSize: 12,
                fontWeight: 500,
                cursor: loggingOut ? 'not-allowed' : 'pointer',
                transition: 'background 150ms ease-out, color 150ms ease-out',
              }}
              onMouseEnter={(e) => { if (!loggingOut) { e.currentTarget.style.background = 'var(--color-subtle)'; e.currentTarget.style.color = 'var(--color-ink-primary)'; } }}
              onMouseLeave={(e) => { if (!loggingOut) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-ink-secondary)'; } }}
            >
              {/* Ícone logout SVG */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {loggingOut ? 'Saindo...' : 'Sair'}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
