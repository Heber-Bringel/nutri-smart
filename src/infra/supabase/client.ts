import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cria um client Supabase efêmero e isolado, sem persistência de sessão.
 *
 * Usado para operações como `signUp` de pacientes: o `signUp` autentica a
 * sessão retornada, o que no client principal substituiria a sessão do
 * nutricionista logado. Com `persistSession: false` e `autoRefreshToken: false`,
 * a criação da conta não afeta o `localStorage` nem a sessão ativa.
 */
export function createIsolatedClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storageKey: 'nutrismart-isolated-auth',
    },
  });
}
