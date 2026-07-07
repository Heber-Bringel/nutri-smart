import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container } from '../../../di/container';
import { ClinicalNote } from '../../../model/entities/ClinicalNote';
import { Paciente } from '../../../model/entities/Paciente';

export function ClinicalNotesPage() {
  const { paciente } = useOutletContext<{ paciente: Paciente }>();
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [conteudo, setConteudo] = useState('');
  const [dataAtendimento, setDataAtendimento] = useState(new Date().toISOString().split('T')[0]);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Container.listClinicalNotesUseCase.execute(paciente.id)
      .then(result => { if (!cancelled) setNotes(result); })
      .catch(() => { if (!cancelled) setError('Erro ao carregar anotações.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [paciente.id]);

  function resetForm() {
    setConteudo('');
    setDataAtendimento(new Date().toISOString().split('T')[0]);
    setEditId(null);
  }

  function editNote(note: ClinicalNote) {
    setEditId(note.id);
    setConteudo(note.conteudo);
    setDataAtendimento(note.dataAtendimento);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      if (editId) {
        await Container.updateClinicalNoteUseCase.execute(editId, { conteudo, dataAtendimento });
      } else {
        await Container.createClinicalNoteUseCase.execute({ pacienteId: paciente.id, conteudo, dataAtendimento });
      }

      const updated = await Container.listClinicalNotesUseCase.execute(paciente.id);
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

  if (loading) return <div style={{ color: '#9CA3AF', fontSize: 13 }}>Carregando anotações...</div>;

  return (
    <div style={{ paddingBottom: 64 }}>
      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 6, fontSize: 13, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {/* Form Card */}
      <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: 32, marginBottom: 48 }}>
        <h3 style={{ margin: '0 0 24px', fontSize: 14, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {editId ? 'Editar Anotação' : 'Nova Anotação Clínica'}
        </h3>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>
            Data do Atendimento
          </label>
          <input 
            type="date" 
            value={dataAtendimento} 
            onChange={e => setDataAtendimento(e.target.value)} 
            style={{ 
              width: '200px', padding: '10px 12px', borderRadius: 6, border: '1px solid #E5E5E5', 
              fontSize: 14, outline: 'none', fontFamily: 'JetBrains Mono, monospace', background: '#fff'
            }}
            onFocus={e => e.target.style.borderColor = '#10B981'}
            onBlur={e => e.target.style.borderColor = '#E5E5E5'}
          />
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>
            Conteúdo
          </label>
          <textarea
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
            style={{ 
              width: '100%', padding: '12px', borderRadius: 6, border: '1px solid #E5E5E5', 
              minHeight: '120px', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical'
            }}
            placeholder="Registre aqui suas observações clínicas sobre o paciente..."
            onFocus={e => e.target.style.borderColor = '#10B981'}
            onBlur={e => e.target.style.borderColor = '#E5E5E5'}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid #F5F5F5', paddingTop: 24 }}>
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
            disabled={saving || !conteudo.trim()} 
            style={{ 
              padding: '10px 24px', backgroundColor: (saving || !conteudo.trim()) ? '#6EE7B7' : '#10B981', color: '#fff', 
              border: 'none', borderRadius: 6, cursor: (saving || !conteudo.trim()) ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 500 
            }}
          >
            {saving ? 'Salvando...' : editId ? 'Atualizar Anotação' : 'Registrar Anotação'}
          </button>
        </div>
      </div>

      {/* Histórico */}
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Histórico
      </h3>

      {notes.length === 0 ? (
        <div style={{ padding: '32px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 13, border: '1px dashed #E5E5E5', borderRadius: 8 }}>
          Nenhuma anotação clínica registrada.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {notes.map(note => (
            <div key={note.id} style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: 24, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#4B5563', fontFamily: 'JetBrains Mono, monospace' }}>
                  {new Date(note.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                </span>
                <div>
                  <button 
                    onClick={() => editNote(note)} 
                    style={{ padding: '4px 8px', marginRight: 8, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#3B82F6' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)} 
                    style={{ padding: '4px 8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#DC2626' }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 14, color: '#111827', lineHeight: 1.6 }}>
                {note.conteudo}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
