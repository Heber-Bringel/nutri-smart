import { IAgendamentoValidator } from './IAgendamentoValidator';
import { CreateConsultaData, UpdateConsultaData, Consulta } from '../entities/Consulta';
import { ChoqueHorarioError } from '../errors/AgendaError';

export class EvitarChoqueHorarioValidator implements IAgendamentoValidator {
  async validateCreate(data: CreateConsultaData, existing: Consulta[]): Promise<void> {
    const novoInicio = this.toMinutes(data.horarioInicio);
    const novoFim = novoInicio + data.duracaoMinutos;

    for (const c of existing) {
      const inicio = this.toMinutes(c.horarioInicio);
      const fim = this.toMinutes(c.horarioFim);
      if (this.overlaps(novoInicio, novoFim, inicio, fim)) {
        throw new ChoqueHorarioError();
      }
    }
  }

  async validateUpdate(id: string, data: UpdateConsultaData, existing: Consulta[]): Promise<void> {
    const others = existing.filter(c => c.id !== id);
    if (!data.horarioInicio && !data.data) return;

    for (const c of others) {
      const inicio = this.toMinutes(data.horarioInicio || c.horarioInicio);
      const duracao = data.duracaoMinutos ?? this.toMinutes(c.horarioFim) - inicio;
      const fim = inicio + duracao;
      const outroInicio = this.toMinutes(c.horarioInicio);
      const outroFim = this.toMinutes(c.horarioFim);
      if (this.overlaps(inicio, fim, outroInicio, outroFim)) {
        throw new ChoqueHorarioError();
      }
    }
  }

  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private overlaps(inicioA: number, fimA: number, inicioB: number, fimB: number): boolean {
    return inicioA < fimB && fimA > inicioB;
  }
}
