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

  function addRefeicao() {
    const nova: RefeicaoForm = {
      nome: '',
      ordem: refeicoes.length + 1,
      horarioSugerido: '',
      alimentos: [],
    };
    onRefeicoesChange([...refeicoes, nova]);
  }

  function removeRefeicao(index: number) {
    onRefeicoesChange(refeicoes.filter((_, i) => i !== index).map((r, i) => ({ ...r, ordem: i + 1 })));
  }

  function updateRefeicao(index: number, ref: RefeicaoForm) {
    const updated = [...refeicoes];
    updated[index] = ref;
    onRefeicoesChange(updated);
  }

  function addAlimento(refIndex: number) {
    const ref = { ...refeicoes[refIndex] };
    ref.alimentos = [...ref.alimentos, { nome: '', quantidade: 0, unidadeMedida: 'g', calorias: 0 }];
    updateRefeicao(refIndex, ref);
  }

  function updateAlimento(refIndex: number, alimIndex: number, alimento: AlimentoForm) {
    const ref = { ...refeicoes[refIndex] };
    ref.alimentos = [...ref.alimentos];
    ref.alimentos[alimIndex] = alimento;
    updateRefeicao(refIndex, ref);
  }

  function removeAlimento(refIndex: number, alimIndex: number) {
    const ref = { ...refeicoes[refIndex] };
    ref.alimentos = ref.alimentos.filter((_, i) => i !== alimIndex);
    updateRefeicao(refIndex, ref);
  }

  function calcularTotalCalorias(refIndex: number): number {
    return refeicoes[refIndex].alimentos.reduce((sum, a) => sum + (a.calorias || 0), 0);
  }

  return (
    <div>
      {erro && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem' }}>
          {erro}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Observações</label>
        <textarea
          value={observacoes}
          onChange={e => onObservacoesChange(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
          placeholder="Observações gerais sobre o plano alimentar..."
        />
      </div>

      {(refeicoes.length === 0 ? defaultRefeicoes : refeicoes).map((ref, i) => (
        <div key={i} style={{ marginBottom: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
          <div
            onClick={() => setExpandedRefeicao(expandedRefeicao === i ? null : i)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              borderBottom: expandedRefeicao === i ? '1px solid #e5e7eb' : 'none',
            }}
          >
            <span style={{ fontWeight: 600 }}>
              {ref.nome || `Refeição ${i + 1}`}
              <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: '#6b7280' }}>
                ~ {calcularTotalCalorias(i)} kcal
              </span>
            </span>
            <div>
              <button
                onClick={(e) => { e.stopPropagation(); removeRefeicao(i); }}
                style={{ padding: '0.2rem 0.5rem', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Remover
              </button>
              <span style={{ marginLeft: '0.5rem', color: '#9ca3af' }}>{expandedRefeicao === i ? '▲' : '▼'}</span>
            </div>
          </div>

          {expandedRefeicao === i && (
            <div style={{ padding: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Nome da refeição"
                  value={ref.nome}
                  onChange={e => updateRefeicao(i, { ...ref, nome: e.target.value })}
                  style={{ flex: 2, padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                  type="time"
                  value={ref.horarioSugerido}
                  onChange={e => updateRefeicao(i, { ...ref, horarioSugerido: e.target.value })}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280', padding: '0.25rem 0' }}>
                  <span style={{ flex: 2 }}>Alimento</span>
                  <span style={{ flex: 1, maxWidth: '80px' }}>Qtd</span>
                  <span style={{ flex: 1, maxWidth: '70px' }}>Un</span>
                  <span style={{ flex: 1, maxWidth: '90px' }}>Cal</span>
                  <span style={{ width: '40px' }}></span>
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
              </div>

              <button
                onClick={() => addAlimento(i)}
                style={{
                  padding: '0.3rem 0.8rem',
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  border: '1px solid #bae6fd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                + Adicionar Alimento
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addRefeicao}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#f0fdf4',
          color: '#16a34a',
          border: '1px solid #bbf7d0',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        + Adicionar Refeição
      </button>

      <div>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: saving ? '#9ca3af' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          {saving ? 'Salvando...' : 'Salvar Plano Alimentar'}
        </button>
      </div>
    </div>
  );
}
