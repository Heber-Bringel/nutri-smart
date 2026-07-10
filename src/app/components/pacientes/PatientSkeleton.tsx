export function PatientSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid var(--color-border-light)',
        backgroundColor: 'transparent',
      }}
    >
      {/* Avatar Circular */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: 'var(--color-subtle)',
        flexShrink: 0,
      }} />
      
      {/* Nome e E-mail */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          height: 14,
          backgroundColor: 'var(--color-subtle)',
          borderRadius: 'var(--radius-sm)',
          width: '35%',
          marginBottom: 6,
        }} />
        <div style={{
          height: 10,
          backgroundColor: 'var(--color-subtle)',
          borderRadius: 'var(--radius-sm)',
          width: '50%',
        }} />
      </div>
      
      {/* Data do último atendimento */}
      <div style={{
        width: 80,
        height: 12,
        backgroundColor: 'var(--color-subtle)',
        borderRadius: 'var(--radius-sm)',
        flexShrink: 0,
      }} />
    </div>
  );
}
