interface ProgressBarProps {
  concluidas: number;
  total: number;
  percentual: number;
}

export function ProgressBar({ concluidas, total, percentual }: ProgressBarProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
        <span style={{ fontWeight: 600 }}>Progresso Diário</span>
        <span style={{ color: '#6b7280' }}>{concluidas}/{total} refeições ({percentual}%)</span>
      </div>
      <div style={{ width: '100%', height: '12px', backgroundColor: '#e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${percentual}%`,
            height: '100%',
            backgroundColor: percentual === 100 ? '#16a34a' : '#2563eb',
            borderRadius: '6px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
