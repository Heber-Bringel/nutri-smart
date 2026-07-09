export interface IInviteService {
  sendInvite(email: string): Promise<void>;
  resendInvite(email: string): Promise<void>;
}
