import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '../../../model/entities/User';

export class UserMapper {
  static toDomain(supabaseUser: SupabaseUser, profileData?: { nome_completo?: string; role?: string; paciente_id?: string }): User {
    const role: UserRole = (profileData?.role as UserRole) || 
      (supabaseUser.user_metadata?.role as UserRole) || 
      'paciente';

    const nomeCompleto = profileData?.nome_completo || 
      supabaseUser.user_metadata?.nome_completo || 
      supabaseUser.email || 
      'Usuário';

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      nomeCompleto,
      role,
      pacienteId: profileData?.paciente_id || undefined,
      createdAt: supabaseUser.created_at,
    };
  }
}
