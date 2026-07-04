## Why

Atualmente, ao cadastrar um usuário no Supabase Auth (`auth.users`), a tentativa de criação do perfil público em `public.profiles` realizada diretamente pelo client-side via `supabase.from('profiles').insert()` falha devido às políticas restritivas de Row Level Security (RLS) sem permissão de INSERT direto para usuários anônimos ou recém-criados. 

Além disso, para permitir que o nutricionista registre o e-mail de um paciente e este consiga definir sua senha e ativar sua conta via link de confirmação/redefinição de senha, é necessário automatizar o espelhamento de perfis no banco de dados e incluir o campo de e-mail na tabela de pacientes.

Esta alteração atende aos requisitos **RF015** (Cadastro de Usuários), **RF018** (Controle de Perfis) e **RF001 / HU-02** (Cadastro de Pacientes), solucionando a Issue #14.

## What Changes

- **Trigger SQL em PostgreSQL:** Criação da função `handle_new_user()` e do gatilho `on_auth_user_created` no esquema `public` para popular `profiles` automaticamente após cada inserção em `auth.users`.
- **Schema da tabela `pacientes`:** Inclusão da coluna `email VARCHAR(255)` na tabela `pacientes`.
- **Refatoração no Infra Adapter:** Atualização do `SupabaseAuthService.ts` para descontinuar o comando manual `supabase.from('profiles').insert()` no método `register`.
- **Documentação do Banco (`database.md`):** Atualização do esquema conceitual, físico e lista de triggers/RLS no repositório.

## Capabilities

### New Capabilities
- `auth-profile-trigger`: Automação da criação de perfis em `public.profiles` via PostgreSQL Trigger e suporte ao e-mail de vinculação do paciente.

### Modified Capabilities
- Nenhuma funcionalidade existente alterada no nível de especificação de requisitos funcionais da ERS v1.1.

## Impact

- **Banco de Dados (Supabase/PostgreSQL):** Função e Trigger adicionados ao esquema `public`, coluna `email` na tabela `pacientes`.
- **Código do Frontend/Infra:** `src/infra/auth/SupabaseAuthService.ts` refatorado para confiar no Trigger do banco.
- **Documentação:** `docs/database.md` atualizado com o script de migração.
