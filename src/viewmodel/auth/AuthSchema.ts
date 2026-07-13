import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório.').email('Por favor, informe um e-mail válido.'),
  password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório.').email('Por favor, informe um e-mail válido.'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
