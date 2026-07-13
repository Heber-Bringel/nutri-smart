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
        color: active ? 'var(--color-ink-primary)' : 'var(--color-ink-secondary)',
        padding: '8px 12px',
        borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
        transition: 'color 150ms ease-out, border-color 150ms ease-out',
        whiteSpace: 'nowrap',
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    return <div style={{ padding: '48px 40px', color: 'var(--color-ink-tertiary)', fontSize: 13 }}>Carregando dados do paciente...</div>;
  }

  if (error || !paciente) {
    return (
      <div style={{ padding: '48px 40px' }}>
        <div style={{
          padding: '10px 14px',
          background: 'var(--color-danger-subtle)',
          border: '1px solid var(--color-danger-border)',
          color: 'var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          fontSize: 13,
        }}>
          {error || 'Paciente não encontrado.'}
        </div>
        <button
          onClick={() => navigate('/dashboard/pacientes')}
          style={{
            marginTop: 16, padding: '8px 14px', cursor: 'pointer', background: 'var(--color-surface)',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--color-ink-primary)',
            fontWeight: 500,
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/dashboard/pacientes" style={{
            textDecoration: 'none', color: 'var(--color-ink-tertiary)', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 12 }}>←</span> Pacientes
          </Link>
          <span style={{ color: 'var(--color-border)' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-ink-primary)' }}>{paciente.nomeCompleto}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 500,
            background: paciente.planoAtivo ? 'var(--color-primary-subtle)' : 'var(--color-subtle)',
            color: paciente.planoAtivo ? 'var(--color-primary-text)' : 'var(--color-ink-tertiary)',
          }}>
            {paciente.planoAtivo ? 'Plano ativo' : 'Sem plano'}
          </span>
          <button
            onClick={() => navigate(`/dashboard/pacientes/${id}/editar`)}
            style={{
              background: 'var(--color-surface)', color: 'var(--color-ink-primary)', border: '1px solid var(--color-border)',
              padding: '5px 12px', borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}
          >
            Editar perfil
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: 32, gap: 8,
        overflowX: 'auto',
      }}>
        <TabItem label="Visão Geral" to={`/dashboard/pacientes/${id}`} active={isExactProfile} />
        <TabItem label="Plano Alimentar" to={`/dashboard/pacientes/${id}/plano-alimentar`} active={location.pathname.includes('/plano-alimentar')} />
        <TabItem label="Evolução" to={`/dashboard/pacientes/${id}/evolucao`} active={location.pathname.includes('/evolucao')} />
        <TabItem label="Medidas" to={`/dashboard/pacientes/${id}/medidas`} active={location.pathname.includes('/medidas')} />
        <TabItem label="Anotações" to={`/dashboard/pacientes/${id}/anotacoes`} active={location.pathname.includes('/anotacoes')} />
      </div>

      <Outlet context={{ paciente }} />
    </div>
  );
}
