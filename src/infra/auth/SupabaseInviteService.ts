import { IInviteService } from '../../model/services/IInviteService';
import { PacienteError } from '../../model/errors/PacienteError';
import { createIsolatedClient } from '../supabase/client';

/**
 * Gera uma senha temporária segura usando Web Crypto API.
 * Formato: 4 chars aleatórios + hífen + 4 chars aleatórios + hífen + 4 chars aleatórios
 * Ex.: "aB3x-9mKp-Lz2w"
 */
function gerarSenhaTemporaria(): string {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);

  const partes: string[] = [];
  let bloco = '';
  for (let i = 0; i < bytes.length; i++) {
    bloco += chars[bytes[i] % chars.length];
    if (bloco.length === 4) {
      partes.push(bloco);
      bloco = '';
    }
  }
  return partes.join('-');
}

export class SupabaseInviteService implements IInviteService {
  /**
   * Cria a conta do paciente no Supabase Auth com senha temporária gerada
   * e retorna essa senha para o nutricionista repassar ao paciente.
   *
   * Se o e-mail já existe no Auth (conta já criada), lança PacienteError.
   */
  async sendInvite(email: string, nomeCompleto: string): Promise<string> {
    const senha = gerarSenhaTemporaria();

    // Client isolado: o signUp autentica a sessão retornada. No client principal
    // isso deslogaria o nutricionista e o logaria como o paciente. O client
    // efêmero não persiste sessão, preservando a sessão ativa do nutricionista.
    const isolatedClient = createIsolatedClient();

    const { error } = await isolatedClient.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome_completo: nomeCompleto,
          role: 'paciente',
        },
      },
    });

    if (error) {
      throw new PacienteError(
        error.message.includes('already registered')
          ? 'Já existe uma conta com este e-mail.'
          : `Erro ao criar acesso do paciente: ${error.message}`
      );
    }

    return senha;
  }

  /**
   * Gera nova senha temporária para paciente que ainda não tem conta (usuarioId === null).
   * Usado pelo botão "Gerar nova senha" no perfil do paciente.
   *
   * Como o `signUp` com e-mail já existente não retorna erro claro no cliente anon,
   * usamos a mesma lógica: tenta criar; se já existe, informa o nutricionista.
   */
  async resendInvite(email: string, nomeCompleto: string): Promise<string> {
    return this.sendInvite(email, nomeCompleto);
  }
}
