import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container } from '../../../di/container';
import type { BodyMeasurement } from '../../../model/entities/BodyMeasurement';
import type { Paciente } from '../../../model/entities/Paciente';
import { MeasurementChart } from '../../components/medidas/MeasurementChart';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';

export function BodyMeasurementFormPage() {
  const { paciente } = useOutletContext<{ paciente: Paciente }>();
  const [medidas, setMedidas] = useState<BodyMeasurement[]>([]);
  const [dataAtendimento, setDataAtendimento] = useState(new Date().toISOString().split('T')[0]);
  const [peso, setPeso] = useState('');
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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
    setPeso('');
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
    setPeso('');
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
        peso: peso ? Number(peso) : null,
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
    setDeleteTarget(measurementId);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await Container.deleteMeasurementUseCase.execute(deleteTarget);
      const updated = await Container.listMeasurementsUseCase.execute(paciente.id);
      setMedidas(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir medida.');
    } finally {
      setDeleteTarget(null);
    }
  }

  if (loading) return <div style={{ color: 'var(--color-ink-tertiary)', fontSize: 13 }}>Carregando medidas...</div>;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', fontSize: 14,
    fontFamily: 'var(--font-mono)', outline: 'none',
    transition: 'border-color 150ms ease-out', boxSizing: 'border-box',
    background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 500,
    color: 'var(--color-ink-secondary)', textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 11,
    color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-primary)',
    fontSize: 13,
  };

  return (
    <div style={{ paddingBottom: 64 }}>
      {error && (
        <div style={{
          padding: '10px 14px', background: 'var(--color-danger-subtle)',
          border: '1px solid var(--color-danger-border)',
          color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 24,
        }}>
          {error}
        </div>
      )}

      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: 32, marginBottom: 48,
      }}>
        <h3 style={{
          margin: '0 0 24px', fontSize: 12, fontWeight: 600,
          color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {editId ? 'Editar Medidas' : 'Nova Avaliação Corporal'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24 }}>
          <div>
            <label style={labelStyle}>Data</label>
            <input type="date" value={dataAtendimento} onChange={e => setDataAtendimento(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
          </div>
          <div>
            <label style={labelStyle}>Peso (kg)</label>
            <input type="number" step="0.1" value={peso} onChange={e => setPeso(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
          </div>
          <div>
            <label style={labelStyle}>Cintura (cm)</label>
            <input type="number" step="0.1" value={circunferenciaCintura} onChange={e => setCircunferenciaCintura(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
          </div>
          <div>
            <label style={labelStyle}>Quadril (cm)</label>
            <input type="number" step="0.1" value={circunferenciaQuadril} onChange={e => setCircunferenciaQuadril(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
          </div>
          <div>
            <label style={labelStyle}>Braço (cm)</label>
            <input type="number" step="0.1" value={circunferenciaBraco} onChange={e => setCircunferenciaBraco(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
          </div>
          <div>
            <label style={labelStyle}>Coxa (cm)</label>
            <input type="number" step="0.1" value={circunferenciaCoxa} onChange={e => setCircunferenciaCoxa(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
          </div>
          <div>
            <label style={labelStyle}>% Gordura</label>
            <input type="number" step="0.1" value={percentualGordura} onChange={e => setPercentualGordura(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
          </div>
          <div>
            <label style={labelStyle}>Dobras (mm)</label>
            <input type="number" step="0.1" value={dobrasCutaneas} onChange={e => setDobrasCutaneas(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid var(--color-border-light)', paddingTop: 24 }}>
          {editId && (
            <button onClick={resetForm} style={{
              padding: '10px 16px', background: 'var(--color-surface)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--color-ink-primary)',
            }}>
              Cancelar
            </button>
          )}
          <button onClick={handleSave} disabled={saving} style={{
            padding: '10px 24px',
            background: saving ? 'var(--color-ink-tertiary)' : 'var(--color-primary)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
            cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 500,
            transition: 'background 150ms ease-out',
          }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = 'var(--color-primary)'; }}>
            {saving ? 'Salvando...' : editId ? 'Atualizar Avaliação' : 'Registrar Avaliação'}
          </button>
        </div>
      </div>

      <MeasurementChart data={medidas} />

      <h3 style={{
        margin: '0 0 16px', fontSize: 12, fontWeight: 600,
        color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Histórico de Medidas
      </h3>

      {medidas.length === 0 ? (
        <div style={{
          padding: '32px 0', textAlign: 'center', color: 'var(--color-ink-tertiary)',
          fontSize: 13, border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
        }}>
          Nenhuma medida corporal registrada para este paciente.{' '}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'none', border: 'none', color: 'var(--color-primary)',
              cursor: 'pointer', textDecoration: 'underline', fontSize: 13,
            }}
          >
            Registrar primeira medida
          </button>
        </div>
      ) : (
        <div style={{
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
          overflowX: 'auto', background: 'var(--color-surface)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
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
                <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ ...tdStyle, color: 'var(--color-ink-primary)' }}>
                    {new Date(m.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td style={tdStyle}>{m.circunferenciaCintura ?? '-'}</td>
                  <td style={tdStyle}>{m.circunferenciaQuadril ?? '-'}</td>
                  <td style={tdStyle}>{m.circunferenciaBraco ?? '-'}</td>
                  <td style={tdStyle}>{m.circunferenciaCoxa ?? '-'}</td>
                  <td style={tdStyle}>{m.percentualGordura ?? '-'}</td>
                  <td style={tdStyle}>{m.dobrasCutaneasMm ?? '-'}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <button onClick={() => editMeasurement(m)} style={{
                      padding: '4px 8px', marginRight: 8, background: 'transparent',
                      border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                      color: 'var(--color-primary)',
                    }}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(m.id)} style={{
                      padding: '4px 8px', background: 'transparent', border: 'none',
                      cursor: 'pointer', fontSize: 12, fontWeight: 500,
                      color: 'var(--color-danger)',
                    }}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Excluir Medida"
        message="Tem certeza que deseja excluir este registro de medida? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
