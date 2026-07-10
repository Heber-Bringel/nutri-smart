import { useEffect } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import { useAgendaViewModel } from '../../../viewmodel/agenda/AgendaViewModel';
import { CalendarEvent } from '../../../model/services/ICalendarAdapter';
import { PageTransition } from '../../components/shared/PageTransition';
import './agenda.css';

const locales = { 'pt-BR': ptBR };

const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales,
});

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 500,
  color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)', fontSize: 14,
  fontFamily: 'var(--font-body)', outline: 'none',
  color: 'var(--color-ink-primary)', background: 'var(--color-surface)',
  transition: 'border-color 150ms ease-out',
  boxSizing: 'border-box',
};
const btnSecondary: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
  border: '1px solid var(--color-border)', cursor: 'pointer',
  background: 'var(--color-surface)', color: 'var(--color-ink-primary)',
};
const btnDanger: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
  border: '1px solid var(--color-danger)', cursor: 'pointer',
  background: 'var(--color-surface)', color: 'var(--color-danger)',
};
const btnPrimary: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
  border: 'none', cursor: 'pointer',
  background: 'var(--color-primary)', color: '#fff',
  transition: 'background 150ms ease-out',
};

function CalendarSkeleton() {
  return (
    <motion.div
      key="loading-calendar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        height: 700,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
      className="animate-pulse"
    >
      {/* Simulação do cabeçalho da agenda */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 50, height: 32, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-md)' }} />
          <div style={{ width: 70, height: 32, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-md)' }} />
          <div style={{ width: 70, height: 32, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-md)' }} />
        </div>
        <div style={{ width: 120, height: 24, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-sm)' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 45, height: 32, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-md)' }} />
          <div style={{ width: 65, height: 32, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-md)' }} />
          <div style={{ width: 45, height: 32, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-md)' }} />
          <div style={{ width: 65, height: 32, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>

      {/* Simulação dos dias da semana (cabeçalho da tabela) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 12 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ height: 16, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-sm)', width: '60%', margin: '0 auto' }} />
        ))}
      </div>

      {/* Simulação da grade de dias do mês (5 semanas x 7 dias) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: 8, flex: 1 }}>
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            style={{
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 80,
            }}
          >
            <div style={{ width: 20, height: 14, backgroundColor: 'var(--color-subtle)', borderRadius: 'var(--radius-sm)' }} />
            {/* Ocasionalmente adiciona um bloco simulando uma consulta */}
            {i === 12 && (
              <div style={{ height: 20, backgroundColor: 'var(--color-primary-subtle)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', marginTop: 4 }} />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function SchedulePage() {
  const { user } = useAuth();
  const vm = useAgendaViewModel();

  useEffect(() => {
    if (user?.id) vm.fetchConsultas(user.id);
  }, [user?.id]);

  function onSelectSlot(slotInfo: SlotInfo) {
    vm.openCreateModal({ start: slotInfo.start, end: slotInfo.end });
  }

  function onSelectEvent(event: CalendarEvent) {
    vm.openEditModal(event);
  }

  return (
    <PageTransition>
      <div style={{ maxWidth: 1024, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: 'var(--color-ink-primary)', letterSpacing: '-0.02em' }}>Agenda</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--color-ink-secondary)' }}>
              Gerencie suas consultas e horários de atendimento.
            </p>
          </div>
        </div>

        {vm.error && (
          <div style={{
            padding: '10px 14px', background: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16,
          }}>
            {vm.error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {vm.loading && vm.events.length === 0 ? (
            <CalendarSkeleton />
          ) : (
            <motion.div
              key={`calendar-${vm.currentView}-${vm.currentDate ? (vm.currentDate instanceof Date ? vm.currentDate.getTime() : new Date(vm.currentDate).getTime()) : 'default'}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="rbc-tech-theme"
              style={{
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)', padding: 24, height: 700,
              }}
            >
              <Calendar
                localizer={localizer}
                events={vm.events}
                startAccessor="start"
                endAccessor="end"
                culture="pt-BR"
                selectable
                date={vm.currentDate}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                view={vm.currentView as any}
                onNavigate={vm.onNavigate}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onView={vm.onView as any}
                onSelectSlot={onSelectSlot}
                onSelectEvent={onSelectEvent}
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
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {vm.showModal && vm.selectedSlot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 'var(--z-modal-backdrop, 300)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  background: 'var(--color-surface)', padding: '32px', borderRadius: 'var(--radius-lg)',
                  border: 'none', maxWidth: '400px', width: '90%',
                  boxShadow: 'var(--shadow-modal)',
                }}
              >
                <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: 'var(--color-ink-primary)' }}>
                  {vm.editingConsulta ? 'Editar Consulta' : 'Agendar Consulta'}
                </h2>

                <div style={{
                  display: 'flex', gap: 16, marginBottom: 24,
                  fontSize: 13, color: 'var(--color-ink-secondary)',
                  fontFamily: 'var(--font-mono)', alignItems: 'center'
                }}>
                  <div>
                    <span style={{ marginRight: 8, color: 'var(--color-ink-primary)' }}>
                      Data: {format(vm.selectedSlot.start, "dd/MM/yyyy")}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Início</label>
                    <input 
                      type="time" 
                      value={format(vm.selectedSlot.start, "HH:mm")}
                      onChange={e => vm.updateSlotTime('start', e.target.value)}
                      style={inputStyle} 
                      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Fim</label>
                    <input 
                      type="time" 
                      value={format(vm.selectedSlot.end, "HH:mm")}
                      onChange={e => vm.updateSlotTime('end', e.target.value)}
                      style={inputStyle} 
                      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                </div>

                {vm.editingConsulta ? (
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Paciente</label>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink-primary)', margin: 0 }}>
                      {vm.editingConsulta.pacienteNome || 'Paciente'}
                    </p>
                  </div>
                ) : (
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Paciente</label>
                    <select
                      value={vm.form.pacienteId}
                      onChange={e => {
                        vm.setFormField('pacienteId', e.target.value);
                        const p = vm.patients.find(p => p.id === e.target.value);
                        vm.setFormField('pacienteNome', p?.nomeCompleto || '');
                      }}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    >
                      <option value="">Selecione um paciente</option>
                      {vm.patients.map(p => (
                        <option key={p.id} value={p.id}>{p.nomeCompleto}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Observações</label>
                  <textarea
                    value={vm.form.observacoes}
                    onChange={e => vm.setFormField('observacoes', e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={vm.closeModal} style={btnSecondary}>Cancelar</button>
                  {vm.editingConsulta && vm.editingConsulta.status !== 'cancelada' && user?.id && (
                    <button
                      onClick={() => vm.handleCancel(vm.editingConsulta!.id, user.id!)}
                      style={btnDanger}
                    >
                      Cancelar Consulta
                    </button>
                  )}
                  {(!vm.editingConsulta || vm.editingConsulta.status !== 'cancelada') && user?.id && (
                    <button
                      onClick={() => vm.handleSave(user.id!)}
                      style={btnPrimary}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
                    >
                      {vm.editingConsulta ? 'Salvar' : 'Agendar'}
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}