export type UserRole = 'nutricionista' | 'paciente';

export interface User {
  id: string;
  email: string;
  nomeCompleto: string;
  role: UserRole;
  createdAt?: string;
}
