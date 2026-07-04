## Context

Na arquitetura do NutriSmart, a autenticação e controle de acesso são suportados pelo **Supabase Auth** e estruturados segundo o **ADR 0004**. A camada de infraestrutura expõe o `SupabaseAuthService`, que implementa a interface de domínio `IAuthService`.

Atualmente, ao registrar um novo usuário via `SupabaseAuthService.register()`, o código tentava realizar uma chamada direta `supabase.from('profiles').insert()`. Como o Row Level Security (RLS) está ativado em `public.profiles` e não existe política de `INSERT` concedida para requisições anônimas/client-side, essa abordagem causa erro de RLS.

Além disso, a tabela `pacientes` necessita do campo `email` para armazenar a informação de contato e permitir que o paciente, ao criar sua conta no sistema, seja associado via `usuario_id`.

## Goals / Non-Goals

**Goals:**
- Implementar uma função e Trigger PostgreSQL (`handle_new_user()`) no Supabase que leia o `raw_user_meta_data` do novo usuário em `auth.users` e crie a linha espelho em `public.profiles` de forma atômica e com privilégio `SECURITY DEFINER`.
- Adicionar a coluna `email` na tabela `public.pacientes`.
- Atualizar o `SupabaseAuthService` (infra/adapter) para descontinuar o comando de `insert` manual em `profiles`.
- Atualizar o documento [database.md](file:///c:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/database.md) com as definições físicas atualizadas.

**Non-Goals:**
- Alterar as telas de frontend do Épico 1 nesta change (a UI do cadastro de paciente utilizará a nova coluna de e-mail na implementação das histórias do Épico 1).
- Introduzir convites de e-mail via servidor SMTP externo (o envio de link de confirmação/redefinição utiliza a infraestrutura nativa do Supabase Auth).

## Decisions

### Decisão 1: Utilização de Trigger PostgreSQL `SECURITY DEFINER` para `public.profiles`
- **Contexto:** A tabela `profiles` possui RLS ativado (`profiles_select_self`, `profiles_update_self`).
- **Escolha:** Criar a função `public.handle_new_user()` com a cláusula `SECURITY DEFINER` e associá-la ao evento `AFTER INSERT` na tabela `auth.users`.
- **Alternativas consideradas:** 
  - *Criar política de INSERT RLS aberta em `profiles`:* Rejeitada por violar o princípio de privilégio mínimo e expor a tabela a inserções arbitrárias pelo client-side.
  - *Usar a `service_role` key no frontend:* Rejeitada por ser uma grave vulnerabilidade de segurança (a `service_role` key nunca deve estar em código cliente).

```sql
-- Trigger SQL no PostgreSQL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome_completo, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'paciente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Decisão 2: Inclusão de `email` na tabela `pacientes`
- **Escolha:** Executar `ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS email VARCHAR(255);`.
- **Razão:** Permite que o nutricionista registre o e-mail do paciente na criação do prontuário, servindo de chave para a vinculação com `usuario_id` quando a conta de paciente for ativada.

### Decisão 3: Manutenção do contrato `IAuthService` (ADR 0004)
- **Escolha:** Nenhuma alteração na interface `IAuthService` ou nas entidades de domínio (`User`). O adapter `SupabaseAuthService` continua implementando `IAuthService`, apenas eliminando a redundância do `insert` em `profiles`.

## Risks / Trade-offs

- **[Risco] Supabase Auth Metadata ausente no signup:** Se a chamada `signUp()` não enviar `nome_completo` ou `role` em `options.data`, a função `handle_new_user()` insere valores padrão (`'Usuário'` e `'paciente'`).
  - *Mitigação:* `SupabaseAuthService` garante a passagem dos metadados no parâmetro `options.data` do `signUp()`.
- **[Risco] Reexecução de scripts de banco em desenvolvimento:**
  - *Mitigação:* Uso das cláusulas `OR REPLACE` no Trigger e `IF NOT EXISTS` na alteração de coluna SQL.

## Migration Plan

1. Executar a migração SQL no SQL Editor do Dashboard do Supabase (ou CLI de migração).
2. Atualizar o arquivo `src/infra/auth/SupabaseAuthService.ts`.
3. Atualizar a documentação em `docs/database.md`.
