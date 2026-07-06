import { IInviteService } from '../../model/services/IInviteService';
import { PacienteError } from '../../model/errors/PacienteError';
import { supabase } from '../supabase/client';

export class SupabaseInviteService implements IInviteService {
  async sendInvite(email: string): Promise<void> {
    const { error } = await supabase.functions.invoke('invite', {
      method: 'POST',
      body: { email },
    });

    if (error) {
      throw new PacienteError(
        error.message === 'Functions Fetch Failed'
          ? 'Serviço de convite indisponível. O paciente pode se cadastrar manualmente com este e-mail.'
          : `Erro ao enviar convite: ${error.message}`
      );
    }
  }

  async resendInvite(email: string): Promise<void> {
    await this.sendInvite(email);
  }
}
