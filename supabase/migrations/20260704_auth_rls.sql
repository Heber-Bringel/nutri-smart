-- Habilita extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela profiles (vinculada ao Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nome_completo TEXT NOT NULL,
    role TEXT NOT NULL CONSTRAINT chk_profiles_role CHECK (role IN ('nutricionista', 'paciente')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabela pacientes (com vínculo a usuario_id)
CREATE TABLE IF NOT EXISTS public.pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nutricionista_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nome_completo TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo_biologico TEXT NOT NULL CONSTRAINT chk_pacientes_sexo CHECK (sexo_biologico IN ('masculino', 'feminino')),
    peso_inicial NUMERIC(5,2) NOT NULL CONSTRAINT chk_pacientes_peso CHECK (peso_inicial > 0),
    altura NUMERIC(5,2) NOT NULL CONSTRAINT chk_pacientes_altura CHECK (altura > 0),
    nivel_atividade_fisica TEXT NOT NULL CONSTRAINT chk_pacientes_atividade CHECK (
        nivel_atividade_fisica IN (
            'sedentario',
            'levemente_ativo',
            'moderadamente_ativo',
            'muito_ativo',
            'extremamente_ativo'
        )
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabela planos_alimentares
CREATE TABLE IF NOT EXISTS public.planos_alimentares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    nutricionista_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ativo BOOLEAN NOT NULL DEFAULT true,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tabela refeicoes
CREATE TABLE IF NOT EXISTS public.refeicoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plano_alimentar_id UUID NOT NULL REFERENCES public.planos_alimentares(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 1,
    horario_sugerido TIME,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Tabela alimentos
CREATE TABLE IF NOT EXISTS public.alimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refeicao_id UUID NOT NULL REFERENCES public.refeicoes(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    quantidade NUMERIC(7,2) NOT NULL CONSTRAINT chk_alimentos_qtd CHECK (quantidade > 0),
    unidade_medida TEXT NOT NULL DEFAULT 'g',
    calorias NUMERIC(7,2) NOT NULL DEFAULT 0 CONSTRAINT chk_alimentos_cal CHECK (calorias >= 0),
    carboidratos NUMERIC(6,2) DEFAULT 0 CONSTRAINT chk_alimentos_carb CHECK (carboidratos >= 0),
    proteinas NUMERIC(6,2) DEFAULT 0 CONSTRAINT chk_alimentos_prot CHECK (proteinas >= 0),
    gorduras NUMERIC(6,2) DEFAULT 0 CONSTRAINT chk_alimentos_gord CHECK (gorduras >= 0)
);

-- 6. Tabela adesao_refeicoes
CREATE TABLE IF NOT EXISTS public.adesao_refeicoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refeicao_id UUID NOT NULL REFERENCES public.refeicoes(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    concluida BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unq_adesao_refeicao_data UNIQUE (refeicao_id, data)
);

-- 7. Tabela historico_peso
CREATE TABLE IF NOT EXISTS public.historico_peso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    peso NUMERIC(5,2) NOT NULL CONSTRAINT chk_historico_peso CHECK (peso > 0),
    data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Tabela medidas_corporais
CREATE TABLE IF NOT EXISTS public.medidas_corporais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    nutricionista_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    data_atendimento DATE NOT NULL DEFAULT CURRENT_DATE,
    circunferencia_cintura NUMERIC(5,2) CONSTRAINT chk_medidas_cintura CHECK (circunferencia_cintura >= 0),
    circunferencia_quadril NUMERIC(5,2) CONSTRAINT chk_medidas_quadril CHECK (circunferencia_quadril >= 0),
    circunferencia_braco NUMERIC(5,2) CONSTRAINT chk_medidas_braco CHECK (circunferencia_braco >= 0),
    circunferencia_coxa NUMERIC(5,2) CONSTRAINT chk_medidas_coxa CHECK (circunferencia_coxa >= 0),
    percentual_gordura NUMERIC(4,2) CONSTRAINT chk_medidas_gordura CHECK (percentual_gordura >= 0 AND percentual_gordura <= 100),
    dobras_cutaneas_mm NUMERIC(5,2) CONSTRAINT chk_medidas_dobras CHECK (dobras_cutaneas_mm >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Tabela anotacoes_clinicas (LGPD - Restrito ao nutricionista)
CREATE TABLE IF NOT EXISTS public.anotacoes_clinicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    nutricionista_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    data_atendimento DATE NOT NULL DEFAULT CURRENT_DATE,
    conteudo TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Tabela consultas
CREATE TABLE IF NOT EXISTS public.consultas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nutricionista_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    duracao_minutos INTEGER NOT NULL DEFAULT 60 CONSTRAINT chk_consultas_duracao CHECK (duracao_minutos > 0),
    horario_fim TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'agendada' CONSTRAINT chk_consultas_status CHECK (status IN ('agendada', 'realizada', 'cancelada')),
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilita RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_alimentares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refeicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adesao_refeicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_peso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medidas_corporais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anotacoes_clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS: profiles
DROP POLICY IF EXISTS "profiles_select_self" ON public.profiles;
CREATE POLICY "profiles_select_self" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- POLÍTICAS: pacientes
DROP POLICY IF EXISTS "pacientes_nutricionista_all" ON public.pacientes;
CREATE POLICY "pacientes_nutricionista_all" ON public.pacientes 
    FOR ALL USING (auth.uid() = nutricionista_id);

DROP POLICY IF EXISTS "pacientes_self_select" ON public.pacientes;
CREATE POLICY "pacientes_self_select" ON public.pacientes 
    FOR SELECT USING (auth.uid() = usuario_id);

-- POLÍTICAS: planos_alimentares
DROP POLICY IF EXISTS "planos_nutricionista_all" ON public.planos_alimentares;
CREATE POLICY "planos_nutricionista_all" ON public.planos_alimentares 
    FOR ALL USING (auth.uid() = nutricionista_id);

DROP POLICY IF EXISTS "planos_paciente_select" ON public.planos_alimentares;
CREATE POLICY "planos_paciente_select" ON public.planos_alimentares 
    FOR SELECT USING (
        paciente_id IN (SELECT id FROM public.pacientes WHERE usuario_id = auth.uid())
    );

-- POLÍTICAS: refeicoes e alimentos
DROP POLICY IF EXISTS "refeicoes_nutricionista_all" ON public.refeicoes;
CREATE POLICY "refeicoes_nutricionista_all" ON public.refeicoes 
    FOR ALL USING (
        plano_alimentar_id IN (SELECT id FROM public.planos_alimentares WHERE nutricionista_id = auth.uid())
    );

DROP POLICY IF EXISTS "refeicoes_paciente_select" ON public.refeicoes;
CREATE POLICY "refeicoes_paciente_select" ON public.refeicoes 
    FOR SELECT USING (
        plano_alimentar_id IN (
            SELECT p.id FROM public.planos_alimentares p
            JOIN public.pacientes pac ON p.paciente_id = pac.id
            WHERE pac.usuario_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "alimentos_nutricionista_all" ON public.alimentos;
CREATE POLICY "alimentos_nutricionista_all" ON public.alimentos 
    FOR ALL USING (
        refeicao_id IN (
            SELECT r.id FROM public.refeicoes r 
            JOIN public.planos_alimentares p ON r.plano_alimentar_id = p.id 
            WHERE p.nutricionista_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "alimentos_paciente_select" ON public.alimentos;
CREATE POLICY "alimentos_paciente_select" ON public.alimentos 
    FOR SELECT USING (
        refeicao_id IN (
            SELECT r.id FROM public.refeicoes r
            JOIN public.planos_alimentares p ON r.plano_alimentar_id = p.id
            JOIN public.pacientes pac ON p.paciente_id = pac.id
            WHERE pac.usuario_id = auth.uid()
        )
    );

-- POLÍTICAS: adesao_refeicoes
DROP POLICY IF EXISTS "adesao_paciente_all" ON public.adesao_refeicoes;
CREATE POLICY "adesao_paciente_all" ON public.adesao_refeicoes 
    FOR ALL USING (
        paciente_id IN (SELECT id FROM public.pacientes WHERE usuario_id = auth.uid())
    );

DROP POLICY IF EXISTS "adesao_nutricionista_select" ON public.adesao_refeicoes;
CREATE POLICY "adesao_nutricionista_select" ON public.adesao_refeicoes 
    FOR SELECT USING (
        refeicao_id IN (
            SELECT r.id FROM public.refeicoes r 
            JOIN public.planos_alimentares p ON r.plano_alimentar_id = p.id 
            WHERE p.nutricionista_id = auth.uid()
        )
    );

-- POLÍTICAS: medidas_corporais e historico_peso
DROP POLICY IF EXISTS "medidas_nutricionista_all" ON public.medidas_corporais;
CREATE POLICY "medidas_nutricionista_all" ON public.medidas_corporais 
    FOR ALL USING (auth.uid() = nutricionista_id);

DROP POLICY IF EXISTS "medidas_paciente_select" ON public.medidas_corporais;
CREATE POLICY "medidas_paciente_select" ON public.medidas_corporais 
    FOR SELECT USING (
        paciente_id IN (SELECT id FROM public.pacientes WHERE usuario_id = auth.uid())
    );

DROP POLICY IF EXISTS "historico_peso_nutricionista_all" ON public.historico_peso;
CREATE POLICY "historico_peso_nutricionista_all" ON public.historico_peso 
    FOR ALL USING (
        paciente_id IN (SELECT id FROM public.pacientes WHERE nutricionista_id = auth.uid())
    );

DROP POLICY IF EXISTS "historico_peso_paciente_select" ON public.historico_peso;
CREATE POLICY "historico_peso_paciente_select" ON public.historico_peso 
    FOR SELECT USING (
        paciente_id IN (SELECT id FROM public.pacientes WHERE usuario_id = auth.uid())
    );

-- POLÍTICAS: anotacoes_clinicas (SIGILO ABSOLUTO LGPD ART. 11 - Apenas o Nutricionista acessa)
DROP POLICY IF EXISTS "anotacoes_nutricionista_only" ON public.anotacoes_clinicas;
CREATE POLICY "anotacoes_nutricionista_only" ON public.anotacoes_clinicas 
    FOR ALL USING (auth.uid() = nutricionista_id);

-- POLÍTICAS: consultas
DROP POLICY IF EXISTS "consultas_nutricionista_all" ON public.consultas;
CREATE POLICY "consultas_nutricionista_all" ON public.consultas 
    FOR ALL USING (auth.uid() = nutricionista_id);

DROP POLICY IF EXISTS "consultas_paciente_select" ON public.consultas;
CREATE POLICY "consultas_paciente_select" ON public.consultas 
    FOR SELECT USING (
        paciente_id IN (SELECT id FROM public.pacientes WHERE usuario_id = auth.uid())
    );
