import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DeletePatientDialogProps {
  pacienteNome: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function DeletePatientDialog({ pacienteNome, onConfirm, loading, onCancel }: DeletePatientDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const confirmed = inputValue === 'EXCLUIR';

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [loading, onCancel]);

  async function handleConfirm() {
    if (!confirmed) return;
    await onConfirm();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 300,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          background: 'var(--color-surface)',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          maxWidth: '440px',
          width: '90%',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: 'var(--color-ink-primary)' }}>
          Excluir paciente
        </h2>

        <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}>
          Esta ação apagará permanentemente os dados de{' '}
          <span style={{ fontWeight: 600, color: 'var(--color-ink-primary)' }}>{pacienteNome}</span>,
          incluindo planos alimentares, avaliações corporais e histórico.
        </p>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 500, color: 'var(--color-ink-secondary)' }}>
            Digite <span style={{ color: 'var(--color-danger)' }}>EXCLUIR</span> para confirmar
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              outline: 'none',
              color: 'var(--color-ink-primary)',
              background: 'var(--color-surface)',
              transition: 'border-color 150ms ease-out',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-ink-tertiary)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              background: 'var(--color-surface)',
              color: 'var(--color-ink-primary)',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmed || loading}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              cursor: confirmed ? 'pointer' : 'not-allowed',
              background: confirmed ? 'var(--color-danger)' : 'var(--color-subtle)',
              color: confirmed ? '#fff' : 'var(--color-ink-tertiary)',
              transition: 'background 150ms ease-out',
            }}
          >
            {loading ? 'Excluindo...' : 'Confirmar exclusão'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
