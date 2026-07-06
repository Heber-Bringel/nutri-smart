import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../../di/container';
import { ClinicalNote } from '../../../model/entities/ClinicalNote';

export function ClinicalNotesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [conteudo, setConteudo] = useState('');
  const [dataAtendimento, setDataAtendimento] = useState(new Date().toISOString().split('T')[0]);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    Container.listClinicalNotesUseCase.execute(id)
      .then(result => { if (!cancelled) setNotes(result); })
      .catch(() => { if (!cancelled) setError('Erro ao carregar anotações.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  function resetForm() {
    setConteudo('');
    setDataAtendimento(new Date().toISOString().split('T')[0]);
    setEditId(null);
  }

  function editNote(note: ClinicalNote) {
    setEditId(note.id);
    setConteudo(note.conteudo);
    setDataAtendimento(note.dataAtendimento);
  }

  async function handleSave() {
    if (!id) return;
    setSaving(true);
    setError(null);

    try {
      if (editId) {
        await Container.updateClinicalNoteUseCase.execute(editId, { conteudo, dataAtendimento });
      } else {
        await Container.createClinicalNoteUseCase.execute({ pacienteId: id, conteudo, dataAtendimento });
      }

      const updated = await Container.listClinicalNotesUseCase.execute(id);
      setNotes(updated);
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar anotação.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(noteId: string) {
    if (!confirm('Excluir esta anotação clínica?')) return;
    try {
      await Container.deleteClinicalNoteUseCase.execute(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir anotação.');
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate(`/dashboard/pacientes/${id}`)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
          ← Voltar
        </button>
      </div>

      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Anotações Clínicas</h1>

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '1rem', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Data do Atendimento</label>
          <input type="date" value={dataAtendimento} onChange={e => setDataAtendimento(e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Conteúdo</label>
          <textarea
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '120px' }}
            placeholder="Registre aqui suas observações clínicas sobre o paciente..."
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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

      {loading ? (
        <div>Carregando...</div>
      ) : notes.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>Nenhuma anotação clínica registrada.</p>
      ) : (
        <div>
          {notes.map(note => (
            <div key={note.id} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  {new Date(note.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                </span>
                <div>
                  <button onClick={() => editNote(note)} style={{ padding: '0.2rem 0.5rem', marginRight: '0.25rem', backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(note.id)} style={{ padding: '0.2rem 0.5rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: '#dc2626' }}>
                    Excluir
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{note.conteudo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
