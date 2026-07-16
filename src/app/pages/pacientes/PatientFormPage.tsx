import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PatientForm } from '../../components/pacientes/PatientForm';
import { usePacientesViewModel } from '../../../viewmodel/pacientes/usePacientesViewModel';
import { PatientFormData } from '../../../viewmodel/pacientes/PatientSchema';
import { PageTransition } from '../../components/shared/PageTransition';

export function PatientFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editMode = !!id;

  const { getPaciente, createPaciente, updatePaciente, error } = usePacientesViewModel();
  const [pageLoading, setPageLoading] = useState(editMode);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<PatientFormData | undefined>(undefined);

  // Modal de senha temporária — renderizado via portal fora do PageTransition
  // para não ser afetado pela animação de saída de rota do AnimatePresence.
  const [senhaModal, setSenhaModal] = useState<{
    senha: string;
    email: string;
    aviso: string | null;
    pacienteId: string;
  } | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    getPaciente(id).then(p => {
      if (!cancelled) {
        if (p) {
          setInitialData({
            nomeCompleto: p.nomeCompleto,
            email: p.email,
            dataNascimento: p.dataNascimento,
            sexoBiologico: p.sexoBiologico,
            pesoInicial: p.pesoInicial,
            altura: p.altura,
            nivelAtividadeFisica: p.nivelAtividadeFisica,
          });
        }
        setPageLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [id, getPaciente]);

  async function handleSubmit(formData: PatientFormData) {
    setSubmitting(true);
    try {
      if (editMode && id) {
        await updatePaciente(id, formData);
        navigate('/dashboard/pacientes');
      } else {
        const { paciente, senhaTemporaria, erroConvite } = await createPaciente(formData);
        // Exibe modal via portal — independente do ciclo de animação de rota
        setSenhaModal({
          senha: senhaTemporaria ?? '',
          email: formData.email,
          aviso: erroConvite,
          pacienteId: paciente.id,
        });
      }
    } catch {
      // erro clínico — gerenciado pelo viewmodel e exibido via `error`
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopiar() {
    if (!senhaModal?.senha) return;
    navigator.clipboard.writeText(senhaModal.senha).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  function handleFecharModal() {
    if (!senhaModal) return;
    const pid = senhaModal.pacienteId;
    setSenhaModal(null);
    navigate(`/dashboard/pacientes/${pid}`);
  }

  if (pageLoading) {
    return (
      <PageTransition>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>
          <div style={{ color: 'var(--color-ink-tertiary)', fontSize: 13 }}>Carregando dados do paciente...</div>
        </div>
      </PageTransition>
    );
  }

  return (
    <>
      <PageTransition>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Link to="/dashboard/pacientes" style={{
                textDecoration: 'none', color: 'var(--color-ink-tertiary)', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 12 }}>←</span> Pacientes
              </Link>
              <span style={{ color: 'var(--color-border)' }}>/</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-ink-primary)' }}>
                {editMode ? 'Editar Paciente' : 'Novo Paciente'}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: 'var(--color-ink-primary)', letterSpacing: '-0.02em' }}>
              {editMode ? 'Editar Paciente' : 'Cadastrar Paciente'}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--color-ink-secondary)' }}>
              {editMode
                ? 'Altere os dados do paciente.'
                : 'Preencha os dados iniciais. Uma senha temporária será gerada para o paciente acessar o sistema.'}
            </p>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', background: 'var(--color-danger-subtle)',
              border: '1px solid var(--color-danger-border)',
              color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 24,
            }}>
              {error}
            </div>
          )}

          <div style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', padding: 32,
          }}>
            <PatientForm onSubmit={handleSubmit} loading={submitting} initialData={initialData} editMode={editMode} />
          </div>
        </div>
      </PageTransition>

      {/* Modal renderizado no body via portal — imune à animação de saída de rota */}
      {createPortal(
        <AnimatePresence>
          {senhaModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 400,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)', padding: 16,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 36px',
                  maxWidth: 440, width: '100%',
                  boxShadow: 'var(--shadow-modal)',
                }}
              >
                {/* Ícone de sucesso */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 380, damping: 18 }}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'var(--color-success-subtle)',
                    border: '1px solid var(--color-success-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--color-primary-hover)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <motion.polyline
                      points="20 6 9 17 4 12"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.25, duration: 0.3, ease: 'easeOut' }}
                    />
                  </motion.svg>
                </motion.div>

                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--color-ink-primary)', letterSpacing: '-0.02em' }}>
                  Paciente cadastrado
                </h2>
                <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}>
                  Repasse as credenciais abaixo ao paciente para que ele acesse o sistema.
                </p>

                {senhaModal.aviso && (
                  <div style={{
                    padding: '10px 12px', marginBottom: 20,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-danger-subtle)',
                    border: '1px solid var(--color-danger-border)',
                    color: 'var(--color-danger)',
                    fontSize: 12, lineHeight: 1.5,
                  }}>
                    {senhaModal.aviso}
                  </div>
                )}

                {senhaModal.senha && (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{
                        display: 'block', fontSize: 11, fontWeight: 600,
                        color: 'var(--color-ink-tertiary)', letterSpacing: '0.05em',
                        textTransform: 'uppercase', marginBottom: 4,
                      }}>
                        E-mail
                      </label>
                      <div style={{
                        padding: '9px 12px',
                        background: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 13, color: 'var(--color-ink-primary)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {senhaModal.email}
                      </div>
                    </div>

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
                          fontSize: 16, fontWeight: 600,
                          color: 'var(--color-ink-primary)',
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.06em',
                        }}>
                          {senhaModal.senha}
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopiar}
                          animate={{
                            background: copiado ? 'var(--color-primary-hover)' : 'var(--color-primary)',
                          }}
                          transition={{ duration: 0.15 }}
                          style={{
                            padding: '9px 14px',
                            color: '#fff', border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {copiado ? '✓ Copiado' : 'Copiar'}
                        </motion.button>
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--color-ink-tertiary)' }}>
                        O paciente pode alterar a senha após o primeiro acesso.
                      </p>
                    </div>
                  </>
                )}

                <motion.button
                  whileHover={{ background: 'var(--color-primary-hover)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFecharModal}
                  transition={{ duration: 0.15 }}
                  style={{
                    width: '100%', padding: '10px 24px',
                    background: 'var(--color-primary)', color: '#fff',
                    border: 'none', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  }}
                >
                  Concluir
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
