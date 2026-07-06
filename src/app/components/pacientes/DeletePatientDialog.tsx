import { useState } from 'react';

interface DeletePatientDialogProps {
  pacienteNome: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function DeletePatientDialog({ pacienteNome, onConfirm, loading, onCancel }: DeletePatientDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const confirmed = inputValue === 'EXCLUIR';

  async function handleConfirm() {
    if (!confirmed) return;
    await onConfirm();
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '2rem', borderRadius: '8px',
        maxWidth: '450px', width: '90%',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <h2 style={{ margin: '0 0 0.5rem', color: '#dc2626' }}>Excluir paciente</h2>
        <p>
          Tem certeza que deseja excluir <strong>{pacienteNome}</strong>?
          Esta ação removerá todos os dados clínicos e planos alimentares vinculados.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          Digite <strong>EXCLUIR</strong> para confirmar:
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="EXCLUIR"
          style={{
            width: '100%', padding: '0.5rem', borderRadius: '4px',
            border: '1px solid #ccc', marginBottom: '1rem',
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem', borderRadius: '4px',
              border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#fff',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmed || loading}
            style={{
              padding: '0.5rem 1rem', borderRadius: '4px',
              border: 'none', cursor: confirmed ? 'pointer' : 'not-allowed',
              backgroundColor: confirmed ? '#dc2626' : '#e5e7eb',
              color: confirmed ? '#fff' : '#9ca3af',
            }}
          >
            {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
}
