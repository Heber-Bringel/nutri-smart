import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import { loginSchema, LoginFormData } from '../../../viewmodel/auth/AuthSchema';

export function LoginPage() {
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (searchParams.get('sessionExpired') === 'true') {
      setSessionExpiredMsg('Sua sessão expirou. Faça login novamente.');
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      const user = await login(data);
      if (user.role === 'nutricionista') {
        navigate('/dashboard/pacientes');
      } else {
        navigate('/paciente/meu-plano');
      }
    } catch {
      // O erro é tratado no AuthViewModel e exibido na UI via variável `error`
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

        {(error || sessionExpiredMsg) && (
          <div style={{
            padding: '10px 14px',
            marginBottom: 20,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            fontSize: 12,
          }}>
            {sessionExpiredMsg || error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="seuemail@exemplo.com"
              style={{ ...inputStyle, borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
              {...register('email')}
            />
            {errors.email && (
              <span style={{ color: 'var(--color-danger)', fontSize: 11, marginTop: 4, display: 'block' }}>
                {errors.email.message}
              </span>
            )}
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
              placeholder="••••••••"
              style={{ ...inputStyle, borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
              {...register('password')}
            />
            {errors.password && (
              <span style={{ color: 'var(--color-danger)', fontSize: 11, marginTop: 4, display: 'block' }}>
                {errors.password.message}
              </span>
            )}
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
