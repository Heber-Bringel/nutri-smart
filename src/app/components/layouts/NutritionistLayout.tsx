import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';

export function NutritionistLayout() {
  const location = useLocation();
  const auth = useAuth();
  
  // Extrai iniciais do usuário para o avatar
  const userName = auth.user?.email?.split('@')[0] || 'User';
  const initials = userName.substring(0, 2).toUpperCase();
  
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header minimalista */}
      <header style={{
        padding: '0 40px', height: 48, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #E5E5E5', background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 18, height: 18, background: '#10B981', borderRadius: 4 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>NutriSmart</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <nav style={{ display: 'flex', gap: 16 }}>
            <Link 
              to="/dashboard/pacientes" 
              style={{ 
                textDecoration: 'none', 
                fontSize: 13, 
                color: location.pathname.includes('/pacientes') ? '#111827' : '#9CA3AF', 
                fontWeight: location.pathname.includes('/pacientes') ? 500 : 400 
              }}
            >
              Pacientes
            </Link>
            <Link 
              to="/dashboard/agenda" 
              style={{ 
                textDecoration: 'none', 
                fontSize: 13, 
                color: location.pathname.includes('/agenda') ? '#111827' : '#9CA3AF', 
                fontWeight: location.pathname.includes('/agenda') ? 500 : 400 
              }}
            >
              Agenda
            </Link>
          </nav>
          <div 
            title="Sair"
            onClick={() => auth.logout()}
            style={{ 
              width: 26, height: 26, borderRadius: '50%', background: '#F5F5F5', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: 10, color: '#6B7280', cursor: 'pointer', fontWeight: 600
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
