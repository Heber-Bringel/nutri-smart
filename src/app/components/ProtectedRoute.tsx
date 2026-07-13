import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../viewmodel/auth/AuthViewModel';
import { UserRole } from '../../model/entities/User';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: UserRole;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'var(--color-bg)',
          color: 'var(--color-ink-tertiary)',
          fontSize: 13,
        }}
      >
        <p>Carregando sessão...</p>
      </motion.div>
    );
  }

  if (!user) {
    const isVoluntario = sessionStorage.getItem('logout_voluntario') === 'true';
    if (isVoluntario) {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to="/login?sessionExpired=true" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'nutricionista') {
      return <Navigate to="/dashboard/pacientes" replace />;
    }
    return <Navigate to="/paciente/meu-plano" replace />;
  }

  return <>{children}</>;
}
