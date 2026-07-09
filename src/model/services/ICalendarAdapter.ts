import { Consulta } from '../entities/Consulta';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  consulta: Consulta;
}

export interface ICalendarAdapter {
  toEvents(consultas: Consulta[]): CalendarEvent[];
}
