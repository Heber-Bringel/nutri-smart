import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../di/container';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import { MealPlan, Refeicao } from '../../../model/entities/MealPlan';
import { DailyProgress } from '../../../model/entities/Adesao';
import { AdherenceToggle } from '../../components/paciente/AdherenceToggle';
import { ProgressBar } from '../../components/paciente/ProgressBar';

export function PatientMealPlanPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adesaoMap, setAdesaoMap] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!user?.pacienteId) return;
    let cancelled = false;

    Promise.all([
      Container.getMealPlanUseCase.execute(user.pacienteId!),
      Container.getDailyProgressUseCase.execute(user.pacienteId!),
    ])
      .then(([plan, prog]) => {
        if (!cancelled) {
          setMealPlan(plan);
          setProgress(prog);
        }
      })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar plano.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user?.pacienteId]);

  async function handleToggle(refeicaoId: string, concluida: boolean) {
    if (!user?.pacienteId) return;

    await Container.markMealAsCompletedUseCase.execute(refeicaoId, user.pacienteId, concluida);

    const prog = await Container.getDailyProgressUseCase.execute(user.pacienteId);
    setProgress(prog);
  }

  if (loading) {
    return <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>Carregando...</div>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Meu Plano Alimentar</h1>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>
            Bem-vindo(a), {user?.nomeCompleto}
          </p>
        </div>
        <button onClick={logout} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
          Sair
        </button>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {progress && (
        <ProgressBar
          concluidas={progress.concluidas}
          total={progress.totalRefeicoes}
          percentual={progress.percentual}
        />
      )}

      {!mealPlan ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.1rem' }}>Nenhum plano alimentar disponível.</p>
          <p style={{ fontSize: '0.9rem' }}>Seu nutricionista ainda não cadastrou um plano para você.</p>
        </div>
      ) : (
        <div>
          {mealPlan.refeicoes
            .sort((a, b) => a.ordem - b.ordem)
            .map(refeicao => (
              <div
                key={refeicao.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{refeicao.nome}</h3>
                    {refeicao.horarioSugerido && (
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{refeicao.horarioSugerido}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 600, color: '#2563eb' }}>{refeicao.totalCalorias ?? 0} kcal</span>
                    <AdherenceToggle
                      refeicaoId={refeicao.id}
                      concluida={adesaoMap.get(refeicao.id) ?? false}
                      onToggle={handleToggle}
                    />
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th style={thStyle}>Alimento</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Qtd</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Cal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refeicao.alimentos.map(ali => (
                      <tr key={ali.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={tdStyle}>{ali.nome}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>{ali.quantidade}{ali.unidadeMedida}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>{ali.calorias}</td>
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

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.5rem', fontWeight: 600, borderBottom: '2px solid #e5e7eb' };
const tdStyle: React.CSSProperties = { padding: '0.5rem' };
