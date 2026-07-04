import { useAuth } from '../../../viewmodel/auth/AuthViewModel';

export function PatientDietPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Área do Paciente — Plano Alimentar</h1>
      <p>Bem-vindo(a), {user?.nomeCompleto} ({user?.email})</p>
      <button onClick={logout} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
        Sair
      </button>
    </div>
  );
}
