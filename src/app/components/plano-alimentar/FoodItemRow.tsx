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
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
      padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-md)',
    }}>
      <input
        type="text"
        placeholder="Nome do alimento"
        value={item.nome}
        onChange={e => onChange(index, { ...item, nome: e.target.value })}
        style={{
          flex: 2, minWidth: 0, width: 0,
          padding: '6px 10px', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)', fontSize: 13,
          fontFamily: 'var(--font-body)', outline: 'none',
          background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
          transition: 'border-color 150ms ease-out',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
      />

      <input
        type="number"
        placeholder="Qtd"
        value={item.quantidade || ''}
        onChange={e => onChange(index, { ...item, quantidade: Number(e.target.value) })}
        style={{
          width: 65, flexShrink: 0,
          padding: '6px 10px', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)', fontSize: 13,
          fontFamily: 'var(--font-mono)', outline: 'none',
          background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
          transition: 'border-color 150ms ease-out',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
      />

      <select
        value={item.unidadeMedida}
        onChange={e => onChange(index, { ...item, unidadeMedida: e.target.value })}
        style={{
          width: 80, flexShrink: 0,
          padding: '6px 10px', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)', fontSize: 13,
          fontFamily: 'var(--font-body)', outline: 'none',
          background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
          transition: 'border-color 150ms ease-out',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
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
          style={{
            width: '100%', paddingRight: 32,
            padding: '6px 10px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)', fontSize: 13,
            fontFamily: 'var(--font-mono)', outline: 'none',
            background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
            transition: 'border-color 150ms ease-out',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        />
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--color-ink-tertiary)' }}>kcal</span>
      </div>

      <div style={{ width: 1, height: 28, background: 'var(--color-border)', flexShrink: 0 }} />

      <button
        type="button"
        onClick={() => onRemove(index)}
        title="Remover alimento"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          padding: '6px 12px', background: 'var(--color-danger-subtle)', color: 'var(--color-danger)',
          border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-sm)',
          cursor: 'pointer', fontSize: 12, fontWeight: 600,
          transition: 'all 150ms ease-out', whiteSpace: 'nowrap', flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--color-danger)';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = 'var(--color-danger)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--color-danger-subtle)';
          e.currentTarget.style.color = 'var(--color-danger)';
          e.currentTarget.style.borderColor = 'var(--color-danger-border)';
        }}
      >
        <span style={{ fontSize: 14, lineHeight: 1 }}>✕</span>
        Excluir
      </button>
    </div>
  );
}
