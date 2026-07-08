import { useState } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './agenda.css';

const locales = { 'pt-BR': ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface ApptEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'primeira_consulta' | 'retorno';
}

export function SchedulePage() {
  const [events, setEvents] = useState<ApptEvent[]>([
    {
      id: '1',
      title: 'Primeira Consulta: Marcos Paulo',
      start: new Date(new Date().setHours(10, 0, 0, 0)),
      end: new Date(new Date().setHours(11, 0, 0, 0)),
      type: 'primeira_consulta'
    },
    {
      id: '2',
      title: 'Retorno: Ana Silva',
      start: new Date(new Date().setHours(14, 30, 0, 0)),
      end: new Date(new Date().setHours(15, 0, 0, 0)),
      type: 'retorno'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  const [pacienteNome, setPacienteNome] = useState('');
  const [apptType, setApptType] = useState<'primeira_consulta' | 'retorno'>('primeira_consulta');

  function handleSelectSlot(slotInfo: SlotInfo) {
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
    setPacienteNome('');
    setApptType('primeira_consulta');
    setShowModal(true);
  }

  function handleSelectEvent(event: ApptEvent) {
    alert(`Consulta: ${event.title}\nInício: ${format(event.start, "HH:mm")}\nFim: ${format(event.end, "HH:mm")}`);
  }

  function handleAddEvent() {
    if (!pacienteNome.trim() || !selectedSlot) return;

    const newEvent: ApptEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: `${apptType === 'primeira_consulta' ? 'Primeira Consulta' : 'Retorno'}: ${pacienteNome}`,
      start: selectedSlot.start,
      end: selectedSlot.end,
      type: apptType
    };

    setEvents([...events, newEvent]);
    setShowModal(false);
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
        <button
          onClick={() => {
            const start = new Date();
            start.setHours(start.getHours() + 1, 0, 0, 0);
            const end = new Date(start);
            end.setHours(start.getHours() + 1);
            setSelectedSlot({ start, end });
            setShowModal(true);
          }}
          style={{
            padding: '8px 16px', background: 'var(--color-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontSize: 13, fontWeight: 500,
            transition: 'background 150ms ease-out',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
        >
          + Nova Consulta
        </button>
      </div>

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
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Não há consultas neste período.",
            showMore: (total: number) => `+ ${total} mais`
          }}
          eventPropGetter={(event) => {
            const isRetorno = event.type === 'retorno';
            return {
              style: {
                backgroundColor: isRetorno ? 'var(--color-bg)' : 'var(--color-primary-subtle)',
                color: isRetorno ? 'var(--color-ink-primary)' : 'var(--color-primary-text)',
                border: isRetorno ? '1px solid var(--color-border)' : '1px solid var(--color-success-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                fontWeight: 500,
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
              Agendar Consulta
            </h2>

            <p style={{
              margin: '0 0 24px', fontSize: 13, color: 'var(--color-ink-secondary)',
              fontFamily: 'var(--font-mono)',
            }}>
              {format(selectedSlot.start, "dd/MM/yyyy HH:mm")} - {format(selectedSlot.end, "HH:mm")}
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 500,
                color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Paciente
              </label>
              <input
                type="text"
                value={pacienteNome}
                onChange={e => setPacienteNome(e.target.value)}
                autoFocus
                placeholder="Nome do paciente"
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)', fontSize: 14,
                  fontFamily: 'var(--font-body)', outline: 'none',
                  color: 'var(--color-ink-primary)',
                  background: 'var(--color-surface)',
                  transition: 'border-color 150ms ease-out',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{
                display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 500,
                color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Tipo de Consulta
              </label>
              <select
                value={apptType}
                onChange={e => setApptType(e.target.value as 'primeira_consulta' | 'retorno')}
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
                <option value="primeira_consulta">Primeira Consulta</option>
                <option value="retorno">Retorno</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                  border: '1px solid var(--color-border)', cursor: 'pointer',
                  background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!pacienteNome.trim()}
                style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                  border: 'none', cursor: pacienteNome.trim() ? 'pointer' : 'not-allowed',
                  background: pacienteNome.trim() ? 'var(--color-primary)' : 'var(--color-subtle)',
                  color: pacienteNome.trim() ? '#fff' : 'var(--color-ink-tertiary)',
                  transition: 'background 150ms ease-out',
                }}
              >
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
