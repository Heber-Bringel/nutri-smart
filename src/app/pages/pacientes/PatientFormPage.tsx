import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PatientForm } from '../../components/pacientes/PatientForm';
import { Container } from '../../../di/container';
import type { NivelAtividadeFisica } from '../../../model/entities/Paciente';

type PatientFormData = {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  sexoBiologico: 'masculino' | 'feminino';
  pesoInicial: string;
  altura: string;
  nivelAtividadeFisica: NivelAtividadeFisica;
};

export function PatientFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editMode = !!id;
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(editMode);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<PatientFormData | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    Container.getPacienteUseCase.execute(id)
      .then(p => {
        if (!cancelled) {
          setInitialData({
            nomeCompleto: p.nomeCompleto,
            email: p.email,
            dataNascimento: p.dataNascimento,
            sexoBiologico: p.sexoBiologico,
            pesoInicial: String(p.pesoInicial),
            altura: String(p.altura),
            nivelAtividadeFisica: p.nivelAtividadeFisica,
          });
          setPageLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar paciente.');
          setPageLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [id]);

  async function handleSubmit(formData: PatientFormData) {
    setLoading(true);
    setError(null);
    try {
      const data = {
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        dataNascimento: formData.dataNascimento,
        sexoBiologico: formData.sexoBiologico,
        pesoInicial: Number(formData.pesoInicial),
        altura: Number(formData.altura),
        nivelAtividadeFisica: formData.nivelAtividadeFisica,
      };

      if (editMode && id) {
        await Container.updatePacienteUseCase.execute(id, data);
      } else {
        await Container.createPacienteUseCase.execute(data);
      }
      navigate('/dashboard/pacientes');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar paciente.');
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ color: '#9CA3AF', fontSize: 13 }}>Carregando dados do paciente...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Link to="/dashboard/pacientes" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>←</span> Pacientes
          </Link>
          <span style={{ color: '#E5E5E5' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{editMode ? 'Editar Paciente' : 'Novo Paciente'}</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>
          {editMode ? 'Editar Paciente' : 'Cadastrar Paciente'}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
          {editMode
            ? 'Altere os dados do paciente.'
            : 'Preencha os dados iniciais. O paciente receberá um convite por e-mail para acessar o plano.'}
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5',
          color: '#DC2626', borderRadius: 6, fontSize: 13, marginBottom: 24
        }}>
          {error}
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: 32 }}>
        <PatientForm onSubmit={handleSubmit} loading={loading} initialData={initialData} editMode={editMode} />
      </div>
    </div>
  );
}
