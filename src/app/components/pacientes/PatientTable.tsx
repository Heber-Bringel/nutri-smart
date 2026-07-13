import { Paciente } from '../../../model/entities/Paciente';

interface PatientTableProps {
  pacientes: Paciente[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectPaciente: (paciente: Paciente) => void;
}

export function PatientTable({ pacientes, total, page, pageSize, onPageChange, onSelectPaciente }: PatientTableProps) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem', borderBottom: '2px solid #e5e7eb' }}>Nome</th>
            <th style={{ padding: '0.75rem', borderBottom: '2px solid #e5e7eb' }}>E-mail</th>
            <th style={{ padding: '0.75rem', borderBottom: '2px solid #e5e7eb' }}>Último atendimento</th>
            <th style={{ padding: '0.75rem', borderBottom: '2px solid #e5e7eb' }}>Plano ativo</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map(p => (
            <tr
              key={p.id}
              onClick={() => onSelectPaciente(p)}
              style={{ cursor: 'pointer', borderBottom: '1px solid #e5e7eb' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <td style={{ padding: '0.75rem' }}>{p.nomeCompleto}</td>
              <td style={{ padding: '0.75rem' }}>{p.email}</td>
              <td style={{ padding: '0.75rem' }}>—</td>
              <td style={{ padding: '0.75rem' }}>—</td>
            </tr>
          ))}
          {pacientes.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                Nenhum paciente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            style={paginationButtonStyle}
          >
            Anterior
          </button>
          <span style={{ padding: '0.5rem' }}>{page} de {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            style={paginationButtonStyle}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}

const paginationButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  cursor: 'pointer',
  backgroundColor: '#fff',
};
