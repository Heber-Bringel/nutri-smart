import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('');
  const { user, login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'nutricionista') {
        navigate('/dashboard/pacientes', { replace: true });
      } else {
        navigate('/paciente/meu-plano', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Limpa a flag de logout voluntário ao montar a página de login
    sessionStorage.removeItem('logout_voluntario');
  }, []);

  useEffect(() => {
    if (searchParams.get('sessionExpired') === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionExpiredMsg('Sua sessão expirou. Faça login novamente.');
    }
  }, [searchParams]);

  const validateEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email || !validateEmail(email)) {
      setValidationError('Por favor, informe um e-mail válido.');
      return;
    }

    if (!password || password.length < 6) {
      setValidationError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    try {
      await login({ email, password });
    } catch {
      // Ignore error
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    fontSize: 14,
    color: 'var(--color-ink-primary)',
    background: 'var(--color-surface)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 150ms ease-out',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        padding: '40px 36px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 20, height: 20, background: 'var(--color-primary)', borderRadius: 5 }} />
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-ink-primary)', margin: 0 }}>
            NutriSmart
          </h1>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--color-ink-secondary)', fontSize: 13, marginBottom: 28, marginTop: 8 }}>
          Acesse sua conta
        </p>

        {(validationError || error || sessionExpiredMsg) && (
          <div style={{
            padding: '10px 14px',
            marginBottom: 20,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            fontSize: 12,
          }}>
            {sessionExpiredMsg || validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--color-ink-secondary)',
              marginBottom: 6,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; }}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--color-ink-secondary)',
              marginBottom: 6,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 24px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: loading ? 'var(--color-ink-tertiary)' : 'var(--color-primary)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'background 150ms ease-out',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--color-primary)'; }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
