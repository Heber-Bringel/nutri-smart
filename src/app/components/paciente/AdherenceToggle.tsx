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
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        border: `2px solid ${isConcluida ? '#16a34a' : '#d1d5db'}`,
        backgroundColor: isConcluida ? '#dcfce7' : '#fff',
        color: isConcluida ? '#16a34a' : '#6b7280',
        cursor: loading ? 'wait' : 'pointer',
        fontWeight: 600,
        fontSize: '0.85rem',
        transition: 'all 0.2s',
      }}
    >
      {isConcluida ? '✓ Concluída' : 'Marcar'}
    </button>
  );
}
