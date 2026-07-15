import { useState } from 'react';
import { motion } from 'framer-motion';

interface AdherenceToggleProps {
  refeicaoId: string;
  concluida: boolean;
  onToggle: (refeicaoId: string, concluida: boolean) => Promise<void>;
}

export function AdherenceToggle({ refeicaoId, concluida: initial, onToggle }: AdherenceToggleProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      await onToggle(refeicaoId, !initial);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={loading}
      animate={{
        background: initial ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
        borderColor: initial ? 'var(--color-primary)' : 'var(--color-border)',
        color: initial ? 'var(--color-primary-text)' : 'var(--color-ink-secondary)',
      }}
      transition={{ duration: 0.15 }}
      style={{
        padding: '6px 14px',
        borderRadius: 20,
        borderWidth: 2,
        borderStyle: 'solid',
        cursor: loading ? 'wait' : 'pointer',
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {initial ? '✓ Concluída' : 'Marcar'}
    </motion.button>
  );
}
