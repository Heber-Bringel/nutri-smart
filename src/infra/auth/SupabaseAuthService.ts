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

    // Busca dados do perfil público na tabela profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome_completo, role')
      .eq('id', data.user.id)
      .single();

    return UserMapper.toDomain(data.user, profile || undefined);
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

    // Cria o perfil na tabela pública profiles
    await supabase.from('profiles').insert({
      id: authData.user.id,
      email: data.email,
      nome_completo: data.nomeCompleto,
      role: data.role,
    });

    return UserMapper.toDomain(authData.user, {
      nome_completo: data.nomeCompleto,
      role: data.role,
    });
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('nome_completo, role')
      .eq('id', session.user.id)
      .single();

    return UserMapper.toDomain(session.user, profile || undefined);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('nome_completo, role')
        .eq('id', session.user.id)
        .single();

      callback(UserMapper.toDomain(session.user, profile || undefined));
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}
