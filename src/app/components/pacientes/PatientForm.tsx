import { useState } from 'react';
import { SexoBiologico, NivelAtividadeFisica } from '../../../model/entities/Paciente';

interface PatientFormData {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  sexoBiologico: SexoBiologico;
  pesoInicial: string;
  altura: string;
  nivelAtividadeFisica: NivelAtividadeFisica;
}

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => Promise<void>;
  loading: boolean;
}

export function PatientForm({ onSubmit, loading }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    nomeCompleto: '',
    email: '',
    dataNascimento: '',
    sexoBiologico: 'masculino',
    pesoInicial: '',
    altura: '',
    nivelAtividadeFisica: 'sedentario',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof PatientFormData, string>> = {};

    if (!formData.nomeCompleto.trim()) newErrors.nomeCompleto = 'Nome é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório.';
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
    if (!formData.pesoInicial || Number(formData.pesoInicial) <= 0) newErrors.pesoInicial = 'Peso deve ser maior que zero.';
    if (!formData.altura || Number(formData.altura) <= 0) newErrors.altura = 'Altura deve ser maior que zero.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  }

  function updateField<K extends keyof PatientFormData>(key: K, value: PatientFormData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <div>
        <label><strong>Nome completo *</strong></label>
        <input
          type="text"
          value={formData.nomeCompleto}
          onChange={e => updateField('nomeCompleto', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {errors.nomeCompleto && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.nomeCompleto}</span>}
      </div>

      <div>
        <label><strong>E-mail *</strong></label>
        <input
          type="email"
          value={formData.email}
          onChange={e => updateField('email', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {errors.email && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.email}</span>}
      </div>

      <div>
        <label><strong>Data de nascimento *</strong></label>
        <input
          type="date"
          value={formData.dataNascimento}
          onChange={e => updateField('dataNascimento', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {errors.dataNascimento && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.dataNascimento}</span>}
      </div>

      <div>
        <label><strong>Sexo biológico *</strong></label>
        <select
          value={formData.sexoBiologico}
          onChange={e => updateField('sexoBiologico', e.target.value as SexoBiologico)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
        </select>
      </div>

      <div>
        <label><strong>Peso (kg) *</strong></label>
        <input
          type="number"
          step="0.01"
          value={formData.pesoInicial}
          onChange={e => updateField('pesoInicial', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {errors.pesoInicial && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.pesoInicial}</span>}
      </div>

      <div>
        <label><strong>Altura (cm) *</strong></label>
        <input
          type="number"
          step="0.01"
          value={formData.altura}
          onChange={e => updateField('altura', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {errors.altura && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.altura}</span>}
      </div>

      <div>
        <label><strong>Nível de atividade física *</strong></label>
        <select
          value={formData.nivelAtividadeFisica}
          onChange={e => updateField('nivelAtividadeFisica', e.target.value as NivelAtividadeFisica)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="sedentario">Sedentário</option>
          <option value="levemente_ativo">Levemente ativo</option>
          <option value="moderadamente_ativo">Moderadamente ativo</option>
          <option value="muito_ativo">Muito ativo</option>
          <option value="extremamente_ativo">Extremamente ativo</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.75rem',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Salvando...' : 'Cadastrar Paciente'}
      </button>
    </form>
  );
}
