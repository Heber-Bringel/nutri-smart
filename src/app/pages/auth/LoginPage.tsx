import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import { loginSchema, LoginFormData } from '../../../viewmodel/auth/AuthSchema';
import { PageTransition } from '../../components/shared/PageTransition';

export function LoginPage() {
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  // Estado local de submissão — independente do loading global do AuthViewModel,
  // garante que o botão fique travado desde o clique até a navegação completar.
  const [submitting, setSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Ref para evitar setState após desmontagem durante a navegação
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (searchParams.get('sessionExpired') === 'true') {
      setSessionExpiredMsg('Sua sessão expirou. Faça login novamente.');
    }
    if (searchParams.get('resetSuccess') === 'true') {
      setResetSuccessMsg('Senha redefinida com sucesso! Faça login com sua nova senha.');
    }
  }, [searchParams]);

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

  const onSubmit = async (data: LoginFormData) => {
    if (submitting) return; // Proteção extra contra duplo clique
    clearError();
    setSessionExpiredMsg('');
    setResetSuccessMsg('');
    setSubmitting(true);
    try {
      const user = await login(data);
      // Navega imediatamente — o botão permanece desabilitado pois o componente
      // será desmontado pela navegação. Não há setSubmitting(false) aqui para
      // evitar o flash de estado antes do unmount.
      if (user.role === 'nutricionista') {
        navigate('/dashboard/pacientes');
      } else {
        navigate('/paciente/meu-plano');
      }
    } catch {
      // O erro é tratado no AuthViewModel e exibido na UI via variável `error`.
      // Só restaura o botão em caso de erro, pois em caso de sucesso o componente
      // será desmontado pela navegação.
      if (mountedRef.current) {
        setSubmitting(false);
      }
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
    <PageTransition>
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
        {/* Logo NutriSmart */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <img
            src="/nutrismart-logo.png"
            alt="NutriSmart"
            style={{ height: 80, width: 'auto', objectFit: 'contain' }}
          />
        </div>
        <h1 style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--color-ink-primary)',
          margin: '0 0 4px',
          letterSpacing: '-0.02em',
        }}>
          NutriSmart
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-ink-secondary)', fontSize: 13, marginBottom: 28, marginTop: 0 }}>
          Acesse sua conta
        </p>

        {resetSuccessMsg && (
          <div style={{
            padding: '10px 14px',
            marginBottom: 20,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-success-subtle, #ecfdf5)',
            border: '1px solid var(--color-success-border, #a7f3d0)',
            color: 'var(--color-success, #047857)',
            fontSize: 12,
          }}>
            {resetSuccessMsg}
          </div>
        )}

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
              disabled={submitting}
              style={{ ...inputStyle, borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)', opacity: submitting ? 0.6 : 1 }}
              onFocus={(e) => { if (!submitting) e.target.style.borderColor = 'var(--color-primary)'; }}
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
              disabled={submitting}
              style={{ ...inputStyle, borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)', opacity: submitting ? 0.6 : 1 }}
              onFocus={(e) => { if (!submitting) e.target.style.borderColor = 'var(--color-primary)'; }}
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
            disabled={submitting}
            style={{
              width: '100%',
              padding: '10px 24px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: submitting ? 'var(--color-ink-tertiary)' : 'var(--color-primary)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'background 150ms ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
            onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = submitting ? 'var(--color-ink-tertiary)' : 'var(--color-primary)'; }}
          >
            {submitting && (
              // Spinner SVG inline — sem dependência extra
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                style={{ animation: 'spin 0.7s linear infinite' }}
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <Link
          to="/esqueci-senha"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 20,
            fontSize: 12,
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Esqueci minha senha
        </Link>
      </div>

      {/* Keyframe do spinner via style tag inline */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </PageTransition>
  );
}
