-- Migration: alimentos_base table + RLS + seed

-- 1. Tabela alimentos_base (base sistêmica + customizados do nutricionista)
CREATE TABLE IF NOT EXISTS public.alimentos_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    porcao NUMERIC(7,2) NOT NULL DEFAULT 100 CONSTRAINT chk_ab_porcao CHECK (porcao > 0),
    unidade_medida TEXT NOT NULL DEFAULT 'g',
    calorias NUMERIC(7,2) NOT NULL DEFAULT 0 CONSTRAINT chk_ab_cal CHECK (calorias >= 0),
    carboidratos NUMERIC(6,2) NOT NULL DEFAULT 0 CONSTRAINT chk_ab_carb CHECK (carboidratos >= 0),
    proteinas NUMERIC(6,2) NOT NULL DEFAULT 0 CONSTRAINT chk_ab_prot CHECK (proteinas >= 0),
    gorduras NUMERIC(6,2) NOT NULL DEFAULT 0 CONSTRAINT chk_ab_gord CHECK (gorduras >= 0),
    nutricionista_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. RLS
ALTER TABLE public.alimentos_base ENABLE ROW LEVEL SECURITY;

-- Nutricionista SELECT: vê alimentos sistêmicos (nutricionista_id IS NULL) + seus próprios
DROP POLICY IF EXISTS "ab_nutricionista_select" ON public.alimentos_base;
CREATE POLICY "ab_nutricionista_select" ON public.alimentos_base
    FOR SELECT USING (
        nutricionista_id IS NULL OR auth.uid() = nutricionista_id
    );

-- Nutricionista INSERT/UPDATE/DELETE: apenas seus próprios alimentos customizados
DROP POLICY IF EXISTS "ab_nutricionista_insert" ON public.alimentos_base;
CREATE POLICY "ab_nutricionista_insert" ON public.alimentos_base
    FOR INSERT WITH CHECK (auth.uid() = nutricionista_id);

DROP POLICY IF EXISTS "ab_nutricionista_update" ON public.alimentos_base;
CREATE POLICY "ab_nutricionista_update" ON public.alimentos_base
    FOR UPDATE USING (auth.uid() = nutricionista_id);

DROP POLICY IF EXISTS "ab_nutricionista_delete" ON public.alimentos_base;
CREATE POLICY "ab_nutricionista_delete" ON public.alimentos_base
    FOR DELETE USING (auth.uid() = nutricionista_id);

-- 3. Seed de alimentos base sistêmicos (nutricionista_id = NULL)
INSERT INTO public.alimentos_base (nome, porcao, unidade_medida, calorias, carboidratos, proteinas, gorduras) VALUES
    ('Arroz branco cozido', 100, 'g', 130, 28.1, 2.7, 0.3),
    ('Arroz integral cozido', 100, 'g', 124, 25.8, 2.6, 1.0),
    ('Feijão preto cozido', 100, 'g', 77, 14.0, 4.5, 0.5),
    ('Feijão carioca cozido', 100, 'g', 76, 13.6, 4.8, 0.5),
    ('Frango grelhado', 100, 'g', 165, 0.0, 31.0, 3.6),
    ('Peito de frango cozido', 100, 'g', 150, 0.0, 32.0, 2.0),
    ('Carne moída cozida', 100, 'g', 215, 0.0, 26.0, 12.0),
    ('Bife grelhado', 100, 'g', 190, 0.0, 28.0, 8.0),
    ('Ovo cozido', 100, 'g', 155, 1.1, 13.0, 11.0),
    ('Ovo frito', 100, 'g', 196, 1.4, 13.6, 15.0),
    ('Batata cozida', 100, 'g', 87, 20.1, 1.9, 0.1),
    ('Batata doce cozida', 100, 'g', 86, 20.1, 1.6, 0.1),
    ('Macarrão cozido', 100, 'g', 131, 25.0, 5.0, 1.1),
    ('Macarrão integral cozido', 100, 'g', 124, 26.0, 5.3, 0.5),
    ('Pão francês', 50, 'g', 135, 25.0, 4.5, 1.5),
    ('Pão integral', 50, 'g', 110, 20.0, 4.0, 1.5),
    ('Leite integral', 200, 'ml', 120, 9.6, 6.4, 6.4),
    ('Leite desnatado', 200, 'ml', 70, 9.6, 6.8, 0.4),
    ('Iogurte natural', 200, 'g', 120, 8.0, 9.0, 5.0),
    ('Queijo minas frescal', 50, 'g', 85, 1.5, 7.0, 6.0),
    ('Mussarela', 50, 'g', 140, 1.0, 10.0, 11.0),
    ('Banana prata', 100, 'g', 89, 23.0, 1.1, 0.3),
    ('Banana nanica', 100, 'g', 92, 23.8, 1.4, 0.1),
    ('Maçã', 100, 'g', 52, 14.0, 0.3, 0.2),
    ('Laranja', 100, 'g', 47, 11.8, 0.9, 0.1),
    ('Mamão', 100, 'g', 43, 10.8, 0.5, 0.1),
    ('Abacate', 100, 'g', 160, 8.5, 2.0, 14.7),
    ('Tomate', 100, 'g', 18, 3.9, 0.9, 0.2),
    ('Alface crespa', 100, 'g', 15, 2.9, 1.4, 0.2),
    ('Couve manteiga', 100, 'g', 30, 5.0, 2.5, 0.5),
    ('Brócolis cozido', 100, 'g', 35, 7.2, 2.4, 0.4),
    ('Cenoura crua', 100, 'g', 41, 9.6, 0.9, 0.2),
    ('Azeite de oliva', 15, 'ml', 119, 0.0, 0.0, 13.5),
    ('Manteiga', 10, 'g', 72, 0.0, 0.1, 8.0),
    ('Arroz doce', 100, 'g', 112, 22.0, 2.5, 1.5),
    ('Farinha de mandioca', 100, 'g', 360, 85.0, 1.5, 0.5),
    ('Farinha de trigo', 100, 'g', 364, 76.3, 10.3, 1.0),
    ('Aveia em flocos', 40, 'g', 155, 27.0, 5.5, 3.0),
    ('Granola', 40, 'g', 170, 30.0, 4.0, 4.5),
    ('Mel', 20, 'g', 61, 16.6, 0.0, 0.0),
    ('Açúcar refinado', 10, 'g', 39, 10.0, 0.0, 0.0),
    ('Suco de laranja natural', 200, 'ml', 86, 20.0, 1.2, 0.2),
    ('Café preto sem açúcar', 50, 'ml', 2, 0.0, 0.1, 0.0),
    ('Chá verde', 200, 'ml', 2, 0.0, 0.0, 0.0),
    ('Salmão grelhado', 100, 'g', 208, 0.0, 20.0, 13.0),
    ('Atum em lata (água)', 100, 'g', 116, 0.0, 26.0, 0.8),
    ('Sardinha em óleo', 100, 'g', 208, 0.0, 24.0, 11.0),
    ('Lentilha cozida', 100, 'g', 116, 20.1, 9.0, 0.4),
    ('Grão de bico cozido', 100, 'g', 139, 22.5, 7.6, 2.0),
    ('Quinoa cozida', 100, 'g', 120, 21.3, 4.4, 1.9)
ON CONFLICT DO NOTHING;
