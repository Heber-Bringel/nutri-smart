import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import type { Paciente } from '../../../model/entities/Paciente';
import { Container } from '../../../di/container';
import { PatientInfoCard } from '../../components/pacientes/PatientInfoCard';
import { DeletePatientDialog } from '../../components/pacientes/DeletePatientDialog';

export function PatientProfilePage() {
  const navigate = useNavigate();
  const { paciente } = useOutletContext<{ paciente: Paciente }>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    try {
      await Container.deletePacienteUseCase.execute(paciente.id);
      navigate('/dashboard/pacientes');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir paciente.');
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  async function handleResendInvite() {
    setInviteMessage(null);
    try {
      await Container.inviteService.resendInvite(paciente.email);
      setInviteMessage('Convite reenviado com sucesso.');
    } catch (err: unknown) {
      setInviteMessage(err instanceof Error ? err.message : 'Erro ao reenviar convite.');
    }
  }

  return (
    <div style={{ paddingBottom: 64 }}>
      {error && (
          <div style={{
            padding: '10px 14px', background: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        <PatientInfoCard paciente={paciente} />

        {!paciente.usuarioId && (
          <div style={{
            marginTop: 24, padding: 24,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: 'var(--color-ink-primary)' }}>
                  Convite pendente
                </p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-ink-secondary)' }}>
                  O paciente ainda não criou a conta. O acesso será vinculado ao e-mail{' '}
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{paciente.email}</span>.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <button
                  onClick={handleResendInvite}
                  style={{
                    padding: '6px 12px', background: 'var(--color-surface)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    fontSize: 12, fontWeight: 500,
                    transition: 'all 150ms ease-out',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--color-primary)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--color-surface)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                >
                  Reenviar convite
                </button>
                {inviteMessage && (
                  <span style={{ fontSize: 11, color: 'var(--color-primary-text)' }}>{inviteMessage}</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 600, color: 'var(--color-danger)' }}>
            Zona de Perigo
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-ink-secondary)' }}>
            A exclusão de um paciente é irreversível e removerá permanentemente o histórico clínico.
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            style={{
              padding: '6px 16px', background: 'var(--color-surface)', color: 'var(--color-danger)',
              border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            Excluir Paciente
          </button>
        </div>

        <AnimatePresence>
          {showDeleteDialog && (
            <DeletePatientDialog
              pacienteNome={paciente.nomeCompleto}
              onConfirm={handleDelete}
              onCancel={() => { setShowDeleteDialog(false); setError(null); }}
              loading={deleting}
            />
          )}
        </AnimatePresence>
    </div>
  );
}
