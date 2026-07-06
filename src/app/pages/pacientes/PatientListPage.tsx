import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paciente } from '../../../model/entities/Paciente';
import { Container } from '../../../di/container';
import { PatientSearchBar } from '../../components/pacientes/PatientSearchBar';
import { PatientTable } from '../../components/pacientes/PatientTable';

export function PatientListPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    let cancelled = false;

    async function fetchPacientes() {
      setLoading(true);
      try {
        const result = await Container.listPacientesUseCase.execute({ search, page, pageSize });
        if (!cancelled) {
          setPacientes(result.data);
          setTotal(result.total);
        }
      } catch {
        if (!cancelled) {
          setPacientes([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPacientes();
    return () => { cancelled = true; };
  }, [search, page]);

  function handleSelectPaciente(paciente: Paciente) {
    navigate(`/dashboard/pacientes/${paciente.id}`);
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Pacientes</h1>
        <button
          onClick={() => navigate('/dashboard/pacientes/novo')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          + Novo Paciente
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <PatientSearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} />
      </div>

      {loading ? (
        <p>Carregando pacientes...</p>
      ) : (
        <PatientTable
          pacientes={pacientes}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onSelectPaciente={handleSelectPaciente}
        />
      )}
    </div>
  );
}
