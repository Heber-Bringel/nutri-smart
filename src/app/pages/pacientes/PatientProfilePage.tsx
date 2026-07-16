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

  // Estado do modal de nova senha temporária
  const [senhaModal, setSenhaModal] = useState<{ senha: string } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [gerando, setGerando] = useState(false);

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

  async function handleGerarNovaSenha() {
    setGerando(true);
    try {
      const senha = await Container.inviteService.resendInvite(paciente.email, paciente.nomeCompleto);
      setSenhaModal({ senha });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar nova senha.');
    } finally {
      setGerando(false);
    }
  }

  function handleCopiar() {
    if (!senhaModal?.senha) return;
    navigator.clipboard.writeText(senhaModal.senha).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
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

      {/* Banner de convite pendente — só exibido quando o paciente ainda não tem conta */}
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
                Acesso pendente
              </p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-ink-secondary)' }}>
                O paciente ainda não realizou o primeiro login.{' '}
                <span style={{ fontFamily: 'var(--font-mono)' }}>{paciente.email}</span>
              </p>
            </div>
            <button
              onClick={handleGerarNovaSenha}
              disabled={gerando}
              style={{
                padding: '6px 12px', background: 'var(--color-surface)',
                color: gerando ? 'var(--color-ink-tertiary)' : 'var(--color-primary)',
                border: `1px solid ${gerando ? 'var(--color-border)' : 'var(--color-primary)'}`,
                borderRadius: 'var(--radius-sm)', cursor: gerando ? 'not-allowed' : 'pointer',
                fontSize: 12, fontWeight: 500,
                transition: 'all 150ms ease-out',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!gerando) {
                  e.currentTarget.style.background = 'var(--color-primary)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                if (!gerando) {
                  e.currentTarget.style.background = 'var(--color-surface)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }
              }}
            >
              {gerando ? 'Gerando...' : 'Gerar nova senha'}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 600, color: 'var(--color-danger)' }}>
          Zona de Perigo
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-ink-secondary)' }}>
          A exclusão de um paciente é irreversível e removerá permanentemente o histórico clínico, a conta de acesso e o perfil.
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

      {/* Modal de nova senha temporária */}
      {senhaModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)', padding: 16,
        }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 36px',
            maxWidth: 400, width: '100%',
            boxShadow: 'var(--shadow-card)',
          }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--color-ink-primary)', letterSpacing: '-0.02em' }}>
              Nova senha gerada
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}>
              Repasse a senha abaixo para <strong>{paciente.nomeCompleto}</strong> acessar o sistema.
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: 'var(--color-ink-tertiary)', letterSpacing: '0.05em',
                textTransform: 'uppercase', marginBottom: 4,
              }}>
                Senha temporária
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  flex: 1, padding: '9px 12px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 15, fontWeight: 600,
                  color: 'var(--color-ink-primary)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                }}>
                  {senhaModal.senha}
                </div>
                <button
                  onClick={handleCopiar}
                  style={{
                    padding: '9px 14px',
                    background: copiado ? 'var(--color-success, #059669)' : 'var(--color-primary)',
                    color: '#fff', border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    transition: 'background 150ms ease-out',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copiado ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setSenhaModal(null)}
              style={{
                width: '100%', padding: '10px 24px',
                background: 'var(--color-primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
