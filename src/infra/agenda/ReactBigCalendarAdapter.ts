import { ICalendarAdapter, CalendarEvent } from '../../model/services/ICalendarAdapter';
import { Consulta } from '../../model/entities/Consulta';

export class ReactBigCalendarAdapter implements ICalendarAdapter {
  toEvents(consultas: Consulta[]): CalendarEvent[] {
    return consultas.map(c => ({
      id: c.id,
      title: `${c.pacienteNome || 'Paciente'} - ${c.status === 'cancelada' ? 'Cancelada' : c.status === 'realizada' ? 'Realizada' : 'Agendada'}`,
      start: this.toDate(c.data, c.horarioInicio),
      end: this.toDate(c.data, c.horarioFim),
      consulta: c,
    }));
  }

  private toDate(data: string, time: string): Date {
    const [ano, mes, dia] = data.split('-').map(Number);
    const [h, m] = time.split(':').map(Number);
    return new Date(ano, mes - 1, dia, h, m);
  }
}
