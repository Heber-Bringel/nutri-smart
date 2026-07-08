import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paciente } from '../../../model/entities/Paciente';
import { Container } from '../../../di/container';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function formatDate(isoString?: string) {
  if (!isoString) return '-';
  return new Date(isoString + 'T00:00:00').toLocaleDateString('pt-BR');
}

export function PatientListPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'ativo' | 'sem-plano'>('todos');
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pageSize = 50;

  useEffect(() => {
    let cancelled = false;

    async function fetchPacientes() {
      setLoading(true);
      try {
        const result = await Container.listPacientesUseCase.execute({ search: query, page, pageSize });
        if (!cancelled) {
          setPacientes(result.data);
          setTotal(result.total);
        }
      } catch {
        if (!cancelled) {
          setPacientes([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timeout = setTimeout(fetchPacientes, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, page, filtro]);

  const pacientesFiltrados = pacientes.filter(p => {
    if (filtro === 'todos') return true;
    if (filtro === 'ativo') return p.planoAtivo;
    return !p.planoAtivo;
  });

  const pacienteSelecionado = pacientes.find((p) => p.id === selecionado);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '10px 14px',
          background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-ink-tertiary)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar paciente por nome..."
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 14,
              color: 'var(--color-ink-primary)', background: 'transparent',
              fontFamily: 'var(--font-body)',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setPage(1); }}
              style={{
                background: 'none', border: 'none', color: 'var(--color-ink-tertiary)',
                cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard/pacientes/novo')}
            style={{
              background: 'var(--color-primary)', color: '#fff', border: 'none',
              padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              whiteSpace: 'nowrap', transition: 'background 150ms ease-out',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; }}
          >
            + Novo paciente
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
        {([['todos', 'Todos'], ['ativo', 'Com plano ativo'], ['sem-plano', 'Sem plano']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setFiltro(val); setPage(1); }}
            style={{
              padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', border: '1px solid',
              borderColor: filtro === val ? 'var(--color-primary)' : 'var(--color-border)',
              background: filtro === val ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
              color: filtro === val ? 'var(--color-primary-text)' : 'var(--color-ink-secondary)',
              transition: 'all 150ms ease-out',
            }}
          >{label}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-ink-tertiary)' }}>
          {total > 0 ? `${total} resultado${total !== 1 ? 's' : ''}` : ''}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          flex: 1, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', background: 'var(--color-surface)', minHeight: 400,
        }}>
          {loading && pacientes.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-ink-tertiary)', fontSize: 13 }}>
              Carregando...
            </div>
          ) : pacientesFiltrados.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-ink-tertiary)', fontSize: 13 }}>
              Nenhum paciente encontrado
            </div>
          ) : pacientesFiltrados.map((p, i) => (
            <div
              key={p.id}
              onClick={() => setSelecionado(p.id === selecionado ? null : p.id)}
              style={{
                padding: '10px 14px', cursor: 'pointer',
                borderBottom: i < pacientesFiltrados.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                display: 'flex', alignItems: 'center', gap: 10,
                background: selecionado === p.id ? 'var(--color-subtle)' : 'transparent',
                transition: 'background 150ms ease-out',
                borderLeft: selecionado === p.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (selecionado !== p.id) e.currentTarget.style.background = 'var(--color-bg)';
              }}
              onMouseLeave={(e) => {
                if (selecionado !== p.id) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--color-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600, color: 'var(--color-ink-secondary)', flexShrink: 0,
              }}>{getInitials(p.nomeCompleto)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 500, color: 'var(--color-ink-primary)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {p.nomeCompleto}
                  <span style={{
                    fontSize: 10, padding: '1px 5px', borderRadius: 2, fontWeight: 500,
                    background: p.planoAtivo ? 'var(--color-primary-subtle)' : 'var(--color-subtle)',
                    color: p.planoAtivo ? 'var(--color-primary-text)' : 'var(--color-ink-tertiary)',
                  }}>
                    {p.planoAtivo ? 'ativo' : 'sem plano'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-ink-tertiary)', marginTop: 1 }}>
                  {p.email}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexShrink: 0, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-ink-secondary)' }}>
                  atend. {formatDate(p.ultimoAtendimento)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {pacienteSelecionado ? (
          <div style={{
            width: 240, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface)', padding: '20px', flexShrink: 0,
            position: 'sticky', top: 60,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: 'var(--color-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600, color: 'var(--color-ink-secondary)',
              }}>{getInitials(pacienteSelecionado.nomeCompleto)}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--color-ink-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  width: 140,
                }}>
                  {pacienteSelecionado.nomeCompleto}
                </div>
                <span style={{
                  fontSize: 10, padding: '1px 5px', borderRadius: 2, fontWeight: 500,
                  background: pacienteSelecionado.planoAtivo ? 'var(--color-primary-subtle)' : 'var(--color-subtle)',
                  color: pacienteSelecionado.planoAtivo ? 'var(--color-primary-text)' : 'var(--color-ink-tertiary)',
                }}>
                  {pacienteSelecionado.planoAtivo ? 'Plano ativo' : 'Sem plano'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--color-ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telefone</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ink-primary)' }}>{pacienteSelecionado.telefone || '--'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--color-ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nasc.</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ink-primary)', fontFamily: 'var(--font-mono)' }}>{formatDate(pacienteSelecionado.dataNascimento)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--color-ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Últ. atend.</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ink-primary)', fontFamily: 'var(--font-mono)' }}>{formatDate(pacienteSelecionado.ultimoAtendimento)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                onClick={() => navigate(`/dashboard/pacientes/${pacienteSelecionado.id}`)}
                style={{
                  padding: '7px 0', fontSize: 12, fontWeight: 500, borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer',
                  transition: 'background 150ms ease-out',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; }}
              >
                Abrir ficha completa
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            width: 240, border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
            padding: '32px 20px', textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ fontSize: 12, color: 'var(--color-ink-tertiary)' }}>
              Selecione um paciente<br />para ver detalhes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
