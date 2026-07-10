import { z } from 'zod';

export const agendaSchema = z.object({
  pacienteId: z.string().min(1, 'Selecione um paciente.'),
  observacoes: z.string().optional(),
});

export type AgendaFormData = z.infer<typeof agendaSchema>;
