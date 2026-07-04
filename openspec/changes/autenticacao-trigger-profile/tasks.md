## 1. Migração de Banco de Dados

- [x] 1.1 Criar a função SQL `handle_new_user()` e o Trigger `on_auth_user_created` no esquema `public`
- [x] 1.2 Adicionar a coluna `email` na tabela `public.pacientes`
- [x] 1.3 Atualizar o documento `docs/database.md` com o esquema físico revisado e o script SQL do Trigger

## 2. Refatoração da Camada de Infra (Adapter)

- [ ] 2.1 Refatorar `src/infra/auth/SupabaseAuthService.ts` removendo o comando manual `supabase.from('profiles').insert()`
- [ ] 2.2 Garantir a transmissão de metadados (`nome_completo` e `role`) no parâmetro `options.data` do método `signUp()`

## 3. Validação e Qualidade

- [ ] 3.1 Testar fluxo de cadastro e login sem violações de RLS
- [ ] 3.2 Executar build e validação técnica da aplicação
