import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <p>Carregando sessão...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?sessionExpired=true" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'nutricionista') {
      return <Navigate to="/dashboard/pacientes" replace />;
    }
    return <Navigate to="/dieta" replace />;
  }

  return <>{children}</>;
}
