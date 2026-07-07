import { useState, useEffect } from 'react';

interface DeletePatientDialogProps {
  pacienteNome: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function DeletePatientDialog({ pacienteNome, onConfirm, loading, onCancel }: DeletePatientDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const confirmed = inputValue === 'EXCLUIR';

  useEffect(() => {
    // Esc para fechar
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [loading, onCancel]);

  async function handleConfirm() {
    if (!confirmed) return;
    await onConfirm();
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '32px', borderRadius: '8px',
        border: '1px solid #E5E5E5', maxWidth: '440px', width: '90%',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#111827' }}>Excluir paciente</h2>
        
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#4B5563', lineHeight: 1.5 }}>
          Esta ação apagará permanentemente os dados de <span style={{ fontWeight: 600, color: '#111827' }}>{pacienteNome}</span>, 
          incluindo planos alimentares, avaliações corporais e histórico.
        </p>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 500, color: '#6B7280' }}>
            Digite <span style={{ color: '#DC2626' }}>EXCLUIR</span> para confirmar
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder=""
            autoFocus
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '6px',
              border: '1px solid #E5E5E5', fontSize: 14, fontFamily: 'inherit',
              outline: 'none', transition: 'border-color 0.15s',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#9CA3AF'}
            onBlur={e => e.target.style.borderColor = '#E5E5E5'}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '8px 16px', borderRadius: '6px', fontSize: 13, fontWeight: 500,
              border: '1px solid #E5E5E5', cursor: 'pointer', backgroundColor: '#fff', color: '#374151'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmed || loading}
            style={{
              padding: '8px 16px', borderRadius: '6px', fontSize: 13, fontWeight: 500,
              border: 'none', cursor: confirmed ? 'pointer' : 'not-allowed',
              backgroundColor: confirmed ? '#DC2626' : '#F3F4F6',
              color: confirmed ? '#fff' : '#9CA3AF', transition: 'background-color 0.15s'
            }}
          >
            {loading ? 'Excluindo...' : 'Confirmar exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
}
