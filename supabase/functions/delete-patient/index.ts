import { createClient } from '@supabase/supabase-js';

interface DeletePayload {
  pacienteId: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return json(405, { success: false, message: 'Método não permitido' });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json(401, { success: false, message: 'Não autenticado' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const payload = decodeJwtPayload(token);
    if (!payload || !payload.sub) {
      return json(401, { success: false, message: 'Token inválido' });
    }

    const solicitanteId = payload.sub as string;

    const { pacienteId }: DeletePayload = await req.json();
    if (!pacienteId || typeof pacienteId !== 'string') {
      return json(400, { success: false, message: 'pacienteId é obrigatório' });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return json(500, { success: false, message: 'Erro de configuração do servidor' });
    }

    // Cliente com JWT do nutricionista — aplica RLS para confirmar posse do paciente.
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Confirma que o solicitante é nutricionista.
    const { data: profile, error: profileError } = await authClient
      .from('profiles')
      .select('role')
      .eq('id', solicitanteId)
      .single();

    if (profileError || !profile || profile.role !== 'nutricionista') {
      return json(403, { success: false, message: 'Operação não autorizada' });
    }

    // Confirma que o paciente pertence ao nutricionista e obtém o usuario_id.
    const { data: paciente, error: pacienteError } = await authClient
      .from('pacientes')
      .select('id, usuario_id, email')
      .eq('id', pacienteId)
      .eq('nutricionista_id', solicitanteId)
      .is('deleted_at', null)
      .single();

    if (pacienteError || !paciente) {
      return json(403, { success: false, message: 'Paciente não encontrado ou acesso negado' });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 1. Remove o usuário do Auth (cascade apaga o profile por FK ou trigger).
    //    Se o paciente ainda não criou conta (usuario_id === null), pula esta etapa.
    if (paciente.usuario_id) {
      const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(paciente.usuario_id);
      if (deleteAuthError) {
        return json(400, { success: false, message: `Erro ao remover conta do paciente: ${deleteAuthError.message}` });
      }
    } else {
      // Mesmo sem conta Auth, pode existir um usuário pendente (signUp não confirmado).
      // Busca pelo e-mail e remove se encontrar.
      const { data: users } = await adminClient.auth.admin.listUsers();
      const pendente = users?.users?.find(u => u.email?.toLowerCase() === paciente.email?.toLowerCase());
      if (pendente) {
        await adminClient.auth.admin.deleteUser(pendente.id);
      }
    }

    // 2. Remove o registro da tabela pacientes (hard delete via service_role, ignora RLS).
    const { error: deletePacienteError } = await adminClient
      .from('pacientes')
      .delete()
      .eq('id', pacienteId);

    if (deletePacienteError) {
      return json(400, { success: false, message: `Erro ao remover paciente: ${deletePacienteError.message}` });
    }

    return json(200, { success: true, message: 'Paciente removido completamente.' });
  } catch (err) {
    return json(500, {
      success: false,
      message: err instanceof Error ? err.message : 'Erro interno do servidor',
    });
  }
});
