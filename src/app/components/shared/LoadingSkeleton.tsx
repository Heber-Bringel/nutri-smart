interface LoadingSkeletonProps {
  lines?: number;
}

export function LoadingSkeleton({ lines = 3 }: LoadingSkeletonProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 32 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          height: i === 0 ? 20 : 14,
          width: i === 0 ? '40%' : i === 1 ? '100%' : '75%',
          background: 'var(--color-border-light)',
          borderRadius: 6,
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
    </div>
  );
}
