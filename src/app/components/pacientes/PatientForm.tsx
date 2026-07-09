import { useState } from 'react';
import type { SexoBiologico, NivelAtividadeFisica } from '../../../model/entities/Paciente';

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
  initialData?: Partial<PatientFormData>;
  editMode?: boolean;
}

function usePatientForm(initialData?: Partial<PatientFormData>) {
  const [formData, setFormData] = useState<PatientFormData>({
    nomeCompleto: initialData?.nomeCompleto || '',
    email: initialData?.email || '',
    dataNascimento: initialData?.dataNascimento || '',
    sexoBiologico: initialData?.sexoBiologico || 'masculino',
    pesoInicial: initialData?.pesoInicial || '',
    altura: initialData?.altura || '',
    nivelAtividadeFisica: initialData?.nivelAtividadeFisica || 'sedentario',
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

  function updateField<K extends keyof PatientFormData>(key: K, value: PatientFormData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  return { formData, errors, validate, updateField };
}

function Input({ error, mono, ...props }: {
  error?: string; mono?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <input
        {...props}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
          border: '1px solid', borderColor: error ? 'var(--color-danger-border)' : 'var(--color-border)',
          fontSize: 14, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
          outline: 'none', boxSizing: 'border-box', background: 'var(--color-surface)',
          color: 'var(--color-ink-primary)',
          transition: 'border-color 150ms ease-out',
          ...props.style as React.CSSProperties,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)';
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--color-danger-border)' : 'var(--color-border)';
          props.onBlur?.(e);
        }}
      />
      {error && <span style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4, display: 'block' }}>{error}</span>}
    </div>
  );
}

function Select({ error, options, value, onChange }: {
  error?: string;
  options: { value: string; label: string }[];
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
          border: '1px solid', borderColor: error ? 'var(--color-danger-border)' : 'var(--color-border)',
          fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none',
          boxSizing: 'border-box', background: 'var(--color-surface)',
          color: 'var(--color-ink-primary)',
          transition: 'border-color 150ms ease-out',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
        onBlur={(e) => { e.target.style.borderColor = error ? 'var(--color-danger-border)' : 'var(--color-border)'; }}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <span style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4, display: 'block' }}>{error}</span>}
    </div>
  );
}

export function PatientForm({ onSubmit, loading, initialData, editMode }: PatientFormProps) {
  const { formData, errors, validate, updateField } = usePatientForm(initialData);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 500,
    color: 'var(--color-ink-secondary)', textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <div>
          <label style={labelStyle}>Nome completo</label>
          <Input
            type="text"
            value={formData.nomeCompleto}
            error={errors.nomeCompleto}
            onChange={e => updateField('nomeCompleto', e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>E-mail</label>
          <Input
            type="email"
            value={formData.email}
            error={errors.email}
            onChange={e => updateField('email', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <div>
          <label style={labelStyle}>Data de nascimento</label>
          <Input
            type="date"
            value={formData.dataNascimento}
            error={errors.dataNascimento}
            mono
            onChange={e => updateField('dataNascimento', e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Sexo biológico</label>
          <Select
            options={[{ value: 'masculino', label: 'Masculino' }, { value: 'feminino', label: 'Feminino' }]}
            value={formData.sexoBiologico}
            onChange={v => updateField('sexoBiologico', v as SexoBiologico)}
          />
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--color-border-light)', margin: '8px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <div>
          <label style={labelStyle}>Peso inicial (kg)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.pesoInicial}
            error={errors.pesoInicial}
            mono
            onChange={e => updateField('pesoInicial', e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Altura (cm)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.altura}
            error={errors.altura}
            mono
            onChange={e => updateField('altura', e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Nível de atividade física</label>
          <Select
            options={[
              { value: 'sedentario', label: 'Sedentário' },
              { value: 'levemente_ativo', label: 'Levemente ativo' },
              { value: 'moderadamente_ativo', label: 'Moderadamente ativo' },
              { value: 'muito_ativo', label: 'Muito ativo' },
              { value: 'extremamente_ativo', label: 'Extremamente ativo' },
            ]}
            value={formData.nivelAtividadeFisica}
            onChange={v => updateField('nivelAtividadeFisica', v as NivelAtividadeFisica)}
          />
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: loading ? 'var(--color-ink-tertiary)' : 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'background 150ms ease-out',
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--color-primary)'; }}
        >
          {loading ? 'Salvando...' : editMode ? 'Salvar alterações' : 'Cadastrar paciente'}
        </button>
      </div>
    </form>
  );
}
