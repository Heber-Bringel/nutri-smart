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

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E5E5E5',
    fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s',
    boxSizing: 'border-box' as const, background: '#fff'
  };

  const labelStyle = { display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em' };
  const errorStyle = { color: '#DC2626', fontSize: 12, marginTop: 4, display: 'block' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <div>
          <label style={labelStyle}>Nome completo</label>
          <input
            type="text"
            value={formData.nomeCompleto}
            onChange={e => updateField('nomeCompleto', e.target.value)}
            style={{ ...inputStyle, borderColor: errors.nomeCompleto ? '#FCA5A5' : '#E5E5E5' }}
            onFocus={e => e.target.style.borderColor = '#10B981'}
            onBlur={e => e.target.style.borderColor = errors.nomeCompleto ? '#FCA5A5' : '#E5E5E5'}
          />
          {errors.nomeCompleto && <span style={errorStyle}>{errors.nomeCompleto}</span>}
        </div>

        <div>
          <label style={labelStyle}>E-mail</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => updateField('email', e.target.value)}
            style={{ ...inputStyle, borderColor: errors.email ? '#FCA5A5' : '#E5E5E5' }}
            onFocus={e => e.target.style.borderColor = '#10B981'}
            onBlur={e => e.target.style.borderColor = errors.email ? '#FCA5A5' : '#E5E5E5'}
          />
          {errors.email && <span style={errorStyle}>{errors.email}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <div>
          <label style={labelStyle}>Data de nascimento</label>
          <input
            type="date"
            value={formData.dataNascimento}
            onChange={e => updateField('dataNascimento', e.target.value)}
            style={{ ...inputStyle, borderColor: errors.dataNascimento ? '#FCA5A5' : '#E5E5E5', fontFamily: 'JetBrains Mono, monospace' }}
            onFocus={e => e.target.style.borderColor = '#10B981'}
            onBlur={e => e.target.style.borderColor = errors.dataNascimento ? '#FCA5A5' : '#E5E5E5'}
          />
          {errors.dataNascimento && <span style={errorStyle}>{errors.dataNascimento}</span>}
        </div>

        <div>
          <label style={labelStyle}>Sexo biológico</label>
          <select
            value={formData.sexoBiologico}
            onChange={e => updateField('sexoBiologico', e.target.value as SexoBiologico)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#10B981'}
            onBlur={e => e.target.style.borderColor = '#E5E5E5'}
          >
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
      </div>

      <div style={{ height: 1, background: '#F5F5F5', margin: '8px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <div>
          <label style={labelStyle}>Peso inicial (kg)</label>
          <input
            type="number"
            step="0.01"
            value={formData.pesoInicial}
            onChange={e => updateField('pesoInicial', e.target.value)}
            style={{ ...inputStyle, borderColor: errors.pesoInicial ? '#FCA5A5' : '#E5E5E5', fontFamily: 'JetBrains Mono, monospace' }}
            onFocus={e => e.target.style.borderColor = '#10B981'}
            onBlur={e => e.target.style.borderColor = errors.pesoInicial ? '#FCA5A5' : '#E5E5E5'}
          />
          {errors.pesoInicial && <span style={errorStyle}>{errors.pesoInicial}</span>}
        </div>

        <div>
          <label style={labelStyle}>Altura (cm)</label>
          <input
            type="number"
            step="0.01"
            value={formData.altura}
            onChange={e => updateField('altura', e.target.value)}
            style={{ ...inputStyle, borderColor: errors.altura ? '#FCA5A5' : '#E5E5E5', fontFamily: 'JetBrains Mono, monospace' }}
            onFocus={e => e.target.style.borderColor = '#10B981'}
            onBlur={e => e.target.style.borderColor = errors.altura ? '#FCA5A5' : '#E5E5E5'}
          />
          {errors.altura && <span style={errorStyle}>{errors.altura}</span>}
        </div>
        
        <div>
          <label style={labelStyle}>Nível de atividade física</label>
          <select
            value={formData.nivelAtividadeFisica}
            onChange={e => updateField('nivelAtividadeFisica', e.target.value as NivelAtividadeFisica)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#10B981'}
            onBlur={e => e.target.style.borderColor = '#E5E5E5'}
          >
            <option value="sedentario">Sedentário</option>
            <option value="levemente_ativo">Levemente ativo</option>
            <option value="moderadamente_ativo">Moderadamente ativo</option>
            <option value="muito_ativo">Muito ativo</option>
            <option value="extremamente_ativo">Extremamente ativo</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 24px',
            backgroundColor: loading ? '#6EE7B7' : '#10B981',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 500,
            fontSize: 14,
            transition: 'background-color 0.15s'
          }}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar paciente'}
        </button>
      </div>
    </form>
  );
}
