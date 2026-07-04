## ADDED Requirements

### Requirement: Automação da criação de perfil via Trigger PostgreSQL
O sistema MUST disparar uma função em PostgreSQL (`handle_new_user()`) no schema `public` imediatamente após qualquer novo usuário ser inserido na tabela `auth.users`, criando a linha espelho na tabela `public.profiles` com os dados de `id`, `email`, `nome_completo` e `role`.

#### Scenario: Criação automática de perfil ao registrar usuário no Supabase Auth
- **GIVEN** que um usuário faz cadastro informando e-mail, senha, nome completo e a role desejada
- **WHEN** a requisição de cadastro insere uma nova linha na tabela `auth.users`
- **THEN** o Trigger PostgreSQL executa a função `handle_new_user()` e insere automaticamente a linha correspondente em `public.profiles` sem necessidade de requisição adicional no client-side
- **AND** a política RLS `profiles_select_self` permite que o usuário leia seu próprio perfil (`auth.uid() = id`)

### Requirement: Inclusão do campo de e-mail na tabela de pacientes
A tabela `public.pacientes` MUST possuir a coluna `email VARCHAR(255)` permitindo ao nutricionista informar o e-mail do paciente para vinculação e criação de conta.

#### Scenario: Cadastro de paciente pelo nutricionista informando e-mail
- **GIVEN** que o nutricionista autenticado está preenchendo o formulário de cadastro de paciente
- **WHEN** o nutricionista informa os dados antropométricos e o e-mail do paciente
- **THEN** o e-mail é persistido na tabela `public.pacientes` e fica disponível para associação com `usuario_id` da tabela `profiles`
- **AND** as políticas RLS `pacientes_nutricionista_all` e `pacientes_self_select` garantem que apenas o nutricionista responsável e o próprio paciente (quando vinculado) tenham permissão de acesso aos dados do paciente
