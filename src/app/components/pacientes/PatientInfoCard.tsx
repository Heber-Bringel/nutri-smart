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

export function PatientInfoCard({ paciente }: PatientInfoCardProps) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', maxWidth: '600px' }}>
      <h2 style={{ margin: '0 0 1rem' }}>{paciente.nomeCompleto}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div><strong>E-mail:</strong> {paciente.email}</div>
        <div><strong>Data de nascimento:</strong> {new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}</div>
        <div><strong>Sexo biológico:</strong> {paciente.sexoBiologico === 'masculino' ? 'Masculino' : 'Feminino'}</div>
        <div><strong>Peso inicial:</strong> {paciente.pesoInicial} kg</div>
        <div><strong>Altura:</strong> {paciente.altura} cm</div>
        <div><strong>Nível de atividade:</strong> {NIVEL_ATIVIDADE_LABEL[paciente.nivelAtividadeFisica]}</div>
      </div>

      {paciente.imc !== undefined && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Indicadores Clínicos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div><strong>IMC:</strong> {paciente.imc}</div>
            <div><strong>TMB:</strong> {paciente.tmb} kcal/dia</div>
            <div><strong>GET:</strong> {paciente.get} kcal/dia</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
        <span>Cadastrado em: {new Date(paciente.createdAt).toLocaleDateString('pt-BR')}</span>
        <span style={{ marginLeft: '1rem' }}>Atualizado em: {new Date(paciente.updatedAt).toLocaleDateString('pt-BR')}</span>
      </div>
    </div>
  );
}
