import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * Revela suavemente o conteúdo quando ele termina de carregar, evitando a
 * troca abrupta ("seca") do skeleton para os dados reais. Usa um leve fade +
 * deslocamento vertical. Respeita `prefers-reduced-motion` via configuração
 * global do framer-motion / CSS.
 */
export function FadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
