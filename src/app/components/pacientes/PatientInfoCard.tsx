import { Paciente } from '../../../model/entities/Paciente';

interface PatientInfoCardProps {
  paciente: Paciente;
}

const NIVEL_ATIVIDADE_LABEL: Record<string, string> = {
  sedentario: 'Sedentário',
  levemente_ativo: 'Levemente ativo',
  moderadamente_ativo: 'Moderadamente ativo',
  muito_ativo: 'Muito ativo',
  extremamente_ativo: 'Extremamente ativo',
};

function StatItem({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: '#111827', fontWeight: 500, fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit' }}>{value}</div>
    </div>
  );
}

export function PatientInfoCard({ paciente }: PatientInfoCardProps) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
        <StatItem label="E-mail" value={paciente.email} />
        <StatItem label="Data de Nasc." value={new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')} mono />
        <StatItem label="Sexo Biológico" value={paciente.sexoBiologico === 'masculino' ? 'Masculino' : 'Feminino'} />
        <StatItem label="Nível de Atividade" value={NIVEL_ATIVIDADE_LABEL[paciente.nivelAtividadeFisica]} />
        <StatItem label="Peso Inicial" value={`${paciente.pesoInicial} kg`} mono />
        <StatItem label="Altura" value={`${paciente.altura} cm`} mono />
      </div>

      {paciente.imc !== undefined && (
        <>
          <div style={{ height: 1, background: '#F5F5F5', margin: '24px 0' }} />
          <div>
            <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Indicadores Clínicos Calculados
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              <StatItem label="IMC" value={paciente.imc} mono />
              <StatItem label="TMB" value={`${paciente.tmb} kcal/dia`} mono />
              <StatItem label="GET" value={`${paciente.get} kcal/dia`} mono />
            </div>
          </div>
        </>
      )}
      
      <div style={{ marginTop: 24, fontSize: 11, color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>
        Cadastrado em: {new Date(paciente.createdAt).toLocaleDateString('pt-BR')} · 
        Atualizado em: {new Date(paciente.updatedAt).toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
}
