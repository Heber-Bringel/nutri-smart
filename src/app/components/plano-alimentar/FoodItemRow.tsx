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
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
      <input
        type="text"
        placeholder="Nome do alimento"
        value={item.nome}
        onChange={e => onChange(index, { ...item, nome: e.target.value })}
        style={{ ...inputStyle, flex: 2, minWidth: 120 }}
        onFocus={e => e.target.style.borderColor = '#10B981'}
        onBlur={e => e.target.style.borderColor = '#E5E5E5'}
      />
      
      <input
        type="number"
        placeholder="Qtd"
        value={item.quantidade || ''}
        onChange={e => onChange(index, { ...item, quantidade: Number(e.target.value) })}
        style={{ ...monoInputStyle, width: 70 }}
        onFocus={e => e.target.style.borderColor = '#10B981'}
        onBlur={e => e.target.style.borderColor = '#E5E5E5'}
      />
      
      <select
        value={item.unidadeMedida}
        onChange={e => onChange(index, { ...item, unidadeMedida: e.target.value })}
        style={{ ...inputStyle, width: 80 }}
        onFocus={e => e.target.style.borderColor = '#10B981'}
        onBlur={e => e.target.style.borderColor = '#E5E5E5'}
      >
        <option value="g">g</option>
        <option value="ml">ml</option>
        <option value="unidade">un</option>
        <option value="colher">colher</option>
        <option value="xicara">xícara</option>
      </select>
      
      <div style={{ position: 'relative', width: 90 }}>
        <input
          type="number"
          placeholder="Kcal"
          value={item.calorias || ''}
          onChange={e => onChange(index, { ...item, calorias: Number(e.target.value) })}
          style={{ ...monoInputStyle, width: '100%', paddingRight: 32 }}
          onFocus={e => e.target.style.borderColor = '#10B981'}
          onBlur={e => e.target.style.borderColor = '#E5E5E5'}
        />
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#9CA3AF' }}>kcal</span>
      </div>
      
      <button
        type="button"
        onClick={() => onRemove(index)}
        title="Remover alimento"
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', backgroundColor: '#fff', color: '#9CA3AF', border: '1px solid #E5E5E5',
          borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.1s', whiteSpace: 'nowrap'
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FCA5A5'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = '#E5E5E5'; }}
      >
        ✕ Excluir
      </button>
    </div>
  );
}
