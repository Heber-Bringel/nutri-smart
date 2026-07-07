import { useState } from 'react';
import { FoodItemRow } from './FoodItemRow';

interface AlimentoForm {
  nome: string;
  quantidade: number;
  unidadeMedida: string;
  calorias: number;
}

interface RefeicaoForm {
  nome: string;
  ordem: number;
  horarioSugerido: string;
  alimentos: AlimentoForm[];
}

interface MealPlanFormProps {
  observacoes: string;
  refeicoes: RefeicaoForm[];
  onObservacoesChange: (v: string) => void;
  onRefeicoesChange: (refeicoes: RefeicaoForm[]) => void;
  onSave: () => void;
  saving: boolean;
  erro?: string | null;
}

const defaultRefeicoes = [
  { nome: 'Café da Manhã', ordem: 1, horarioSugerido: '07:00', alimentos: [] },
  { nome: 'Almoço', ordem: 2, horarioSugerido: '12:00', alimentos: [] },
  { nome: 'Lanche da Tarde', ordem: 3, horarioSugerido: '15:00', alimentos: [] },
  { nome: 'Jantar', ordem: 4, horarioSugerido: '19:00', alimentos: [] },
];

export function MealPlanForm({ observacoes, refeicoes, onObservacoesChange, onRefeicoesChange, onSave, saving, erro }: MealPlanFormProps) {
  const [expandedRefeicao, setExpandedRefeicao] = useState<number | null>(0);
  
  const currentRefeicoes = refeicoes.length === 0 ? defaultRefeicoes : refeicoes;

  function addRefeicao() {
    const nova: RefeicaoForm = {
      nome: '',
      ordem: currentRefeicoes.length + 1,
      horarioSugerido: '',
      alimentos: [],
    };
    onRefeicoesChange([...currentRefeicoes, nova]);
    setExpandedRefeicao(currentRefeicoes.length);
  }

  function removeRefeicao(index: number) {
    onRefeicoesChange(currentRefeicoes.filter((_, i) => i !== index).map((r, i) => ({ ...r, ordem: i + 1 })));
  }

  function updateRefeicao(index: number, ref: RefeicaoForm) {
    const updated = [...currentRefeicoes];
    updated[index] = ref;
    onRefeicoesChange(updated);
  }

  function addAlimento(refIndex: number) {
    const ref = { ...currentRefeicoes[refIndex] };
    ref.alimentos = [...ref.alimentos, { nome: '', quantidade: 0, unidadeMedida: 'g', calorias: 0 }];
    updateRefeicao(refIndex, ref);
  }

  function updateAlimento(refIndex: number, alimIndex: number, alimento: AlimentoForm) {
    const ref = { ...currentRefeicoes[refIndex] };
    ref.alimentos = [...ref.alimentos];
    ref.alimentos[alimIndex] = alimento;
    updateRefeicao(refIndex, ref);
  }

  function removeAlimento(refIndex: number, alimIndex: number) {
    const ref = { ...currentRefeicoes[refIndex] };
    ref.alimentos = ref.alimentos.filter((_, i) => i !== alimIndex);
    updateRefeicao(refIndex, ref);
  }

  function calcularTotalCalorias(refIndex: number): number {
    return currentRefeicoes[refIndex].alimentos.reduce((sum, a) => sum + (a.calorias || 0), 0);
  }

  return (
    <div>
      {erro && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 6, fontSize: 13, marginBottom: 24 }}>
          {erro}
        </div>
      )}

      {/* Accordions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {currentRefeicoes.map((ref, i) => (
          <div key={i} style={{ border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
            <div
              onClick={() => setExpandedRefeicao(expandedRefeicao === i ? null : i)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', cursor: 'pointer',
                borderBottom: expandedRefeicao === i ? '1px solid #E5E5E5' : 'none',
                background: expandedRefeicao === i ? '#FAFAFA' : '#fff',
                transition: 'background-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                  {ref.nome || `Refeição ${i + 1}`}
                </span>
                <span style={{ fontSize: 12, color: '#10B981', fontFamily: 'JetBrains Mono, monospace', background: '#ECFDF5', padding: '2px 8px', borderRadius: 12, fontWeight: 500 }}>
                  {calcularTotalCalorias(i)} kcal
                </span>
                {ref.horarioSugerido && (
                  <span style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                    🕒 {ref.horarioSugerido}
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); removeRefeicao(i); }}
                  style={{
                    padding: '4px 8px', backgroundColor: 'transparent', color: '#9CA3AF',
                    border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
                >
                  Excluir
                </button>
                <span style={{ color: '#9CA3AF', fontSize: 12 }}>{expandedRefeicao === i ? '▲' : '▼'}</span>
              </div>
            </div>

            {expandedRefeicao === i && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', marginBottom: 6 }}>Nome da Refeição</label>
                    <input
                      type="text"
                      value={ref.nome}
                      onChange={e => updateRefeicao(i, { ...ref, nome: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 4, border: '1px solid #E5E5E5', fontSize: 13, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#10B981'}
                      onBlur={e => e.target.style.borderColor = '#E5E5E5'}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', marginBottom: 6 }}>Horário Sugerido</label>
                    <input
                      type="time"
                      value={ref.horarioSugerido}
                      onChange={e => updateRefeicao(i, { ...ref, horarioSugerido: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 4, border: '1px solid #E5E5E5', fontSize: 13, outline: 'none', fontFamily: 'JetBrains Mono, monospace' }}
                      onFocus={e => e.target.style.borderColor = '#10B981'}
                      onBlur={e => e.target.style.borderColor = '#E5E5E5'}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #F5F5F5' }}>
                    <span style={{ flex: 2, minWidth: 120 }}>Alimento</span>
                    <span style={{ width: 70 }}>Qtd</span>
                    <span style={{ width: 80 }}>Unidade</span>
                    <span style={{ width: 90 }}>Calorias</span>
                    <span style={{ width: 28 }}></span>
                  </div>
                  
                  {ref.alimentos.map((ali, j) => (
                    <FoodItemRow
                      key={j}
                      item={ali}
                      index={j}
                      onChange={(_, item) => updateAlimento(i, j, item)}
                      onRemove={() => removeAlimento(i, j)}
                    />
                  ))}
                  
                  {ref.alimentos.length === 0 && (
                    <div style={{ padding: '24px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                      Nenhum alimento cadastrado nesta refeição.
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => addAlimento(i)}
                    style={{
                      padding: '6px 12px', backgroundColor: '#fff', color: '#111827',
                      border: '1px solid #E5E5E5', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    + Novo Alimento
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addRefeicao}
        style={{
          padding: '8px 16px', backgroundColor: '#fff', color: '#111827',
          border: '1px dashed #D1D5DB', borderRadius: 6, cursor: 'pointer',
          marginBottom: 32, fontSize: 13, fontWeight: 500, width: '100%',
          textAlign: 'center'
        }}
      >
        + Adicionar Refeição
      </button>

      <div style={{ marginBottom: 32 }}>
        <label style={{ display: 'block', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>
          Observações Gerais
        </label>
        <textarea
          value={observacoes}
          onChange={e => onObservacoesChange(e.target.value)}
          style={{ 
            width: '100%', padding: '12px', borderRadius: 6, border: '1px solid #E5E5E5', 
            minHeight: '100px', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical'
          }}
          placeholder="Ex: Beber 2L de água por dia, evitar frituras..."
          onFocus={e => e.target.style.borderColor = '#10B981'}
          onBlur={e => e.target.style.borderColor = '#E5E5E5'}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E5E5', paddingTop: 24 }}>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '10px 24px',
            backgroundColor: saving ? '#6EE7B7' : '#10B981',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontWeight: 500,
            transition: 'background-color 0.15s'
          }}
        >
          {saving ? 'Salvando plano...' : 'Salvar plano alimentar'}
        </button>
      </div>
    </div>
  );
}
