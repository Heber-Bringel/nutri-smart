import { z } from 'zod';

export const patientSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().min(1, 'E-mail é obrigatório.').email('Formato de e-mail inválido.'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória.'),
  sexoBiologico: z.enum(['masculino', 'feminino']),
  pesoInicial: z.coerce.number({ message: 'Peso deve ser um número.' }).positive('Peso deve ser maior que zero.'),
  altura: z.coerce.number({ message: 'Altura deve ser um número.' }).positive('Altura deve ser maior que zero.'),
  nivelAtividadeFisica: z.enum(['sedentario', 'levemente_ativo', 'moderadamente_ativo', 'muito_ativo', 'extremamente_ativo']),
});

export type PatientFormData = z.infer<typeof patientSchema>;
