import { useState, useEffect, useCallback } from 'react';
import { Container } from '../../di/container';
import { CalendarEvent } from '../../model/services/ICalendarAdapter';
import { Consulta, CreateConsultaData, UpdateConsultaData } from '../../model/entities/Consulta';

export interface AgendaFormState {
  pacienteId: string;
  pacienteNome: string;
  observacoes: string;
}

export interface AgendaViewModelState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  showModal: boolean;
  editingConsulta: Consulta | null;
  selectedSlot: { start: Date; end: Date } | null;
  form: AgendaFormState;
  patients: { id: string; nomeCompleto: string }[];
  currentDate: Date;
  currentView: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
}

export interface AgendaViewModelActions {
  fetchConsultas: (nutricionistaId: string) => Promise<void>;
  openCreateModal: (slot: { start: Date; end: Date }) => void;
  openEditModal: (event: CalendarEvent) => void;
  closeModal: () => void;
  setFormField: (field: keyof AgendaFormState, value: string) => void;
  handleSave: (nutricionistaId: string) => Promise<void>;
  handleCancel: (consultaId: string, nutricionistaId: string) => Promise<void>;
  updateSlotTime: (field: 'start' | 'end', timeStr: string) => void;
  onNavigate: (newDate: Date) => void;
  onView: (newView: 'month' | 'week' | 'work_week' | 'day' | 'agenda') => void;
}

export function useAgendaViewModel(): AgendaViewModelState & AgendaViewModelActions {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null);
  const [form, setForm] = useState<AgendaFormState>({ pacienteId: '', pacienteNome: '', observacoes: '' });
  const [patients, setPatients] = useState<{ id: string; nomeCompleto: string }[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'work_week' | 'day' | 'agenda'>('month');

  useEffect(() => {
    Container.listPacientesUseCase.execute({ pageSize: 200 })
      .then(res => setPatients(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const fetchConsultas = useCallback(async (nutricionistaId: string) => {
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

  function resetForm() {
    setForm({ pacienteId: '', pacienteNome: '', observacoes: '' });
    setEditingConsulta(null);
    setError(null);
  }

  function openCreateModal(slot: { start: Date; end: Date }) {
    const { start } = slot;
    let end = slot.end;
    // Se o clique foi no mês, `end` costuma vir como o dia seguinte (00:00) e start (00:00)
    if (end.getTime() - start.getTime() >= 24 * 60 * 60 * 1000) {
      end = new Date(start);
      end.setHours(start.getHours() + 1);
    }
    
    setSelectedSlot({ start, end });
    resetForm();
    setShowModal(true);
  }

  function openEditModal(event: CalendarEvent) {
    const c = event.consulta;
    setEditingConsulta(c);
    setSelectedSlot({ start: event.start, end: event.end });
    setForm({
      pacienteId: c.pacienteId,
      pacienteNome: c.pacienteNome || '',
      observacoes: c.observacoes || '',
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  function setFormField(field: keyof AgendaFormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function updateSlotTime(field: 'start' | 'end', timeStr: string) {
    setSelectedSlot(prev => {
      if (!prev) return prev;
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return prev;

      const newDate = new Date(prev[field]);
      newDate.setHours(hours, minutes, 0, 0);

      const result = { ...prev, [field]: newDate };
      
      // Força a data de fim a ser exatamente o mesmo dia da data de início
      const startYear = result.start.getFullYear();
      const startMonth = result.start.getMonth();
      const startDay = result.start.getDate();
      result.end = new Date(result.end);
      result.end.setFullYear(startYear, startMonth, startDay);
      
      // Validação básica: end não pode ser antes do start
      if (field === 'start' && result.start > result.end) {
        const adjustedEnd = new Date(result.start);
        adjustedEnd.setHours(result.start.getHours() + 1);
        result.end = adjustedEnd;
      }
      if (field === 'end' && result.end < result.start) {
        const adjustedStart = new Date(result.end);
        adjustedStart.setHours(result.end.getHours() - 1);
        result.start = adjustedStart;
      }

      return result;
    });
  }

  async function handleSave(nutricionistaId: string) {
    if (!selectedSlot) return;
    setError(null);

    if (!form.pacienteId && !form.pacienteNome.trim()) {
      setError('Selecione ou informe o paciente.');
      return;
    }

    try {
      const data = selectedSlot.start.toISOString().split('T')[0];
      const horarioInicio = selectedSlot.start.toTimeString().slice(0, 5);
      const duracaoMinutos = Math.round(
        (selectedSlot.end.getTime() - selectedSlot.start.getTime()) / 60000
      );

      if (duracaoMinutos <= 0) {
        setError('O horário de término deve ser maior que o horário de início no mesmo dia.');
        return;
      }
      
      if (duracaoMinutos > 12 * 60) {
        setError('A consulta não pode ter mais que 12 horas de duração.');
        return;
      }

      if (editingConsulta) {
        await Container.updateConsultaUseCase.execute(editingConsulta.id, {
          data,
          horarioInicio,
          duracaoMinutos,
          observacoes: form.observacoes || null,
        } as UpdateConsultaData);
      } else {
        if (!form.pacienteId) {
          setError('Selecione um paciente da lista.');
          return;
        }
        const createData: CreateConsultaData = {
          nutricionistaId,
          pacienteId: form.pacienteId,
          data,
          horarioInicio,
          duracaoMinutos,
          observacoes: form.observacoes || null,
        };
        await Container.createConsultaUseCase.execute(createData);
      }

      setShowModal(false);
      resetForm();
      await fetchConsultas(nutricionistaId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar consulta.');
    }
  }

  async function handleCancel(consultaId: string, nutricionistaId: string) {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) return;

    try {
      await Container.cancelConsultaUseCase.execute(consultaId);
      setShowModal(false);
      resetForm();
      await fetchConsultas(nutricionistaId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar consulta.');
    }
  }

  function onNavigate(newDate: Date) {
    setCurrentDate(newDate);
  }

  function onView(newView: 'month' | 'week' | 'work_week' | 'day' | 'agenda') {
    setCurrentView(newView);
  }

  return {
    events, loading, error, showModal, selectedSlot, editingConsulta, form, patients, currentDate, currentView,
    fetchConsultas, openCreateModal, openEditModal, closeModal, setFormField, handleSave, handleCancel, updateSlotTime, onNavigate, onView,
  };
}