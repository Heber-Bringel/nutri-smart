import { createClient } from '@supabase/supabase-js';

interface InvitePayload {
  email: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email }: InvitePayload = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ success: false, message: 'E-mail é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(JSON.stringify({ success: false, message: 'Erro de configuração do servidor' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { error } = await supabase.auth.admin.inviteUserByEmail(email);

    if (error) {
      return new Response(JSON.stringify({ success: false, message: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Convite enviado com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err instanceof Error ? err.message : 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
