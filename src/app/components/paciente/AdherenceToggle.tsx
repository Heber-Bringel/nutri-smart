import { useState } from 'react';

interface AdherenceToggleProps {
  refeicaoId: string;
  concluida: boolean;
  onToggle: (refeicaoId: string, concluida: boolean) => Promise<void>;
}

export function AdherenceToggle({ refeicaoId, concluida: initial, onToggle }: AdherenceToggleProps) {
  const [loading, setLoading] = useState(false);
  const [isConcluida, setIsConcluida] = useState(initial);

  async function handleClick() {
    setLoading(true);
    const newVal = !isConcluida;
    setIsConcluida(newVal);

    try {
      await onToggle(refeicaoId, newVal);
    } catch {
      setIsConcluida(!newVal);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: '6px 14px',
        borderRadius: 20,
        border: `2px solid ${isConcluida ? 'var(--color-primary)' : 'var(--color-border)'}`,
        background: isConcluida ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
        color: isConcluida ? 'var(--color-primary-text)' : 'var(--color-ink-secondary)',
        cursor: loading ? 'wait' : 'pointer',
        fontWeight: 600,
        fontSize: 13,
        transition: 'all 150ms ease-out',
      }}
    >
      {isConcluida ? '✓ Concluída' : 'Marcar'}
    </button>
  );
}
