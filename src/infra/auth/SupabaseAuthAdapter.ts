import { IAuthService, LoginCredentials, RegisterData } from '../../model/services/IAuthService';
import { User } from '../../model/entities/User';
import { AuthError } from '../../model/errors/AuthError';
import { supabase } from '../supabase/client';
import { UserMapper } from './mappers/UserMapper';

export class SupabaseAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    if (!credentials.email || !credentials.password) {
      throw new AuthError('E-mail e senha são obrigatórios.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.user) {
      throw new AuthError('E-mail ou senha inválidos.');
    }

    // Busca dados do perfil público na tabela profiles (substituido por fetchProfileWithPacienteId)

    const enrichedProfile = await this.fetchProfileWithPacienteId(data.user.id);
    return UserMapper.toDomain(data.user, enrichedProfile);
  }

  async register(data: RegisterData): Promise<User> {
    if (!data.email || !data.password) {
      throw new AuthError('E-mail e senha são obrigatórios para cadastro.');
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nome_completo: data.nomeCompleto,
          role: data.role,
        },
      },
    });

    if (error || !authData.user) {
      throw new AuthError(error?.message || 'Erro ao realizar cadastro.');
    }

    // O perfil na tabela pública profiles é gerado automaticamente pelo Trigger SQL handle_new_user()

    return UserMapper.toDomain(authData.user, {
      nome_completo: data.nomeCompleto,
      role: data.role,
    });
  }

  private async fetchProfileWithPacienteId(userId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome_completo, role')
      .eq('id', userId)
      .single();

    const role = (profile?.role as string) || 'paciente';
    let pacienteId: string | undefined;
    if (role === 'paciente') {
      const { data: p } = await supabase
        .from('pacientes')
        .select('id')
        .eq('usuario_id', userId)
        .maybeSingle();
      if (p) pacienteId = p.id;
    }

    return { ...(profile || {}), paciente_id: pacienteId };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new AuthError('Erro ao encerrar sessão.');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const enrichedProfile = await this.fetchProfileWithPacienteId(session.user.id);
    return UserMapper.toDomain(session.user, enrichedProfile);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }

      const enrichedProfile = await this.fetchProfileWithPacienteId(session.user.id);
      callback(UserMapper.toDomain(session.user, enrichedProfile));
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}
