import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paciente } from '../../../model/entities/Paciente';
import { Container } from '../../../di/container';
import { PatientInfoCard } from '../../components/pacientes/PatientInfoCard';
import { DeletePatientDialog } from '../../components/pacientes/DeletePatientDialog';

export function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestedId, setRequestedId] = useState<string | undefined>(undefined);

  if (id && id !== requestedId) {
    setRequestedId(id);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    if (!requestedId) return;
    let cancelled = false;

    Container.getPacienteUseCase.execute(requestedId)
      .then(p => { if (!cancelled) { setPaciente(p); setLoading(false); } })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar paciente.');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [requestedId]);

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await Container.deletePacienteUseCase.execute(id);
      navigate('/dashboard/pacientes');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir paciente.');
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  async function handleResendInvite() {
    if (!paciente) return;
    setInviteMessage(null);
    try {
      await Container.inviteService.resendInvite(paciente.email);
      setInviteMessage('Link de convite reenviado com sucesso!');
    } catch (err: unknown) {
      setInviteMessage(err instanceof Error ? err.message : 'Erro ao reenviar convite.');
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>Carregando paciente...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>{error}</div>
        <button onClick={() => navigate('/dashboard/pacientes')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Voltar
        </button>
      </div>
    );
  }

  if (!paciente) return null;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate('/dashboard/pacientes')} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
          ← Voltar
        </button>
      </div>

      <PatientInfoCard paciente={paciente} />

      {!paciente.usuarioId && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 0.5rem' }}><strong>Convite pendente</strong></p>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
            O paciente ainda não confirmou o convite. O acesso será vinculado automaticamente quando ele criar a conta com o e-mail {paciente.email}.
          </p>
          <button
            onClick={handleResendInvite}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: '#f59e0b',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Reenviar Convite
          </button>
          {inviteMessage && (
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>{inviteMessage}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={() => setShowDeleteDialog(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Excluir Paciente
        </button>
      </div>

      {showDeleteDialog && (
        <DeletePatientDialog
          pacienteNome={paciente.nomeCompleto}
          onConfirm={handleDelete}
          onCancel={() => { setShowDeleteDialog(false); setError(null); }}
          loading={deleting}
        />
      )}
    </div>
  );
}
