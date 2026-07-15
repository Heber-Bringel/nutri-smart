import { z } from 'zod';

export const agendaSchema = z.object({
  pacienteId: z.string().min(1, 'Selecione um paciente.'),
  data: z.string().min(1, 'Informe a data da consulta.'),
  horario: z.string().min(1, 'Informe o horário de início.'),
  duracaoMinutos: z
    .number()
    .int('Duração inválida.')
    .min(15, 'Duração mínima de 15 minutos.')
    .max(480, 'Duração máxima de 8 horas.'),
  observacoes: z.string().optional(),
});

export type AgendaFormData = z.infer<typeof agendaSchema>;
