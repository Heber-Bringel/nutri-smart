import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container } from '../../../di/container';
import { BodyMeasurement } from '../../../model/entities/BodyMeasurement';
import { Paciente } from '../../../model/entities/Paciente';

export function BodyMeasurementFormPage() {
  const { paciente } = useOutletContext<{ paciente: Paciente }>();
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
    let cancelled = false;

    Container.listMeasurementsUseCase.execute(paciente.id)
      .then((m) => {
        if (!cancelled) { setMedidas(m); }
      })
      .catch(() => { if (!cancelled) setError('Erro ao carregar histórico de medidas.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [paciente.id]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      const data = {
        pacienteId: paciente.id,
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

      const updated = await Container.listMeasurementsUseCase.execute(paciente.id);
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
      const updated = await Container.listMeasurementsUseCase.execute(paciente.id);
      setMedidas(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir medida.');
    }
  }

  if (loading) return <div style={{ color: '#9CA3AF', fontSize: 13 }}>Carregando medidas...</div>;

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #E5E5E5',
    fontSize: 14, fontFamily: 'JetBrains Mono, monospace', outline: 'none', 
    transition: 'border-color 0.15s', boxSizing: 'border-box' as const, background: '#fff'
  };

  const labelStyle = { display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em' };

  return (
    <div style={{ paddingBottom: 64 }}>
      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 6, fontSize: 13, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {/* Card do Formulário */}
      <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: 32, marginBottom: 48 }}>
        <h3 style={{ margin: '0 0 24px', fontSize: 14, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {editId ? 'Editar Medidas' : 'Nova Avaliação Corporal'}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24 }}>
          <div>
            <label style={labelStyle}>Data</label>
            <input 
              type="date" 
              value={dataAtendimento} 
              onChange={e => setDataAtendimento(e.target.value)} 
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#10B981'}
              onBlur={e => e.target.style.borderColor = '#E5E5E5'}
            />
          </div>
          <div>
            <label style={labelStyle}>Cintura (cm)</label>
            <input type="number" step="0.1" value={circunferenciaCintura} onChange={e => setCircunferenciaCintura(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#10B981'} onBlur={e => e.target.style.borderColor = '#E5E5E5'} />
          </div>
          <div>
            <label style={labelStyle}>Quadril (cm)</label>
            <input type="number" step="0.1" value={circunferenciaQuadril} onChange={e => setCircunferenciaQuadril(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#10B981'} onBlur={e => e.target.style.borderColor = '#E5E5E5'} />
          </div>
          <div>
            <label style={labelStyle}>Braço (cm)</label>
            <input type="number" step="0.1" value={circunferenciaBraco} onChange={e => setCircunferenciaBraco(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#10B981'} onBlur={e => e.target.style.borderColor = '#E5E5E5'} />
          </div>
          <div>
            <label style={labelStyle}>Coxa (cm)</label>
            <input type="number" step="0.1" value={circunferenciaCoxa} onChange={e => setCircunferenciaCoxa(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#10B981'} onBlur={e => e.target.style.borderColor = '#E5E5E5'} />
          </div>
          <div>
            <label style={labelStyle}>% Gordura</label>
            <input type="number" step="0.1" value={percentualGordura} onChange={e => setPercentualGordura(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#10B981'} onBlur={e => e.target.style.borderColor = '#E5E5E5'} />
          </div>
          <div>
            <label style={labelStyle}>Dobras (mm)</label>
            <input type="number" step="0.1" value={dobrasCutaneas} onChange={e => setDobrasCutaneas(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#10B981'} onBlur={e => e.target.style.borderColor = '#E5E5E5'} />
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid #F5F5F5', paddingTop: 24 }}>
          {editId && (
            <button 
              onClick={resetForm} 
              style={{ 
                padding: '10px 16px', backgroundColor: '#fff', border: '1px solid #E5E5E5', 
                borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' 
              }}
            >
              Cancelar
            </button>
          )}
          <button 
            onClick={handleSave} 
            disabled={saving} 
            style={{ 
              padding: '10px 24px', backgroundColor: saving ? '#6EE7B7' : '#10B981', color: '#fff', 
              border: 'none', borderRadius: 6, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 500 
            }}
          >
            {saving ? 'Salvando...' : editId ? 'Atualizar Avaliação' : 'Registrar Avaliação'}
          </button>
        </div>
      </div>

      {/* Histórico */}
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Histórico de Medidas
      </h3>
      
      {medidas.length === 0 ? (
        <div style={{ padding: '32px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 13, border: '1px dashed #E5E5E5', borderRadius: 8 }}>
          Nenhuma medida corporal registrada para este paciente.
        </div>
      ) : (
        <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, overflowX: 'auto', background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5', backgroundColor: '#F9FAFB' }}>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Cintura</th>
                <th style={thStyle}>Quadril</th>
                <th style={thStyle}>Braço</th>
                <th style={thStyle}>Coxa</th>
                <th style={thStyle}>% Gordura</th>
                <th style={thStyle}>Dobras</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {medidas.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ ...tdStyle, color: '#111827' }}>{new Date(m.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                  <td style={tdStyle}>{m.circunferenciaCintura ?? '-'}</td>
                  <td style={tdStyle}>{m.circunferenciaQuadril ?? '-'}</td>
                  <td style={tdStyle}>{m.circunferenciaBraco ?? '-'}</td>
                  <td style={tdStyle}>{m.circunferenciaCoxa ?? '-'}</td>
                  <td style={tdStyle}>{m.percentualGordura ?? '-'}</td>
                  <td style={tdStyle}>{m.dobrasCutaneasMm ?? '-'}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <button 
                      onClick={() => editMeasurement(m)} 
                      style={{ padding: '4px 8px', marginRight: 8, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#3B82F6' }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(m.id)} 
                      style={{ padding: '4px 8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#DC2626' }}
                    >
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

const thStyle: React.CSSProperties = { 
  textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 11, 
  color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' 
};
const tdStyle: React.CSSProperties = { 
  padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', color: '#4B5563' 
};
