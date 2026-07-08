import { useState } from 'react';
import { FoodItemRow } from './FoodItemRow';
import { FoodBaseSelector } from './FoodBaseSelector';
import type { AlimentoBase } from '../../../model/entities/AlimentoBase';

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
  const [addingFoodRef, setAddingFoodRef] = useState<number | null>(null);

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

  function handleSelectFood(refIndex: number, food: AlimentoBase) {
    const ref = { ...currentRefeicoes[refIndex] };
    ref.alimentos = [...ref.alimentos, {
      nome: food.nome,
      quantidade: food.porcao,
      unidadeMedida: food.unidadeMedida || 'g',
      calorias: food.calorias,
    }];
    updateRefeicao(refIndex, ref);
    setAddingFoodRef(null);
  }

  function handleCancelFoodSearch() {
    setAddingFoodRef(null);
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

  function removerEmoji(text: string) {
    return text.replace(/🕒/g, '').trim();
  }

  return (
    <div>
      {erro && (
        <div style={{
          padding: '10px 14px', background: 'var(--color-danger-subtle)',
          border: '1px solid var(--color-danger-border)',
          color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 24,
        }}>
          {erro}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {currentRefeicoes.map((ref, i) => (
          <div key={i} style={{
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
            overflow: 'hidden', background: 'var(--color-surface)',
          }}>
            <div
              onClick={() => setExpandedRefeicao(expandedRefeicao === i ? null : i)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', cursor: 'pointer',
                borderBottom: expandedRefeicao === i ? '1px solid var(--color-border)' : 'none',
                background: expandedRefeicao === i ? 'var(--color-bg)' : 'var(--color-surface)',
                transition: 'background 150ms ease-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink-primary)' }}>
                  {ref.nome || `Refeição ${i + 1}`}
                </span>
                <span style={{
                  fontSize: 11, color: 'var(--color-primary-text)', fontFamily: 'var(--font-mono)',
                  background: 'var(--color-primary-subtle)', padding: '2px 8px', borderRadius: 12, fontWeight: 500,
                }}>
                  {calcularTotalCalorias(i)} kcal
                </span>
                {ref.horarioSugerido && (
                  <span style={{ fontSize: 12, color: 'var(--color-ink-secondary)' }}>
                    {removerEmoji(`🕒 ${ref.horarioSugerido}`)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); removeRefeicao(i); }}
                  style={{
                    padding: '4px 8px', background: 'transparent', color: 'var(--color-ink-tertiary)',
                    border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ink-tertiary)'}
                >
                  Excluir
                </button>
                <span style={{ color: 'var(--color-ink-tertiary)', fontSize: 12, transform: expandedRefeicao === i ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease-out' }}>
                  ▼
                </span>
              </div>
            </div>

            {expandedRefeicao === i && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{
                      display: 'block', fontSize: 11, color: 'var(--color-ink-secondary)',
                      textTransform: 'uppercase', marginBottom: 6, fontWeight: 500, letterSpacing: '0.05em',
                    }}>
                      Nome da Refeição
                    </label>
                    <input
                      type="text"
                      value={ref.nome}
                      onChange={e => updateRefeicao(i, { ...ref, nome: e.target.value })}
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)', fontSize: 13, outline: 'none',
                        fontFamily: 'var(--font-body)', color: 'var(--color-ink-primary)',
                        background: 'var(--color-surface)',
                        transition: 'border-color 150ms ease-out',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block', fontSize: 11, color: 'var(--color-ink-secondary)',
                      textTransform: 'uppercase', marginBottom: 6, fontWeight: 500, letterSpacing: '0.05em',
                    }}>
                      Horário Sugerido
                    </label>
                    <input
                      type="time"
                      value={ref.horarioSugerido}
                      onChange={e => updateRefeicao(i, { ...ref, horarioSugerido: e.target.value })}
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)', fontSize: 13, outline: 'none',
                        fontFamily: 'var(--font-mono)', color: 'var(--color-ink-primary)',
                        background: 'var(--color-surface)',
                        transition: 'border-color 150ms ease-out',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                </div>

                <div>
                  <div style={{
                    display: 'flex', gap: 10, fontSize: 11, fontWeight: 500,
                    color: 'var(--color-ink-tertiary)', textTransform: 'uppercase',
                    padding: '0 14px 8px', marginBottom: 8,
                    borderBottom: '1px solid var(--color-border-light)',
                  }}>
                    <span style={{ flex: 2 }}>Alimento</span>
                    <span style={{ width: 65, textAlign: 'center' }}>Qtd</span>
                    <span style={{ width: 80, textAlign: 'center' }}>Unidade</span>
                    <span style={{ width: 100, textAlign: 'center' }}>Calorias</span>
                    <span style={{ width: 1, margin: '0 0 0 11px' }} />
                    <span style={{ width: 82, textAlign: 'center' }}>Ação</span>
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
                    <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-ink-tertiary)', fontSize: 13 }}>
                      Nenhum alimento cadastrado nesta refeição.
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 16 }}>
                  {addingFoodRef === i ? (
                    <FoodBaseSelector
                      onSelect={(food) => handleSelectFood(i, food)}
                      onCancel={handleCancelFoodSearch}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingFoodRef(i)}
                      style={{
                        padding: '6px 12px', background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
                        border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer', fontSize: 12, fontWeight: 500,
                        display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'border-color 150ms ease-out',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                    >
                      + Novo Alimento
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addRefeicao}
        style={{
          padding: '8px 16px', background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
          border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
          cursor: 'pointer', marginBottom: 32, fontSize: 13, fontWeight: 500, width: '100%',
          textAlign: 'center',
          transition: 'border-color 150ms ease-out',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-ink-primary)'; }}
      >
        + Adicionar Refeição
      </button>

      <div style={{ marginBottom: 32 }}>
        <label style={{
          display: 'block', fontSize: 11, color: 'var(--color-ink-secondary)',
          textTransform: 'uppercase', marginBottom: 8, fontWeight: 500, letterSpacing: '0.05em',
        }}>
          Observações Gerais
        </label>
        <textarea
          value={observacoes}
          onChange={e => onObservacoesChange(e.target.value)}
          placeholder="Ex: Beber 2L de água por dia, evitar frituras..."
          style={{
            width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)', minHeight: 100, fontSize: 14,
            fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical',
            color: 'var(--color-ink-primary)', background: 'var(--color-surface)',
            transition: 'border-color 150ms ease-out',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: 24 }}>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '10px 24px',
            background: saving ? 'var(--color-ink-tertiary)' : 'var(--color-primary)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 500,
            letterSpacing: '0.05em', textTransform: 'uppercase',
            transition: 'background 150ms ease-out',
          }}
          onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
          onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = 'var(--color-primary)'; }}
        >
          {saving ? 'Salvando plano...' : 'Salvar plano alimentar'}
        </button>
      </div>
    </div>
  );
}
