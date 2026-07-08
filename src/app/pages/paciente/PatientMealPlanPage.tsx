import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../di/container';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import type { MealPlan } from '../../../model/entities/MealPlan';
import type { DailyProgress } from '../../../model/entities/Adesao';
import { AdherenceToggle } from '../../components/paciente/AdherenceToggle';
import { getTodayLocal } from '../../../shared/utils/date';
import { ProgressBar } from '../../components/paciente/ProgressBar';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

export function PatientMealPlanPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adesaoMap, setAdesaoMap] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!user?.pacienteId) return;
    let cancelled = false;

    Promise.all([
      Container.getMealPlanUseCase.execute(user.pacienteId!),
      Container.getDailyProgressUseCase.execute(user.pacienteId!, selectedDate),
      Container.getDailyAdesaoStatesUseCase.execute(user.pacienteId!, selectedDate),
    ])
      .then(([plan, prog, estados]) => {
        if (!cancelled) {
          setMealPlan(plan);
          setProgress(prog);
          const map = new Map<string, boolean>();
          for (const e of estados) {
            map.set(e.refeicaoId, e.concluida);
          }
          setAdesaoMap(map);
        }
      })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar plano.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user?.pacienteId, selectedDate]);

  async function handleToggle(refeicaoId: string, concluida: boolean) {
    if (!user?.pacienteId) return;

    try {
      await Container.markMealAsCompletedUseCase.execute(refeicaoId, user.pacienteId, concluida, selectedDate);

      setAdesaoMap(prev => new Map(prev).set(refeicaoId, concluida));

      const [prog, estados] = await Promise.all([
        Container.getDailyProgressUseCase.execute(user.pacienteId, selectedDate),
        Container.getDailyAdesaoStatesUseCase.execute(user.pacienteId, selectedDate),
      ]);
      setProgress(prog);
      const map = new Map<string, boolean>();
      for (const e of estados) {
        map.set(e.refeicaoId, e.concluida);
      }
      setAdesaoMap(map);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.');
    }
  }

  if (loading) {
    return <LoadingSkeleton lines={4} />;
  }

  const headerBtn = {
    padding: '8px 16px', cursor: 'pointer', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', background: 'var(--color-surface)',
    color: 'var(--color-ink-primary)', fontSize: 13, fontWeight: 500,
  };

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: 'var(--color-ink-primary)' }}>Meu Plano Alimentar</h1>
          <p style={{ color: 'var(--color-ink-secondary)', margin: '4px 0 0', fontSize: 13 }}>
            Bem-vindo(a), {user?.nomeCompleto}
          </p>
        </div>
        <button onClick={logout} style={headerBtn}>
          Sair
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px 14px', background: 'var(--color-danger-subtle)',
          border: '1px solid var(--color-danger-border)',
          color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <label style={{
          display: 'block', fontSize: 11, color: 'var(--color-ink-secondary)',
          textTransform: 'uppercase', marginBottom: 6, fontWeight: 500, letterSpacing: '0.05em',
        }}>
          Data
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)', fontSize: 13,
            fontFamily: 'var(--font-mono)', outline: 'none',
            color: 'var(--color-ink-primary)', background: 'var(--color-surface)',
            transition: 'border-color 150ms ease-out',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {progress && (
        <ProgressBar
          concluidas={progress.concluidas}
          total={progress.totalRefeicoes}
          percentual={progress.percentual}
        />
      )}

      {!mealPlan ? (
        <div style={{
          textAlign: 'center', padding: 48, color: 'var(--color-ink-tertiary)',
          border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
        }}>
          <p style={{ fontSize: 14 }}>Nenhum plano alimentar disponível.</p>
          <p style={{ fontSize: 13 }}>Seu nutricionista ainda não cadastrou um plano para você.</p>
        </div>
      ) : (
        <div>
          {mealPlan.refeicoes
            .sort((a, b) => a.ordem - b.ordem)
            .map(refeicao => (
              <div
                key={refeicao.id}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  marginBottom: 16,
                  background: 'var(--color-surface)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-ink-primary)' }}>
                      {refeicao.nome}
                    </h3>
                    {refeicao.horarioSugerido && (
                      <span style={{ fontSize: 12, color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {refeicao.horarioSugerido}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                      {refeicao.totalCalorias ?? 0} kcal
                    </span>
                    <AdherenceToggle
                      refeicaoId={refeicao.id}
                      concluida={adesaoMap.get(refeicao.id) ?? false}
                      onToggle={handleToggle}
                    />
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg)' }}>
                      <th style={thStyle}>Alimento</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Qtd</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Cal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refeicao.alimentos.map(ali => (
                      <tr key={ali.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                        <td style={tdStyle}>{ali.nome}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{ali.quantidade}{ali.unidadeMedida}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{ali.calorias}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '8px 12px', fontWeight: 500,
  fontSize: 11, color: 'var(--color-ink-secondary)', textTransform: 'uppercase',
  letterSpacing: '0.05em', borderBottom: '2px solid var(--color-border)',
};
const tdStyle: React.CSSProperties = {
  padding: '8px 12px', color: 'var(--color-ink-primary)', fontSize: 13,
};
