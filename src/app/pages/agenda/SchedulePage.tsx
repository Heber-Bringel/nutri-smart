import { useEffect } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../../../viewmodel/auth/AuthViewModel';
import { useAgendaViewModel } from '../../../viewmodel/agenda/AgendaViewModel';
import { agendaSchema, AgendaFormData } from '../../../viewmodel/agenda/AgendaSchema';
import { CalendarEvent } from '../../../model/services/ICalendarAdapter';
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

export function SchedulePage() {
  const { user } = useAuth();
  const vm = useAgendaViewModel();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AgendaFormData>({
    resolver: zodResolver(agendaSchema),
    defaultValues: {
      pacienteId: '',
      observacoes: '',
    },
  });

  useEffect(() => {
    if (user?.id) vm.fetchConsultas(user.id);
  }, [user?.id, vm.fetchConsultas]);

  useEffect(() => {
    if (vm.showModal) {
      reset({
        pacienteId: vm.editingConsulta?.pacienteId || '',
        observacoes: vm.editingConsulta?.observacoes || '',
      });
    }
  }, [vm.showModal, vm.editingConsulta, reset]);

  function onSelectSlot(slotInfo: SlotInfo) {
    vm.openCreateModal({ start: slotInfo.start, end: slotInfo.end });
  }

  function onSelectEvent(event: CalendarEvent) {
    vm.openEditModal(event);
  }

  const onSubmit = async (data: AgendaFormData) => {
    if (user?.id) {
      await vm.handleSave(user.id, data);
    }
  };

  if (vm.loading && vm.events.length === 0) {
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

      {vm.error && (
        <div style={{
          padding: '10px 14px', background: 'var(--color-danger-subtle)',
          border: '1px solid var(--color-danger-border)',
          color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16,
        }}>
          {vm.error}
        </div>
      )}

      <div className="rbc-tech-theme" style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: 24, height: 700,
      }}>
        <Calendar
          localizer={localizer}
          events={vm.events}
          startAccessor="start"
          endAccessor="end"
          culture="pt-BR"
          selectable
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
      </div>

      {vm.showModal && vm.selectedSlot && (
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
              {vm.editingConsulta ? 'Editar Consulta' : 'Agendar Consulta'}
            </h2>

            <p style={{
              margin: '0 0 24px', fontSize: 13, color: 'var(--color-ink-secondary)',
              fontFamily: 'var(--font-mono)',
            }}>
              {format(vm.selectedSlot.start, "dd/MM/yyyy HH:mm")} - {format(vm.selectedSlot.end, "HH:mm")}
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {vm.editingConsulta ? (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Paciente</label>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink-primary)', margin: 0 }}>
                    {vm.editingConsulta.pacienteNome || 'Paciente'}
                  </p>
                  <input type="hidden" {...register('pacienteId')} />
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Paciente</label>
                  <select
                    {...register('pacienteId')}
                    style={{ ...inputStyle, borderColor: errors.pacienteId ? 'var(--color-danger)' : 'var(--color-border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = errors.pacienteId ? 'var(--color-danger)' : 'var(--color-border)'}
                  >
                    <option value="">Selecione um paciente</option>
                    {vm.patients.map(p => (
                      <option key={p.id} value={p.id}>{p.nomeCompleto}</option>
                    ))}
                  </select>
                  {errors.pacienteId && (
                    <span style={{ color: 'var(--color-danger)', fontSize: 11, marginTop: 4, display: 'block' }}>
                      {errors.pacienteId.message}
                    </span>
                  )}
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Observações</label>
                <textarea
                  {...register('observacoes')}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', borderColor: errors.observacoes ? 'var(--color-danger)' : 'var(--color-border)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = errors.observacoes ? 'var(--color-danger)' : 'var(--color-border)'}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={vm.closeModal} style={btnSecondary}>Cancelar</button>
                {vm.editingConsulta && vm.editingConsulta.status !== 'cancelada' && user?.id && (
                  <button
                    type="button"
                    onClick={() => vm.handleCancel(vm.editingConsulta!.id, user.id!)}
                    style={btnDanger}
                  >
                    Cancelar Consulta
                  </button>
                )}
                {(!vm.editingConsulta || vm.editingConsulta.status !== 'cancelada') && user?.id && (
                  <button
                    type="submit"
                    style={btnPrimary}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
                  >
                    {vm.editingConsulta ? 'Salvar' : 'Agendar'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}