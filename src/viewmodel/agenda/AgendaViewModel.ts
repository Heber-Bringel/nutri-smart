import { useState, useEffect, useCallback } from 'react';
import { Container } from '../../di/container';
import { CalendarEvent } from '../../model/services/ICalendarAdapter';
import { Consulta, CreateConsultaData, UpdateConsultaData } from '../../model/entities/Consulta';
import { AgendaFormData } from './AgendaSchema';

export interface AgendaViewModelState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  showModal: boolean;
  editingConsulta: Consulta | null;
  selectedSlot: { start: Date; end: Date } | null;
  patients: { id: string; nomeCompleto: string }[];
}

export interface AgendaViewModelActions {
  fetchConsultas: (nutricionistaId: string) => Promise<void>;
  openCreateModal: (slot: { start: Date; end: Date }) => void;
  openEditModal: (event: CalendarEvent) => void;
  closeModal: () => void;
  handleSave: (nutricionistaId: string, data: AgendaFormData) => Promise<void>;
  handleCancel: (consultaId: string, nutricionistaId: string) => Promise<void>;
}

export function useAgendaViewModel(): AgendaViewModelState & AgendaViewModelActions {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null);
  const [patients, setPatients] = useState<{ id: string; nomeCompleto: string }[]>([]);

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

  function openCreateModal(slot: { start: Date; end: Date }) {
    setSelectedSlot(slot);
    setEditingConsulta(null);
    setError(null);
    setShowModal(true);
  }

  function openEditModal(event: CalendarEvent) {
    const c = event.consulta;
    setEditingConsulta(c);
    setSelectedSlot({ start: event.start, end: event.end });
    setError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingConsulta(null);
    setError(null);
  }

  async function handleSave(nutricionistaId: string, formData: AgendaFormData) {
    setError(null);

    try {
      const dataStr = formData.data;
      const horarioInicio = formData.horario;
      const duracaoMinutos = formData.duracaoMinutos;

      if (editingConsulta) {
        await Container.updateConsultaUseCase.execute(editingConsulta.id, {
          data: dataStr,
          horarioInicio,
          duracaoMinutos,
          observacoes: formData.observacoes || null,
        } as UpdateConsultaData);
      } else {
        const createData: CreateConsultaData = {
          nutricionistaId,
          pacienteId: formData.pacienteId,
          data: dataStr,
          horarioInicio,
          duracaoMinutos,
          observacoes: formData.observacoes || null,
        };
        await Container.createConsultaUseCase.execute(createData);
      }

      setShowModal(false);
      setEditingConsulta(null);
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
      setEditingConsulta(null);
      await fetchConsultas(nutricionistaId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar consulta.');
    }
  }

  return {
    events, loading, error, showModal, selectedSlot, editingConsulta, patients,
    fetchConsultas, openCreateModal, openEditModal, closeModal, handleSave, handleCancel,
  };
}