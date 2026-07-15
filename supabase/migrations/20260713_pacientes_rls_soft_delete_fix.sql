-- Correção de RLS da tabela pacientes para permitir o soft delete.
--
-- Problema: a policy `pacientes_nutricionista_all` (FOR ALL) usava
-- `USING (auth.uid() = nutricionista_id AND deleted_at IS NULL)`. Como uma
-- policy FOR ALL sem WITH CHECK explícito reaproveita a expressão do USING
-- como WITH CHECK, o soft delete (que grava `deleted_at` NÃO nulo) violava a
-- checagem `deleted_at IS NULL`, resultando em erro 42501
-- ("new row violates row-level security policy").
--
-- Solução: separar as policies por comando. O SELECT continua escondendo os
-- pacientes excluídos; o UPDATE permite gravar `deleted_at` desde que o
-- solicitante seja o nutricionista responsável.

-- Remove as policies antigas conflitantes.
DROP POLICY IF EXISTS "pacientes_nutricionista_all" ON public.pacientes;
DROP POLICY IF EXISTS "pacientes_nutricionista_soft_delete" ON public.pacientes;
DROP POLICY IF EXISTS "pacientes_self_select" ON public.pacientes;

-- SELECT: nutricionista responsável vê apenas pacientes não excluídos.
CREATE POLICY "pacientes_nutricionista_select" ON public.pacientes
    FOR SELECT USING (
        auth.uid() = nutricionista_id
        AND deleted_at IS NULL
    );

-- INSERT: nutricionista só cria pacientes vinculados a si mesmo.
CREATE POLICY "pacientes_nutricionista_insert" ON public.pacientes
    FOR INSERT WITH CHECK (auth.uid() = nutricionista_id);

-- UPDATE: nutricionista responsável pode atualizar seus pacientes, inclusive
-- marcar `deleted_at` (soft delete). Sem restrição de deleted_at no WITH CHECK.
CREATE POLICY "pacientes_nutricionista_update" ON public.pacientes
    FOR UPDATE USING (auth.uid() = nutricionista_id)
    WITH CHECK (auth.uid() = nutricionista_id);

-- DELETE: nutricionista responsável pode remover fisicamente seus pacientes
-- (usado, por exemplo, pela rotina de purge da LGPD).
CREATE POLICY "pacientes_nutricionista_delete" ON public.pacientes
    FOR DELETE USING (auth.uid() = nutricionista_id);

-- SELECT do próprio paciente (acesso do usuário paciente ao seu registro),
-- também escondendo registros excluídos.
CREATE POLICY "pacientes_self_select" ON public.pacientes
    FOR SELECT USING (
        auth.uid() = usuario_id
        AND deleted_at IS NULL
    );
