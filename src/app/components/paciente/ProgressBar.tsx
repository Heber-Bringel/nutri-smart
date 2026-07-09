interface ProgressBarProps {
  concluidas: number;
  total: number;
  percentual: number;
}

export function ProgressBar({ concluidas, total, percentual }: ProgressBarProps) {
  let texto: string;
  if (concluidas === 0) {
    texto = 'Nenhuma refeição concluída hoje';
  } else if (concluidas >= total) {
    texto = 'Todas as refeições concluídas!';
  } else {
    texto = `${concluidas} de ${total} refeições concluídas`;
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
        <span style={{ fontWeight: 600, color: 'var(--color-ink-primary)' }}>Progresso Diário</span>
        <span style={{ color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {concluidas >= total && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          )}
          {texto}
        </span>
      </div>
      <div style={{
        width: '100%', height: 10, background: 'var(--color-border)',
        borderRadius: 6, overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentual}%`,
          height: '100%',
          background: percentual === 100 ? 'var(--color-primary)' : 'var(--color-primary)',
          borderRadius: 6,
          transition: 'width 300ms ease-out',
        }} />
      </div>
    </div>
  );
}
