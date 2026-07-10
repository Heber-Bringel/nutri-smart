import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, PatientFormData } from '../../../viewmodel/pacientes/PatientSchema';

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => Promise<void>;
  loading: boolean;
  initialData?: Partial<PatientFormData>;
  editMode?: boolean;
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

function Select({ error, label, options, ...props }: {
  error?: string; label?: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label style={{ display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 500, color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      <select
        {...props}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
          border: '1px solid', borderColor: error ? 'var(--color-danger-border)' : 'var(--color-border)',
          fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none',
          boxSizing: 'border-box', background: 'var(--color-surface)',
          color: 'var(--color-ink-primary)',
          transition: 'border-color 150ms ease-out',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; props.onFocus?.(e); }}
        onBlur={(e) => { e.target.style.borderColor = error ? 'var(--color-danger-border)' : 'var(--color-border)'; props.onBlur?.(e); }}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <span style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4, display: 'block' }}>{error}</span>}
    </div>
  );
}

export function PatientForm({ onSubmit, loading, initialData, editMode }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema) as any,
    defaultValues: {
      nomeCompleto: '',
      email: '',
      dataNascimento: '',
      sexoBiologico: 'masculino',
      pesoInicial: '' as any,
      altura: '' as any,
      nivelAtividadeFisica: 'sedentario',
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 500,
    color: 'var(--color-ink-secondary)', textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <div>
          <label style={labelStyle}>Nome completo</label>
          <Input type="text" error={errors.nomeCompleto?.message} {...register('nomeCompleto')} />
        </div>
        <div>
          <label style={labelStyle}>E-mail</label>
          <Input type="email" error={errors.email?.message} {...register('email')} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <div>
          <label style={labelStyle}>Data de nascimento</label>
          <Input type="date" mono error={errors.dataNascimento?.message} {...register('dataNascimento')} />
        </div>
        <div>
          <label style={labelStyle}>Sexo biológico</label>
          <Select
            options={[{ value: 'masculino', label: 'Masculino' }, { value: 'feminino', label: 'Feminino' }]}
            error={errors.sexoBiologico?.message}
            {...register('sexoBiologico')}
          />
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--color-border-light)', margin: '8px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <div>
          <label style={labelStyle}>Peso inicial (kg)</label>
          <Input type="number" step="0.01" mono error={errors.pesoInicial?.message} {...register('pesoInicial')} />
        </div>
        <div>
          <label style={labelStyle}>Altura (cm)</label>
          <Input type="number" step="0.01" mono error={errors.altura?.message} {...register('altura')} />
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
            error={errors.nivelAtividadeFisica?.message}
            {...register('nivelAtividadeFisica')}
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
