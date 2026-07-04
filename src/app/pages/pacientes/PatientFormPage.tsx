import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientForm } from '../../components/pacientes/PatientForm';
import { Container } from '../../../di/container';

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
    nivelAtividadeFisica: any;
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
    } catch (err: any) {
      setError(err?.message || 'Erro ao cadastrar paciente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Cadastrar Paciente</h1>
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <PatientForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
