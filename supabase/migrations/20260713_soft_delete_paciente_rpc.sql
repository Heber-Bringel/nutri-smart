-- Função RPC para soft delete de paciente.
--
-- Motivo: um UPDATE direto que grava `deleted_at` via PostgREST retorna a
-- representação da linha e, nesse retorno, o Postgres reaplica as policies de
-- SELECT sobre a linha já alterada. Como as policies de SELECT exigem
-- `deleted_at IS NULL`, a linha recém-excluída fica invisível e o PostgREST
-- devolve o erro 42501 ("new row violates row-level security policy"), mesmo
-- quando o solicitante é o nutricionista responsável.
--
-- Solução: encapsular o soft delete numa função SECURITY DEFINER, que executa
-- com privilégios do owner (ignorando RLS no RETURNING) mas valida
-- explicitamente que quem chama é o nutricionista responsável pelo paciente.
-- Isso também garante o critério de aceite "apenas o nutricionista responsável
-- pode excluir o paciente".

CREATE OR REPLACE FUNCTION public.soft_delete_paciente(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.pacientes
  SET deleted_at = now()
  WHERE id = p_id
    AND nutricionista_id = auth.uid()
    AND deleted_at IS NULL;

  -- Se nenhuma linha foi afetada, ou o paciente não existe, ou o solicitante
  -- não é o nutricionista responsável, ou já estava excluído.
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Paciente não encontrado ou acesso negado.'
      USING ERRCODE = '42501';
  END IF;
END;
$$;

-- Permite que usuários autenticados chamem a função (a validação de posse é
-- feita internamente pela própria função).
REVOKE ALL ON FUNCTION public.soft_delete_paciente(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.soft_delete_paciente(uuid) TO authenticated;
