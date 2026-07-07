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

const inputStyle = {
  padding: '6px 10px', borderRadius: '4px', border: '1px solid #E5E5E5',
  fontSize: 13, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s',
  background: '#fff', color: '#111827'
};

const monoInputStyle = { ...inputStyle, fontFamily: 'JetBrains Mono, monospace' };

export function FoodItemRow({ item, index, onChange, onRemove }: FoodItemRowProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
      padding: '10px 14px', background: '#FAFAFA', border: '1px solid #F0F0F0',
      borderRadius: 6, transition: 'border-color 0.15s',
    }}>
      <input
        type="text"
        placeholder="Nome do alimento"
        value={item.nome}
        onChange={e => onChange(index, { ...item, nome: e.target.value })}
        style={{ ...inputStyle, flex: 2, minWidth: 0, width: 0 }}
        onFocus={e => e.currentTarget.style.borderColor = '#10B981'}
        onBlur={e => e.currentTarget.style.borderColor = '#E5E5E5'}
      />

      <input
        type="number"
        placeholder="Qtd"
        value={item.quantidade || ''}
        onChange={e => onChange(index, { ...item, quantidade: Number(e.target.value) })}
        style={{ ...monoInputStyle, width: 65, flexShrink: 0 }}
        onFocus={e => e.currentTarget.style.borderColor = '#10B981'}
        onBlur={e => e.currentTarget.style.borderColor = '#E5E5E5'}
      />

      <select
        value={item.unidadeMedida}
        onChange={e => onChange(index, { ...item, unidadeMedida: e.target.value })}
        style={{ ...inputStyle, width: 80, flexShrink: 0 }}
        onFocus={e => e.currentTarget.style.borderColor = '#10B981'}
        onBlur={e => e.currentTarget.style.borderColor = '#E5E5E5'}
      >
        <option value="g">g</option>
        <option value="ml">ml</option>
        <option value="unidade">un</option>
        <option value="colher">colher</option>
        <option value="xicara">xícara</option>
      </select>

      <div style={{ position: 'relative', width: 100, flexShrink: 0 }}>
        <input
          type="number"
          placeholder="Kcal"
          value={item.calorias || ''}
          onChange={e => onChange(index, { ...item, calorias: Number(e.target.value) })}
          style={{ ...monoInputStyle, width: '100%', paddingRight: 32 }}
          onFocus={e => e.currentTarget.style.borderColor = '#10B981'}
          onBlur={e => e.currentTarget.style.borderColor = '#E5E5E5'}
        />
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#9CA3AF' }}>kcal</span>
      </div>

      <div style={{ width: 1, height: 28, background: '#E5E5E5', flexShrink: 0 }} />

      <button
        type="button"
        onClick={() => onRemove(index)}
        title="Remover alimento"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          padding: '6px 12px', background: '#FEF2F2', color: '#DC2626',
          border: '1px solid #FECACA', borderRadius: 5,
          cursor: 'pointer', fontSize: 12, fontWeight: 600,
          transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#DC2626';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = '#DC2626';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#FEF2F2';
          e.currentTarget.style.color = '#DC2626';
          e.currentTarget.style.borderColor = '#FECACA';
        }}
      >
        <span style={{ fontSize: 14, lineHeight: 1 }}>✕</span>
        Excluir
      </button>
    </div>
  );
}
