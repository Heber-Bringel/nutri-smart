import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PatientForm } from '../../components/pacientes/PatientForm';
import { Container } from '../../../di/container';
import type { NivelAtividadeFisica } from '../../../model/entities/Paciente';

export function PatientFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: {
    nomeCompleto: string;
    email: string;
    dataNascimento: string;
    sexoBiologico: 'masculino' | 'feminino';
    pesoInicial: string;
    altura: string;
    nivelAtividadeFisica: NivelAtividadeFisica;
  }) {
    setLoading(true);
    setError(null);
    try {
      await Container.createPacienteUseCase.execute({
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        dataNascimento: formData.dataNascimento,
        sexoBiologico: formData.sexoBiologico,
        pesoInicial: Number(formData.pesoInicial),
        altura: Number(formData.altura),
        nivelAtividadeFisica: formData.nivelAtividadeFisica,
      });
      navigate('/dashboard/pacientes');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar paciente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Breadcrumb */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Link to="/dashboard/pacientes" style={{ textDecoration: 'none', color: '#9CA3AF', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>←</span> Pacientes
          </Link>
          <span style={{ color: '#E5E5E5' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Novo Paciente</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>Cadastrar Paciente</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
          Preencha os dados iniciais. O paciente receberá um convite por e-mail para acessar o plano.
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
        <PatientForm onSubmit={handleSubmit} loading={loading} />
      </div>

    </div>
  );
}
