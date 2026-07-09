interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Excluir', cancelLabel = 'Cancelar', onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)',
    }} onClick={onCancel}>
      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        padding: 32, maxWidth: 400, width: '90%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: 'var(--color-ink-primary)' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px', background: 'var(--color-surface)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--color-ink-primary)',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px', background: 'var(--color-danger)',
              border: 'none', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#fff',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
