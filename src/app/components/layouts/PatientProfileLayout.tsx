import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { Paciente } from '../../../model/entities/Paciente';
import { Container } from '../../../di/container';

function TabItem({ label, to, active }: { label: string; to: string; active: boolean }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        color: active ? '#111827' : '#6B7280',
        padding: '8px 12px',
        borderBottom: active ? '2px solid #10B981' : '2px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </Link>
  );
}

export function PatientProfileLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    Container.getPacienteUseCase.execute(id)
      .then(p => { if (!cancelled) { setPaciente(p); setLoading(false); } })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar paciente.');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <div style={{ padding: '48px 40px', color: '#9CA3AF', fontSize: 13 }}>Carregando dados do paciente...</div>;
  }

  if (error || !paciente) {
    return (
      <div style={{ padding: '48px 40px' }}>
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 6, fontSize: 13 }}>
          {error || 'Paciente não encontrado.'}
        </div>
        <button 
          onClick={() => navigate('/dashboard/pacientes')} 
          style={{ 
            marginTop: 16, padding: '6px 12px', cursor: 'pointer', background: '#fff', 
            border: '1px solid #E5E5E5', borderRadius: 4, fontSize: 13, color: '#111827'
          }}
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  const isExactProfile = location.pathname === `/dashboard/pacientes/${id}` || location.pathname === `/dashboard/pacientes/${id}/`;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>
      {/* Breadcrumb / Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/dashboard/pacientes" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>←</span> Pacientes
          </Link>
          <span style={{ color: '#E5E5E5' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{paciente.nomeCompleto}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 500,
            background: paciente.planoAtivo ? '#ECFDF5' : '#F5F5F5',
            color: paciente.planoAtivo ? '#065F46' : '#9CA3AF',
          }}>
            {paciente.planoAtivo ? 'Plano ativo' : 'Sem plano'}
          </span>
          <button 
            onClick={() => navigate(`/dashboard/pacientes/${id}/editar`)}
            style={{
              background: '#fff', color: '#111827', border: '1px solid #E5E5E5',
              padding: '5px 12px', borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}
          >
            Editar perfil
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E5E5E5', marginBottom: 32, gap: 8 }}>
        <TabItem label="Visão Geral" to={`/dashboard/pacientes/${id}`} active={isExactProfile} />
        <TabItem label="Plano Alimentar" to={`/dashboard/pacientes/${id}/plano-alimentar`} active={location.pathname.includes('/plano-alimentar')} />
        <TabItem label="Evolução" to={`/dashboard/pacientes/${id}/evolucao`} active={location.pathname.includes('/evolucao')} />
        <TabItem label="Medidas" to={`/dashboard/pacientes/${id}/medidas`} active={location.pathname.includes('/medidas')} />
        <TabItem label="Anotações" to={`/dashboard/pacientes/${id}/anotacoes`} active={location.pathname.includes('/anotacoes')} />
      </div>

      {/* Main Content of the Tab */}
      <Outlet context={{ paciente }} />
    </div>
  );
}
