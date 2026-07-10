import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Paciente } from '../../../model/entities/Paciente';
import { Container } from '../../../di/container';
import { PatientSkeleton } from '../../components/pacientes/PatientSkeleton';
import { PageTransition } from '../../components/shared/PageTransition';

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
    <PageTransition>
      <div className="max-w-[860px] mx-auto py-12 px-10">
        
        {/* Barra de Busca e Novo Paciente */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 border border-[var(--color-border)] rounded-[var(--radius-lg)] py-2.5 px-3.5 bg-[var(--color-surface)] shadow-[var(--shadow-card)] focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-150">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ink-tertiary)] flex-shrink-0">
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
              className="flex-1 border-none outline-none text-sm text-[var(--color-ink-primary)] bg-transparent font-sans"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setPage(1); }}
                className="bg-none border-none text-[var(--color-ink-tertiary)] cursor-pointer text-sm p-0 leading-none hover:text-[var(--color-ink-primary)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard/pacientes/novo')}
              className="background bg-[var(--color-primary)] text-white border-none py-1.5 px-3.5 rounded-[var(--radius-md)] text-xs font-medium cursor-pointer whitespace-nowrap hover:bg-[var(--color-primary-hover)] transition-all duration-150 shadow-sm focus:ring-2 focus:ring-emerald-500/20"
            >
              + Novo paciente
            </button>
          </div>
        </div>

        {/* Filtros e Contagem */}
        <div className="flex gap-1.5 mb-4 items-center">
          {([['todos', 'Todos'], ['ativo', 'Com plano ativo'], ['sem-plano', 'Sem plano']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setFiltro(val); setPage(1); }}
              className={`py-1 px-2.5 rounded-[var(--radius-sm)] text-xs font-medium cursor-pointer border transition-all duration-150 ${
                filtro === val
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary-text)] font-semibold'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg)]'
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto text-xs text-[var(--color-ink-tertiary)] font-sans">
            {total > 0 ? `${total} resultado${total !== 1 ? 's' : ''}` : ''}
          </span>
        </div>

        {/* Conteúdo Principal (Lista + Detalhes) */}
        <div className="flex gap-3 items-start">
          
          {/* Tabela/Lista */}
          <div className="flex-1 border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface)] min-h-[400px] shadow-sm">
            {loading && pacientes.length === 0 ? (
              <div className="flex flex-col">
                <PatientSkeleton />
                <PatientSkeleton />
                <PatientSkeleton />
                <PatientSkeleton />
              </div>
            ) : pacientesFiltrados.length === 0 ? (
              <div className="py-8 text-center text-[var(--color-ink-tertiary)] text-sm">
                Nenhum paciente encontrado
              </div>
            ) : (
              pacientesFiltrados.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => setSelecionado(p.id === selecionado ? null : p.id)}
                  className={`p-2.5 px-3.5 cursor-pointer flex items-center gap-2.5 transition-all duration-150 border-l-2 ${
                    i < pacientesFiltrados.length - 1 ? 'border-b border-[var(--color-border-light)]' : ''
                  } ${
                    selecionado === p.id
                      ? 'bg-[var(--color-subtle)] border-l-[var(--color-primary)]'
                      : 'border-l-transparent hover:bg-slate-50/80'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--color-subtle)] flex items-center justify-center text-[10px] font-semibold text-[var(--color-ink-secondary)] flex-shrink-0">
                    {getInitials(p.nomeCompleto)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[var(--color-ink-primary)] flex items-center gap-1.5">
                      {p.nomeCompleto}
                      <span className={`text-[9px] px-1 rounded-sm font-semibold tracking-wide uppercase ${
                        p.planoAtivo
                          ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary-text)]'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {p.planoAtivo ? 'ativo' : 'sem plano'}
                      </span>
                    </div>
                    <div className="text-[10px] text-[var(--color-ink-tertiary)] mt-0.5 truncate">
                      {p.email}
                    </div>
                  </div>
                  <div className="flex gap-3 flex-shrink-0 items-center">
                    <span className="text-[10px] font-mono text-[var(--color-ink-secondary)]">
                      atend. {formatDate(p.ultimoAtendimento)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Painel Lateral com AnimatePresence */}
          <div className="w-[240px] flex-shrink-0">
            <AnimatePresence mode="wait">
              {pacienteSelecionado ? (
                <motion.div
                  key={pacienteSelecionado.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-5 sticky top-[60px] shadow-sm flex flex-col"
                >
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-subtle)] flex items-center justify-center text-xs font-bold text-[var(--color-ink-secondary)]">
                      {getInitials(pacienteSelecionado.nomeCompleto)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[var(--color-ink-primary)] truncate">
                        {pacienteSelecionado.nomeCompleto}
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-semibold uppercase ${
                        pacienteSelecionado.planoAtivo
                          ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary-text)]'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {pacienteSelecionado.planoAtivo ? 'Plano ativo' : 'Sem plano'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mb-5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase tracking-wider font-semibold">Nasc.</span>
                      <span className="font-mono text-[var(--color-ink-primary)] font-medium">{formatDate(pacienteSelecionado.dataNascimento)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] text-[var(--color-ink-tertiary)] uppercase tracking-wider font-semibold">Últ. atend.</span>
                      <span className="font-mono text-[var(--color-ink-primary)] font-medium">{formatDate(pacienteSelecionado.ultimoAtendimento)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/dashboard/pacientes/${pacienteSelecionado.id}`)}
                    className="w-full py-2 text-xs font-semibold rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white border-none cursor-pointer hover:bg-[var(--color-primary-hover)] transition-all duration-150 shadow-sm"
                  >
                    Abrir ficha completa
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] py-8 px-5 text-center flex-shrink-0"
                >
                  <div className="text-xs text-[var(--color-ink-tertiary)]">
                    Selecione um paciente<br />para ver detalhes
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
