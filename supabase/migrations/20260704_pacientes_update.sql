-- Adiciona colunas faltantes na tabela pacientes
ALTER TABLE public.pacientes 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS imc NUMERIC(4,2),
  ADD COLUMN IF NOT EXISTS tmb NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS "get" NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Trigger para espelhar paciente no profiles quando ele confirma e-mail
CREATE OR REPLACE FUNCTION public.handle_paciente_invite()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.pacientes
  SET usuario_id = NEW.id
  WHERE email = NEW.email
    AND usuario_id IS NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_paciente ON auth.users;
CREATE TRIGGER on_auth_user_created_paciente
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_paciente_invite();

-- Função para purge de registros com deleted_at > 90 dias (LGPD Art. 18)
CREATE OR REPLACE FUNCTION public.purge_pacientes_excluidos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.pacientes
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Política para soft delete (nutricionista pode "excluir" logicamente)
DROP POLICY IF EXISTS "pacientes_nutricionista_all" ON public.pacientes;
CREATE POLICY "pacientes_nutricionista_all" ON public.pacientes 
    FOR ALL USING (
      auth.uid() = nutricionista_id 
      AND deleted_at IS NULL
    );

-- Política para update de soft delete (nutricionista pode definir deleted_at)
DROP POLICY IF EXISTS "pacientes_nutricionista_soft_delete" ON public.pacientes;
CREATE POLICY "pacientes_nutricionista_soft_delete" ON public.pacientes 
    FOR UPDATE USING (auth.uid() = nutricionista_id)
    WITH CHECK (auth.uid() = nutricionista_id);
