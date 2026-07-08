import { useState, useRef, useEffect } from 'react';
import type { AlimentoBase } from '../../../model/entities/AlimentoBase';
import { Container } from '../../../di/container';

interface FoodBaseSelectorProps {
  onSelect: (food: AlimentoBase) => void;
  onCancel: () => void;
}

export function FoodBaseSelector({ onSelect, onCancel }: FoodBaseSelectorProps) {
  const [termo, setTermo] = useState('');
  const [results, setResults] = useState<AlimentoBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [custom, setCustom] = useState({ nome: '', porcao: 100, calorias: 0, carboidratos: 0, proteinas: 0, gorduras: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (termo.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await Container.searchFoodBaseUseCase.execute(termo);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [termo]);

  async function handleCreateCustom() {
    try {
      const food = await Container.createCustomFoodUseCase.execute(custom);
      onSelect(food);
    } catch {
    }
  }

  const inputSm = {
    padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)',
    fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none',
    background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
    transition: 'border-color 150ms ease-out',
  };

  if (showCustomForm) {
    return (
      <div style={{
        padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
        background: 'var(--color-bg)', marginBottom: 8,
      }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Nome do alimento"
            value={custom.nome}
            onChange={e => setCustom({ ...custom, nome: e.target.value })}
            style={{ ...inputSm, flex: '1 1 100%' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
          <input
            type="number"
            placeholder="Porção (g)"
            value={custom.porcao || ''}
            onChange={e => setCustom({ ...custom, porcao: Number(e.target.value) })}
            style={{ ...inputSm, flex: 1, maxWidth: 100, fontFamily: 'var(--font-mono)' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
          <input
            type="number"
            placeholder="Calorias"
            value={custom.calorias || ''}
            onChange={e => setCustom({ ...custom, calorias: Number(e.target.value) })}
            style={{ ...inputSm, flex: 1, maxWidth: 100, fontFamily: 'var(--font-mono)' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleCreateCustom}
            disabled={!custom.nome}
            style={{
              padding: '6px 12px', background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontSize: 12, fontWeight: 500,
            }}
          >
            Criar e Adicionar
          </button>
          <button onClick={() => setShowCustomForm(false)} style={{
            padding: '6px 12px', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 12,
            background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
          }}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar alimento na base..."
          value={termo}
          onChange={e => setTermo(e.target.value)}
          style={{
            flex: 1, padding: '6px 10px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)', fontSize: 13,
            fontFamily: 'var(--font-body)', outline: 'none',
            color: 'var(--color-ink-primary)', background: 'var(--color-surface)',
            transition: 'border-color 150ms ease-out',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        />
        <button onClick={onCancel} style={{
          padding: '6px 12px', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 12,
          background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
        }}>
          Cancelar
        </button>
      </div>

      {loading && <div style={{ padding: '8px', color: 'var(--color-ink-secondary)', fontSize: 13 }}>Buscando...</div>}

      {!loading && termo.length >= 2 && results.length === 0 && (
        <div style={{ padding: '8px', color: 'var(--color-ink-secondary)', fontSize: 13 }}>
          Nenhum alimento encontrado.{' '}
          <button
            onClick={() => setShowCustomForm(true)}
            style={{
              background: 'none', border: 'none', color: 'var(--color-primary)',
              cursor: 'pointer', textDecoration: 'underline', fontSize: 13,
            }}
          >
            Criar novo alimento
          </button>
        </div>
      )}

      {results.length > 0 && (
        <div style={{
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
          marginTop: 4, maxHeight: 200, overflowY: 'auto',
        }}>
          {results.map(food => (
            <div
              key={food.id}
              onClick={() => onSelect(food)}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--color-border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                transition: 'background 150ms ease-out',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <span style={{ fontSize: 13, color: 'var(--color-ink-primary)' }}>{food.nome}</span>
              <span style={{ color: 'var(--color-ink-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                {food.calorias} kcal / {food.porcao}{food.unidadeMedida}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
