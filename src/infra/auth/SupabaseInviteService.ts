import { IInviteService } from '../../model/services/IInviteService';
import { PacienteError } from '../../model/errors/PacienteError';
import { createIsolatedClient } from '../supabase/client';

/**
 * Gera uma senha temporária segura usando Web Crypto API.
 * Formato: 8 caracteres alfanuméricos minúsculos, sem ambiguidade e sem separadores.
 * Ex.: "k7rm9xq2"
 */
function gerarSenhaTemporaria(): string {
  // Sem caracteres ambíguos: 'l', 'o', '0', '1' removidos.
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  const tamanho = 8;
  const bytes = new Uint8Array(tamanho);
  crypto.getRandomValues(bytes);

  let senha = '';
  for (let i = 0; i < tamanho; i++) {
    senha += chars[bytes[i] % chars.length];
  }
  return senha;
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
