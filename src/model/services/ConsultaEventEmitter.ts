import { Consulta } from '../entities/Consulta';

export type ConsultaEventType = 'consulta:criada' | 'consulta:atualizada' | 'consulta:cancelada';

type Listener = (consulta: Consulta) => void;

export class ConsultaEventEmitter {
  private static _instance: ConsultaEventEmitter;
  private listeners = new Map<ConsultaEventType, Listener[]>();

  private constructor() {}

  static getInstance(): ConsultaEventEmitter {
    if (!this._instance) {
      this._instance = new ConsultaEventEmitter();
    }
    return this._instance;
  }

  on(event: ConsultaEventType, listener: Listener): void {
    const arr = this.listeners.get(event) || [];
    arr.push(listener);
    this.listeners.set(event, arr);
  }

  off(event: ConsultaEventType, listener: Listener): void {
    const arr = this.listeners.get(event);
    if (!arr) return;
    this.listeners.set(event, arr.filter(l => l !== listener));
  }

  emit(event: ConsultaEventType, consulta: Consulta): void {
    const arr = this.listeners.get(event);
    if (!arr) return;
    for (const listener of arr) {
      listener(consulta);
    }
  }
}
