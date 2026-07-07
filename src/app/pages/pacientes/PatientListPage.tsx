import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paciente } from '../../../model/entities/Paciente';
import { Container } from '../../../di/container';

export function PatientListPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'ativo' | 'sem-plano'>('todos');
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pageSize = 50; // Aumentado para a lista compacta

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

    // Debounce na busca
    const timeout = setTimeout(fetchPacientes, 300);
    return () => { 
      cancelled = true; 
      clearTimeout(timeout);
    };
  }, [query, page, filtro]);

  // Filtra localmente o status de plano ativo para ser rápido na interface
  // (Poderia ir pra API dependendo do tamanho da base)
  const pacientesFiltrados = pacientes.filter(p => {
    if (filtro === 'todos') return true;
    if (filtro === 'ativo') return p.planoAtivo;
    return !p.planoAtivo;
  });

  const pacienteSelecionado = pacientes.find((p) => p.id === selecionado);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '--/--/----';
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>
      {/* Search hero */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px',
          background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <span style={{ color: '#9CA3AF', fontSize: 16 }}>⌕</span>
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
              flex: 1, border: 'none', outline: 'none', fontSize: 15,
              color: '#111827', background: 'transparent', fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setPage(1); }}
              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: 14 }}
            >✕</button>
          )}
          <button 
            onClick={() => navigate('/dashboard/pacientes/novo')}
            style={{
              background: '#10B981', color: '#fff', border: 'none',
              padding: '5px 12px', borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            + Novo paciente
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {([['todos', 'Todos'], ['ativo', 'Com plano ativo'], ['sem-plano', 'Sem plano']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setFiltro(val); setPage(1); }}
            style={{
              padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', border: '1px solid',
              borderColor: filtro === val ? '#10B981' : '#E5E5E5',
              background: filtro === val ? '#ECFDF5' : '#fff',
              color: filtro === val ? '#065F46' : '#6B7280',
            }}
          >{label}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9CA3AF', alignSelf: 'center' }}>
          {total > 0 ? `${total} resultado${total !== 1 ? 's' : ''}` : ''}
        </span>
      </div>

      {/* Split: lista + detalhe */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Lista compacta */}
        <div style={{ flex: 1, border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden', background: '#fff', minHeight: 400 }}>
          {loading && pacientes.length === 0 ? (
             <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                Carregando...
             </div>
          ) : pacientesFiltrados.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
              Nenhum paciente encontrado
            </div>
          ) : pacientesFiltrados.map((p, i) => (
            <div
              key={p.id}
              onClick={() => setSelecionado(p.id === selecionado ? null : p.id)}
              style={{
                padding: '10px 14px', cursor: 'pointer',
                borderBottom: i < pacientesFiltrados.length - 1 ? '1px solid #F5F5F5' : 'none',
                display: 'flex', alignItems: 'center', gap: 10,
                background: selecionado === p.id ? '#F9FAFB' : 'transparent',
                transition: 'background 0.1s',
                borderLeft: selecionado === p.id ? '2px solid #10B981' : '2px solid transparent',
              }}
              onMouseEnter={(e) => { if (selecionado !== p.id) e.currentTarget.style.background = '#FAFAFA'; }}
              onMouseLeave={(e) => { if (selecionado !== p.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: '#F5F5F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600, color: '#6B7280', flexShrink: 0,
              }}>{getInitials(p.nomeCompleto)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {p.nomeCompleto}
                  <span style={{
                    fontSize: 10, padding: '1px 5px', borderRadius: 2, fontWeight: 500,
                    background: p.planoAtivo ? '#ECFDF5' : '#F5F5F5',
                    color: p.planoAtivo ? '#065F46' : '#9CA3AF',
                  }}>
                    {p.planoAtivo ? 'ativo' : 'sem plano'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                  {p.email}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexShrink: 0, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#6B7280' }}>
                  atend. {formatDate(p.ultimoAtendimento)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Painel de detalhe */}
        {pacienteSelecionado ? (
          <div style={{
            width: 240, border: '1px solid #E5E5E5', borderRadius: 8,
            background: '#fff', padding: '20px', flexShrink: 0,
            position: 'sticky', top: 60,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: '#F5F5F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600, color: '#6B7280',
              }}>{getInitials(pacienteSelecionado.nomeCompleto)}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 140 }}>
                  {pacienteSelecionado.nomeCompleto}
                </div>
                <span style={{
                  fontSize: 10, padding: '1px 5px', borderRadius: 2, fontWeight: 500,
                  background: pacienteSelecionado.planoAtivo ? '#ECFDF5' : '#F5F5F5',
                  color: pacienteSelecionado.planoAtivo ? '#065F46' : '#9CA3AF',
                }}>
                  {pacienteSelecionado.planoAtivo ? 'Plano ativo' : 'Sem plano'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <DetailStat label="Telefone" value={pacienteSelecionado.telefone} />
              <DetailStat label="Nasc." value={formatDate(pacienteSelecionado.dataNascimento)} mono />
              <DetailStat label="Último atend." value={formatDate(pacienteSelecionado.ultimoAtendimento)} mono />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button 
                onClick={() => navigate(`/dashboard/pacientes/${pacienteSelecionado.id}`)}
                style={{
                  padding: '7px 0', fontSize: 12, fontWeight: 500, borderRadius: 5,
                  background: '#10B981', color: '#fff', border: 'none', cursor: 'pointer',
                }}
              >
                Abrir ficha completa
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            width: 240, border: '1px dashed #E5E5E5', borderRadius: 8,
            padding: '32px 20px', textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>Selecione um paciente<br />para ver detalhes</div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailStat({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{
        fontSize: 12, fontWeight: 500, color: '#111827',
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
      }}>{value || '--'}</span>
    </div>
  );
}
