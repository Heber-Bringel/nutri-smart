import { useState } from 'react';

interface FoodItem {
  nome: string;
  quantidade: number;
  unidadeMedida: string;
  calorias: number;
}

interface FoodItemRowProps {
  item: FoodItem;
  index: number;
  onChange: (index: number, item: FoodItem) => void;
  onRemove: (index: number) => void;
}

export function FoodItemRow({ item, index, onChange, onRemove }: FoodItemRowProps) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
      <input
        type="text"
        placeholder="Alimento"
        value={item.nome}
        onChange={e => onChange(index, { ...item, nome: e.target.value })}
        style={{ flex: 2, padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <input
        type="number"
        placeholder="Qtd"
        value={item.quantidade || ''}
        onChange={e => onChange(index, { ...item, quantidade: Number(e.target.value) })}
        style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', maxWidth: '80px' }}
      />
      <select
        value={item.unidadeMedida}
        onChange={e => onChange(index, { ...item, unidadeMedida: e.target.value })}
        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', maxWidth: '70px' }}
      >
        <option value="g">g</option>
        <option value="ml">ml</option>
        <option value="unidade">un</option>
      </select>
      <input
        type="number"
        placeholder="Cal"
        value={item.calorias || ''}
        onChange={e => onChange(index, { ...item, calorias: Number(e.target.value) })}
        style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', maxWidth: '90px' }}
      />
      <button
        onClick={() => onRemove(index)}
        style={{
          padding: '0.3rem 0.6rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        X
      </button>
    </div>
  );
}
