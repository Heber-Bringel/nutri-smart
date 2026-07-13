import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PatientForm } from '../../components/pacientes/PatientForm';
import { usePacientesViewModel } from '../../../viewmodel/pacientes/usePacientesViewModel';
import { PatientFormData } from '../../../viewmodel/pacientes/PatientSchema';

import { PageTransition } from '../../components/shared/PageTransition';

export function PatientFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editMode = !!id;
  
  const { getPaciente, createPaciente, updatePaciente, loading, error } = usePacientesViewModel();
  const [pageLoading, setPageLoading] = useState(editMode);
  const [initialData, setInitialData] = useState<PatientFormData | undefined>(undefined);

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
    try {
      if (editMode && id) {
        await updatePaciente(id, formData);
      } else {
        await createPaciente(formData);
      }
      navigate('/dashboard/pacientes');
    } catch {
      // erro é gerenciado no viewmodel e exibido via 'error'
    }
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
              : 'Preencha os dados iniciais. O paciente receberá um convite por e-mail para acessar o plano.'}
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

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
          <PatientForm onSubmit={handleSubmit} loading={loading} initialData={initialData} editMode={editMode} />
        </div>
      </div>
    </PageTransition>
  );
}
