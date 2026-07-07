import { useState } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './agenda.css';

const locales = {
  'pt-BR': ptBR,
};

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
  
  // Form State
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
    <div style={{ maxWidth: 1024, margin: '0 auto', padding: '48px 40px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>Agenda</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
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
            padding: '8px 16px', backgroundColor: '#10B981', color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}
        >
          + Nova Consulta
        </button>
      </div>

      <div className="rbc-tech-theme" style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 8, padding: 24, height: 700 }}>
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
            showMore: total => `+ ${total} mais`
          }}
          eventPropGetter={(event) => {
            const isRetorno = event.type === 'retorno';
            return {
              style: {
                backgroundColor: isRetorno ? '#F9FAFB' : '#ECFDF5',
                color: isRetorno ? '#374151' : '#065F46',
                border: isRetorno ? '1px solid #E5E5E5' : '1px solid #A7F3D0',
                borderRadius: 4,
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
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '32px', borderRadius: '8px',
            border: '1px solid #E5E5E5', maxWidth: '400px', width: '90%',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#111827' }}>Agendar Consulta</h2>
            
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#6B7280', fontFamily: 'JetBrains Mono, monospace' }}>
              {format(selectedSlot.start, "dd/MM/yyyy HH:mm")} - {format(selectedSlot.end, "HH:mm")}
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase' }}>Paciente</label>
              <input
                type="text"
                value={pacienteNome}
                onChange={e => setPacienteNome(e.target.value)}
                autoFocus
                placeholder="Nome do paciente"
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '6px',
                  border: '1px solid #E5E5E5', fontSize: 14, fontFamily: 'inherit',
                  outline: 'none', transition: 'border-color 0.15s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#10B981'}
                onBlur={e => e.target.style.borderColor = '#E5E5E5'}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase' }}>Tipo de Consulta</label>
              <select
                value={apptType}
                onChange={e => setApptType(e.target.value as 'primeira_consulta' | 'retorno')}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '6px',
                  border: '1px solid #E5E5E5', fontSize: 14, fontFamily: 'inherit',
                  outline: 'none', transition: 'border-color 0.15s',
                  boxSizing: 'border-box', background: '#fff'
                }}
                onFocus={e => e.target.style.borderColor = '#10B981'}
                onBlur={e => e.target.style.borderColor = '#E5E5E5'}
              >
                <option value="primeira_consulta">Primeira Consulta</option>
                <option value="retorno">Retorno</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px', borderRadius: '6px', fontSize: 13, fontWeight: 500,
                  border: '1px solid #E5E5E5', cursor: 'pointer', backgroundColor: '#fff', color: '#374151'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!pacienteNome.trim()}
                style={{
                  padding: '8px 16px', borderRadius: '6px', fontSize: 13, fontWeight: 500,
                  border: 'none', cursor: pacienteNome.trim() ? 'pointer' : 'not-allowed',
                  backgroundColor: pacienteNome.trim() ? '#10B981' : '#F3F4F6',
                  color: pacienteNome.trim() ? '#fff' : '#9CA3AF', transition: 'background-color 0.15s'
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
