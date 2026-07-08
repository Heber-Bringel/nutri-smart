interface ProgressBarProps {
  concluidas: number;
  total: number;
  percentual: number;
}

export function ProgressBar({ concluidas, total, percentual }: ProgressBarProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
        <span style={{ fontWeight: 600, color: 'var(--color-ink-primary)' }}>Progresso Diário</span>
        <span style={{ color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)' }}>
          {concluidas}/{total} refeições ({percentual}%)
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
