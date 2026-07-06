import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../../di/container';
import { BodyMeasurement } from '../../../model/entities/BodyMeasurement';
import { Paciente } from '../../../model/entities/Paciente';

export function BodyMeasurementFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [medidas, setMedidas] = useState<BodyMeasurement[]>([]);
  const [dataAtendimento, setDataAtendimento] = useState(new Date().toISOString().split('T')[0]);
  const [circunferenciaCintura, setCircunferenciaCintura] = useState('');
  const [circunferenciaQuadril, setCircunferenciaQuadril] = useState('');
  const [circunferenciaBraco, setCircunferenciaBraco] = useState('');
  const [circunferenciaCoxa, setCircunferenciaCoxa] = useState('');
  const [percentualGordura, setPercentualGordura] = useState('');
  const [dobrasCutaneas, setDobrasCutaneas] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    Promise.all([
      Container.getPacienteUseCase.execute(id),
      Container.listMeasurementsUseCase.execute(id),
    ])
      .then(([p, m]) => {
        if (!cancelled) { setPaciente(p); setMedidas(m); }
      })
      .catch(() => { if (!cancelled) setError('Erro ao carregar dados.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  function resetForm() {
    setDataAtendimento(new Date().toISOString().split('T')[0]);
    setCircunferenciaCintura('');
    setCircunferenciaQuadril('');
    setCircunferenciaBraco('');
    setCircunferenciaCoxa('');
    setPercentualGordura('');
    setDobrasCutaneas('');
    setEditId(null);
  }

  function editMeasurement(m: BodyMeasurement) {
    setEditId(m.id);
    setDataAtendimento(m.dataAtendimento);
    setCircunferenciaCintura(m.circunferenciaCintura?.toString() || '');
    setCircunferenciaQuadril(m.circunferenciaQuadril?.toString() || '');
    setCircunferenciaBraco(m.circunferenciaBraco?.toString() || '');
    setCircunferenciaCoxa(m.circunferenciaCoxa?.toString() || '');
    setPercentualGordura(m.percentualGordura?.toString() || '');
    setDobrasCutaneas(m.dobrasCutaneasMm?.toString() || '');
  }

  async function handleSave() {
    if (!id) return;
    setSaving(true);
    setError(null);

    try {
      const data = {
        pacienteId: id,
        dataAtendimento,
        circunferenciaCintura: circunferenciaCintura ? Number(circunferenciaCintura) : null,
        circunferenciaQuadril: circunferenciaQuadril ? Number(circunferenciaQuadril) : null,
        circunferenciaBraco: circunferenciaBraco ? Number(circunferenciaBraco) : null,
        circunferenciaCoxa: circunferenciaCoxa ? Number(circunferenciaCoxa) : null,
        percentualGordura: percentualGordura ? Number(percentualGordura) : null,
        dobrasCutaneasMm: dobrasCutaneas ? Number(dobrasCutaneas) : null,
      };

      if (editId) {
        await Container.updateMeasurementUseCase.execute(editId, data);
      } else {
        await Container.registerMeasurementUseCase.execute(data as any);
      }

      const updated = await Container.listMeasurementsUseCase.execute(id);
      setMedidas(updated);
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar medida.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(measurementId: string) {
    if (!confirm('Excluir este registro de medida?')) return;
    try {
      await Container.deleteMeasurementUseCase.execute(measurementId);
      const updated = await Container.listMeasurementsUseCase.execute(id!);
      setMedidas(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir medida.');
    }
  }

  if (loading) return <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>Carregando...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate(`/dashboard/pacientes/${id}`)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
          ← Voltar
        </button>
      </div>

      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Medidas Corporais</h1>
      {paciente && <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Paciente: {paciente.nomeCompleto}</p>}

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '1rem', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>{editId ? 'Editar' : 'Nova'} Medida</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Data Atendimento</label>
            <input type="date" value={dataAtendimento} onChange={e => setDataAtendimento(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Cintura (cm)</label>
            <input type="number" step="0.1" value={circunferenciaCintura} onChange={e => setCircunferenciaCintura(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Quadril (cm)</label>
            <input type="number" step="0.1" value={circunferenciaQuadril} onChange={e => setCircunferenciaQuadril(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Braço (cm)</label>
            <input type="number" step="0.1" value={circunferenciaBraco} onChange={e => setCircunferenciaBraco(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Coxa (cm)</label>
            <input type="number" step="0.1" value={circunferenciaCoxa} onChange={e => setCircunferenciaCoxa(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>% Gordura</label>
            <input type="number" step="0.1" value={percentualGordura} onChange={e => setPercentualGordura(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Dobras Cutâneas (mm)</label>
            <input type="number" step="0.1" value={dobrasCutaneas} onChange={e => setDobrasCutaneas(e.target.value)} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: '0.5rem 1.5rem', backgroundColor: saving ? '#9ca3af' : '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Salvando...' : editId ? 'Atualizar' : 'Registrar'}
          </button>
          {editId && (
            <button onClick={resetForm} style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <h3>Histórico</h3>
      {medidas.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>Nenhuma medida registrada.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Cintura</th>
                <th style={thStyle}>Quadril</th>
                <th style={thStyle}>Braço</th>
                <th style={thStyle}>Coxa</th>
                <th style={thStyle}>%Gordura</th>
                <th style={thStyle}>Dobras</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {medidas.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={tdStyle}>{new Date(m.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                  <td style={tdStyle}>{m.circunferenciaCintura ?? '-'}</td>
                  <td style={tdStyle}>{m.circunferenciaQuadril ?? '-'}</td>
                  <td style={tdStyle}>{m.circunferenciaBraco ?? '-'}</td>
                  <td style={tdStyle}>{m.circunferenciaCoxa ?? '-'}</td>
                  <td style={tdStyle}>{m.percentualGordura ?? '-'}</td>
                  <td style={tdStyle}>{m.dobrasCutaneasMm ?? '-'}</td>
                  <td style={tdStyle}>
                    <button onClick={() => editMeasurement(m)} style={{ padding: '0.2rem 0.5rem', marginRight: '0.25rem', backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(m.id)} style={{ padding: '0.2rem 0.5rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: '#dc2626' }}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.5rem', fontWeight: 600, borderBottom: '2px solid #e5e7eb' };
const tdStyle: React.CSSProperties = { padding: '0.5rem' };
