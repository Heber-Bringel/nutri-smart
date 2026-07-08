import { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container } from '../../../di/container';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import { CalendarEvent } from '../../../model/services/ICalendarAdapter';
import { Consulta, CreateConsultaData } from '../../../model/entities/Consulta';
import { AgendaError } from '../../../model/errors/AgendaError';
import './agenda.css';

const locales = { 'pt-BR': ptBR };

const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales,
});

export function SchedulePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null);

  const [pacienteId, setPacienteId] = useState('');
  const [pacienteNome, setPacienteNome] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [patients, setPatients] = useState<{ id: string; nomeCompleto: string }[]>([]);

  useEffect(() => {
    Container.listPacientesUseCase.execute({ pageSize: 200 })
      .then(res => setPatients(res.data))
      .catch(() => {});
  }, []);

  const fetchConsultas = useCallback(async (nutricionistaId?: string) => {
    if (!nutricionistaId) return;
    setLoading(true);
    setError(null);
    try {
      const consultas = await Container.listConsultasUseCase.execute(nutricionistaId);
      const calendarEvents = Container.calendarAdapter.toEvents(consultas);
      setEvents(calendarEvents);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar consultas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) fetchConsultas(user.id);
  }, [user?.id, fetchConsultas]);

  function resetForm() {
    setPacienteId('');
    setPacienteNome('');
    setObservacoes('');
    setEditingConsulta(null);
    setError(null);
  }

  function openCreateModal(slotInfo: SlotInfo) {
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
    resetForm();
    setShowModal(true);
  }

  function openEditModal(event: CalendarEvent) {
    const c = event.consulta;
    setEditingConsulta(c);
    setSelectedSlot({ start: event.start, end: event.end });
    setPacienteId(c.pacienteId);
    setPacienteNome(c.pacienteNome || '');
    setObservacoes(c.observacoes || '');
    setShowModal(true);
  }

  async function handleSave() {
    if (!user?.id || !selectedSlot) return;
    setError(null);

    if (!pacienteId && !pacienteNome.trim()) {
      setError('Selecione ou informe o paciente.');
      return;
    }

    try {
      const data = format(selectedSlot.start, 'yyyy-MM-dd');
      const horarioInicio = format(selectedSlot.start, 'HH:mm');
      const duracaoMinutos = Math.round(
        (selectedSlot.end.getTime() - selectedSlot.start.getTime()) / 60000
      );

      if (editingConsulta) {
        await Container.updateConsultaUseCase.execute(editingConsulta.id, {
          data,
          horarioInicio,
          duracaoMinutos,
          observacoes: observacoes || null,
        });
      } else {
        if (!pacienteId) {
          setError('Selecione um paciente da lista.');
          return;
        }
        const createData: CreateConsultaData = {
          nutricionistaId: user.id,
          pacienteId,
          data,
          horarioInicio,
          duracaoMinutos,
          observacoes: observacoes || null,
        };
        await Container.createConsultaUseCase.execute(createData);
      }

      setShowModal(false);
      resetForm();
      await fetchConsultas(user.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar consulta.');
    }
  }

  async function handleCancel(consultaId: string) {
    if (!user?.id) return;
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) return;

    try {
      await Container.cancelConsultaUseCase.execute(consultaId);
      setShowModal(false);
      resetForm();
      await fetchConsultas(user.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar consulta.');
    }
  }

  if (loading && events.length === 0) {
    return (
      <div style={{ maxWidth: 1024, margin: '0 auto', padding: '48px 40px' }}>
        <p style={{ color: 'var(--color-ink-secondary)', fontSize: 14 }}>Carregando agenda...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1024, margin: '0 auto', padding: '48px 40px' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: 'var(--color-ink-primary)', letterSpacing: '-0.02em' }}>Agenda</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--color-ink-secondary)' }}>
            Gerencie suas consultas e horários de atendimento.
          </p>
        </div>
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

      <div className="rbc-tech-theme" style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: 24, height: 700,
      }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="pt-BR"
          selectable
          onSelectSlot={openCreateModal}
          onSelectEvent={openEditModal}
          messages={{
            next: "Próximo", previous: "Anterior", today: "Hoje",
            month: "Mês", week: "Semana", day: "Dia", agenda: "Agenda",
            date: "Data", time: "Hora", event: "Evento",
            noEventsInRange: "Não há consultas neste período.",
            showMore: (total: number) => `+ ${total} mais`,
          }}
          eventPropGetter={(event) => {
            const c = (event as CalendarEvent).consulta;
            const isCancelada = c?.status === 'cancelada';
            const isRealizada = c?.status === 'realizada';
            return {
              style: {
                backgroundColor: isCancelada ? 'var(--color-bg)' : isRealizada ? 'var(--color-success-subtle)' : 'var(--color-primary-subtle)',
                color: isCancelada ? 'var(--color-ink-tertiary)' : isRealizada ? 'var(--color-success-text)' : 'var(--color-primary-text)',
                border: isCancelada ? '1px solid var(--color-border)' : isRealizada ? '1px solid var(--color-success-border)' : '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                fontWeight: 500,
                textDecoration: isCancelada ? 'line-through' : 'none',
                opacity: isCancelada ? 0.6 : 1,
              }
            };
          }}
        />
      </div>

      {showModal && selectedSlot && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 'var(--z-modal-backdrop, 300)',
        }}>
          <div style={{
            background: 'var(--color-surface)', padding: '32px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)', maxWidth: '400px', width: '90%',
            boxShadow: 'var(--shadow-modal)',
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: 'var(--color-ink-primary)' }}>
              {editingConsulta ? 'Editar Consulta' : 'Agendar Consulta'}
            </h2>

            <p style={{
              margin: '0 0 24px', fontSize: 13, color: 'var(--color-ink-secondary)',
              fontFamily: 'var(--font-mono)',
            }}>
              {format(selectedSlot.start, "dd/MM/yyyy HH:mm")} - {format(selectedSlot.end, "HH:mm")}
            </p>

            {editingConsulta ? (
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 500,
                  color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  Paciente
                </label>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink-primary)', margin: 0 }}>
                  {editingConsulta.pacienteNome || 'Paciente'}
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 500,
                  color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  Paciente
                </label>
                <select
                  value={pacienteId}
                  onChange={e => {
                    setPacienteId(e.target.value);
                    const p = patients.find(p => p.id === e.target.value);
                    setPacienteNome(p?.nomeCompleto || '');
                  }}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)', fontSize: 14,
                    fontFamily: 'var(--font-body)', outline: 'none',
                    color: 'var(--color-ink-primary)', background: 'var(--color-surface)',
                    transition: 'border-color 150ms ease-out',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.nomeCompleto}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 500,
                color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: 14,
                  fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical',
                  color: 'var(--color-ink-primary)', background: 'var(--color-surface)',
                  transition: 'border-color 150ms ease-out',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                  border: '1px solid var(--color-border)', cursor: 'pointer',
                  background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
                }}
              >
                Cancelar
              </button>
              {editingConsulta && editingConsulta.status !== 'cancelada' && (
                <button
                  onClick={() => handleCancel(editingConsulta.id)}
                  style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                    border: '1px solid var(--color-danger)', cursor: 'pointer',
                    background: 'var(--color-surface)', color: 'var(--color-danger)',
                  }}
                >
                  Cancelar Consulta
                </button>
              )}
              {(!editingConsulta || editingConsulta.status !== 'cancelada') && (
                <button
                  onClick={handleSave}
                  style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                    border: 'none', cursor: 'pointer',
                    background: 'var(--color-primary)', color: '#fff',
                    transition: 'background 150ms ease-out',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
                >
                  {editingConsulta ? 'Salvar' : 'Agendar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
