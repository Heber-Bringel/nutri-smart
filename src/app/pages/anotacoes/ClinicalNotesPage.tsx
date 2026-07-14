import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container } from '../../../di/container';
import type { ClinicalNote } from '../../../model/entities/ClinicalNote';
import type { PatientProfileOutletContext } from '../../components/layouts/PatientProfileLayout';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { getTodayLocal } from '../../../shared/utils/date';
import { NotesSkeleton } from '../../components/shared/Skeleton';
import { FadeIn } from '../../components/shared/FadeIn';

export function ClinicalNotesPage() {
  const { paciente, cacheDadosPaciente } = useOutletContext<PatientProfileOutletContext>();
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [conteudo, setConteudo] = useState('');
  const [dataAtendimento, setDataAtendimento] = useState(getTodayLocal());
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    cacheDadosPaciente.carregarAnotacoes()
      .then(result => { if (!cancelled) setNotes(result); })
      .catch(() => { if (!cancelled) setError('Erro ao carregar anotações.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [paciente.id, cacheDadosPaciente]);

  function resetForm() {
    setConteudo('');
    setDataAtendimento(getTodayLocal());
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

      cacheDadosPaciente.invalidar('anotacoes');
      const updated = await cacheDadosPaciente.carregarAnotacoes();
      setNotes(updated);
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar anotação.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(noteId: string) {
    setDeleteTarget(noteId);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await Container.deleteClinicalNoteUseCase.execute(deleteTarget);
      cacheDadosPaciente.invalidar('anotacoes');
      setNotes(notes.filter(n => n.id !== deleteTarget));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir anotação.');
    } finally {
      setDeleteTarget(null);
    }
  }

  if (loading) return <NotesSkeleton />;

  return (
    <FadeIn>
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

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 32, marginBottom: 48 }}>
        <h3 style={{
          margin: '0 0 24px', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {editId ? 'Editar Anotação' : 'Nova Anotação Clínica'}
        </h3>

        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', fontSize: 11, color: 'var(--color-ink-secondary)',
            textTransform: 'uppercase', marginBottom: 8, fontWeight: 500, letterSpacing: '0.05em',
          }}>
            Data do Atendimento
          </label>
          <input
            type="date"
            value={dataAtendimento}
            onChange={e => setDataAtendimento(e.target.value)}
            style={{
              width: 200, padding: '10px 12px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', fontSize: 14, outline: 'none',
              fontFamily: 'var(--font-mono)', background: 'var(--color-surface)',
              color: 'var(--color-ink-primary)',
              transition: 'border-color 150ms ease-out',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', fontSize: 11, color: 'var(--color-ink-secondary)',
            textTransform: 'uppercase', marginBottom: 8, fontWeight: 500, letterSpacing: '0.05em',
          }}>
            Conteúdo
          </label>
          <textarea
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
            placeholder="Registre aqui suas observações clínicas sobre o paciente..."
            style={{
              width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', minHeight: 120, fontSize: 14,
              fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical',
              background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
              transition: 'border-color 150ms ease-out',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid var(--color-border-light)', paddingTop: 24 }}>
          {editId && (
            <button
              onClick={resetForm}
              style={{
                padding: '10px 16px', background: 'var(--color-surface)',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--color-ink-primary)',
              }}
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !conteudo.trim()}
            style={{
              padding: '10px 24px',
              background: (saving || !conteudo.trim()) ? 'var(--color-ink-tertiary)' : 'var(--color-primary)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
              cursor: (saving || !conteudo.trim()) ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 500,
              transition: 'background 150ms ease-out',
            }}
            onMouseEnter={(e) => {
              if (!saving && conteudo.trim()) e.currentTarget.style.background = 'var(--color-primary-hover)';
            }}
            onMouseLeave={(e) => {
              if (!saving && conteudo.trim()) e.currentTarget.style.background = 'var(--color-primary)';
            }}
          >
            {saving ? 'Salvando...' : editId ? 'Atualizar Anotação' : 'Registrar Anotação'}
          </button>
        </div>
      </div>

      <h3 style={{
        margin: '0 0 16px', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-secondary)',
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        Histórico
      </h3>

      {notes.length === 0 ? (
        <div style={{
          padding: '32px 0', textAlign: 'center', color: 'var(--color-ink-tertiary)',
          fontSize: 13, border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
        }}>
          Nenhuma anotação clínica registrada.{' '}
          <button
            onClick={() => { resetForm(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{
              background: 'none', border: 'none', color: 'var(--color-primary)',
              cursor: 'pointer', textDecoration: 'underline', fontSize: 13,
            }}
          >
            Criar primeira anotação
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {notes.map(note => {
            const isExpanded = expandedNoteId === note.id;
            const preview = note.conteudo.length > 100 ? note.conteudo.slice(0, 100) + '...' : note.conteudo;
            return (
              <div key={note.id} style={{
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
                padding: 24, background: 'var(--color-surface)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(note.dataAtendimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>
                  <div>
                    <button
                      onClick={() => editNote(note)}
                      style={{
                        padding: '4px 8px', marginRight: 8, background: 'transparent',
                        border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                        color: 'var(--color-primary)',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      style={{
                        padding: '4px 8px', background: 'transparent', border: 'none',
                        cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--color-danger)',
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
                <p style={{
                  margin: 0, whiteSpace: 'pre-wrap', fontSize: 14,
                  color: 'var(--color-ink-primary)', lineHeight: 1.6,
                }}>
                  {isExpanded ? note.conteudo : preview}
                </p>
                {note.conteudo.length > 100 && (
                  <button
                    onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--color-primary)',
                      cursor: 'pointer', fontSize: 12, fontWeight: 500, marginTop: 8, padding: 0,
                    }}
                  >
                    {isExpanded ? 'Ver menos' : 'Ver mais'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Excluir Anotação"
        message="Tem certeza que deseja excluir esta anotação clínica? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
    </FadeIn>
  );
}
