export interface IInviteService {
  /** Cria a conta do paciente e retorna a senha temporária gerada. */
  sendInvite(email: string, nomeCompleto: string): Promise<string>;
  /** Gera uma nova senha temporária para um paciente que ainda não tem conta. */
  resendInvite(email: string, nomeCompleto: string): Promise<string>;
}
