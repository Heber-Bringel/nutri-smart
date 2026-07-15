import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientesViewModel } from '../../../viewmodel/pacientes/usePacientesViewModel';
import { PatientSkeleton } from '../../components/pacientes/PatientSkeleton';
import { PageTransition } from '../../components/shared/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function formatDate(isoString?: string) {
  if (!isoString) return '-';
  return new Date(isoString + 'T00:00:00').toLocaleDateString('pt-BR');
}

export function PatientListPage() {
  const navigate = useNavigate();
  const { fetchPacientes, pacientes, total, loading } = usePacientesViewModel();
  
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'ativo' | 'sem-plano'>('todos');
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const pageSize = 50;

  // Atraso apenas a busca digitada; a primeira carga e a paginação são imediatas.
  useEffect(() => {
    const atraso = query ? 300 : 0;
    const timeout = setTimeout(() => setBuscaAplicada(query), atraso);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    fetchPacientes(buscaAplicada, page, pageSize);
  }, [buscaAplicada, page, fetchPacientes]);

  const pacientesFiltrados = pacientes.filter(p => {
    if (filtro === 'todos') return true;
    if (filtro === 'ativo') return p.planoAtivo;
    return !p.planoAtivo;
  });

  const pacienteSelecionado = pacientes.find((p) => p.id === selecionado);

  return (
    <PageTransition>
      <div style={{ maxWidth: 1024, margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Barra de Busca e Novo Paciente */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            backgroundColor: 'var(--color-surface)',
            flex: 1,
            transition: 'border-color 150ms ease-out',
          }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
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
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 14,
                color: 'var(--color-ink-primary)',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setPage(1); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-ink-tertiary)',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={() => navigate('/dashboard/pacientes/novo')}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 'var(--radius-md)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'background-color 150ms ease-out',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
          >
            + Novo paciente
          </button>
        </div>

        {/* Filtros e Contagem */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          {([['todos', 'Todos'], ['ativo', 'Com plano ativo'], ['sem-plano', 'Sem plano']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setFiltro(val); setPage(1); }}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                border: filtro === val ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: filtro === val ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                color: filtro === val ? 'var(--color-primary-text)' : 'var(--color-ink-secondary)',
                transition: 'all 150ms ease-out',
              }}
              onMouseEnter={e => {
                if (filtro !== val) e.currentTarget.style.backgroundColor = 'var(--color-subtle)';
              }}
              onMouseLeave={e => {
                if (filtro !== val) e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              }}
            >
              {label}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-ink-tertiary)', fontFamily: 'var(--font-body)' }}>
            {total > 0 ? `${total} resultado${total !== 1 ? 's' : ''}` : ''}
          </span>
        </div>

        {/* Conteúdo Principal (Lista + Detalhes) */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          
          {/* Lista de Pacientes */}
          <div style={{
            flex: 1,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface)',
            minHeight: 400,
          }}>
            <AnimatePresence mode="wait">
              {loading && pacientes.length === 0 ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <PatientSkeleton />
                  <PatientSkeleton />
                  <PatientSkeleton />
                  <PatientSkeleton />
                </motion.div>
              ) : pacientesFiltrados.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ padding: '48px 0', textAlign: 'center', color: 'var(--color-ink-tertiary)', fontSize: 14 }}
                >
                  Nenhum paciente encontrado
                </motion.div>
              ) : (
                <motion.div
                  key={`list-${filtro}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                >
                  {pacientesFiltrados.map((p, i) => (
                    <div
                      key={p.id}
                      onClick={() => setSelecionado(p.id === selecionado ? null : p.id)}
                      style={{
                        padding: '14px 20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'background-color 150ms ease-out',
                        borderBottom: i < pacientesFiltrados.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                        backgroundColor: selecionado === p.id ? 'var(--color-subtle)' : 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (selecionado !== p.id) e.currentTarget.style.backgroundColor = 'rgba(245, 245, 245, 0.5)';
                      }}
                      onMouseLeave={e => {
                        if (selecionado !== p.id) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-ink-secondary)',
                        flexShrink: 0,
                      }}>
                        {getInitials(p.nomeCompleto)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: 'var(--color-ink-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          {p.nomeCompleto}
                          <span style={{
                            fontSize: 9,
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            backgroundColor: p.planoAtivo ? 'var(--color-primary-subtle)' : 'var(--color-subtle)',
                            color: p.planoAtivo ? 'var(--color-primary-text)' : 'var(--color-ink-tertiary)',
                          }}>
                            {p.planoAtivo ? 'ativo' : 'sem plano'}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-ink-secondary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.email}
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-ink-secondary)' }}>
                          atend. {formatDate(p.ultimoAtendimento)}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Painel Lateral */}
          <div style={{ width: 280, flexShrink: 0 }}>
            <AnimatePresence mode="wait">
              {pacienteSelecionado ? (
                <motion.div
                  key={pacienteSelecionado.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--color-surface)',
                    padding: 24,
                    position: 'sticky',
                    top: 60,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--color-ink-secondary)',
                      flexShrink: 0,
                    }}>
                      {getInitials(pacienteSelecionado.nomeCompleto)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-ink-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                        {pacienteSelecionado.nomeCompleto}
                      </div>
                      <span style={{
                        fontSize: 9,
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        backgroundColor: pacienteSelecionado.planoAtivo ? 'var(--color-primary-subtle)' : 'var(--color-subtle)',
                        color: pacienteSelecionado.planoAtivo ? 'var(--color-primary-text)' : 'var(--color-ink-tertiary)',
                      }}>
                        {pacienteSelecionado.planoAtivo ? 'Plano ativo' : 'Sem plano'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)' }}>Nasc.</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-ink-primary)' }}>{formatDate(pacienteSelecionado.dataNascimento)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)' }}>Últ. atend.</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-ink-primary)' }}>{formatDate(pacienteSelecionado.ultimoAtendimento)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/dashboard/pacientes/${pacienteSelecionado.id}`)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary)',
                      color: '#fff',
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transition: 'background-color 150ms ease-out',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
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
                  style={{
                    border: '1px dashed var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '32px 20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--color-ink-tertiary)', lineHeight: 1.6 }}>
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
