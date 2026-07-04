# Tasks: Autenticação e Controle de Acesso

> Referências: Issue #7 | RF000 (RF015–RF019), HU-00 | RNF005 | ADR 0002, ADR 0003, ADR 0004, ADR 0005

## 1. Banco de Dados & Políticas RLS (Supabase)

- [x] 1.1 Atualizar a documentação do banco em `docs/database.md` com a coluna `usuario_id` na tabela `pacientes` e corrigir referências em `adesao_refeicoes`
- [x] 1.2 Executar script DDL SQL no Supabase para habilitar RLS e aplicar as políticas de segurança corrigidas para `profiles`, `pacientes`, `planos_alimentares`, `refeicoes`, `alimentos`, `adesao_refeicoes`, `medidas_corporais`, `historico_peso`, `anotacoes_clinicas` e `consultas`

## 2. Camada de Domínio (`src/model/`)

- [x] 2.1 Criar a entidade de usuário `User.ts` e o enum/type `UserRole` em `src/model/entities/User.ts`
- [x] 2.2 Definir a interface `IAuthService` em `src/model/services/IAuthService.ts` contendo os contratos de `login`, `register`, `logout` e `getCurrentUser`

## 3. Camada de Infraestrutura (`src/infra/`)

- [ ] 3.1 Implementar `UserMapper.ts` em `src/infra/auth/mappers/UserMapper.ts` para mapear os dados do Supabase Auth para a entidade `User` do domínio
- [ ] 3.2 Implementar o adaptador `SupabaseAuthService.ts` em `src/infra/auth/SupabaseAuthService.ts` que satisfaz a interface `IAuthService`

## 4. Camada de Casos de Uso (`src/usecase/`)

- [ ] 4.1 Implementar `LoginUseCase.ts` em `src/usecase/auth/LoginUseCase.ts`
- [ ] 4.2 Implementar `RegisterUseCase.ts` em `src/usecase/auth/RegisterUseCase.ts`
- [ ] 4.3 Implementar `GetCurrentUserUseCase.ts` em `src/usecase/auth/GetCurrentUserUseCase.ts`

## 5. Camada de Apresentação & Injeção de Dependências (ViewModel & React)

- [ ] 5.1 Registrar o `SupabaseAuthService`, Casos de Uso e ViewModels no container DI (`src/di/container.ts`)
- [ ] 5.2 Implementar `AuthViewModel.ts` em `src/viewmodel/auth/AuthViewModel.ts` gerenciando o estado reativo da sessão do usuário
- [ ] 5.3 Criar o componente `ProtectedRoute.tsx` em `src/app/components/ProtectedRoute.tsx` para interceptação e controle de acesso a rotas
- [ ] 5.4 Criar a página de login `LoginPage.tsx` em `src/app/pages/auth/LoginPage.tsx` com validação de campos e mensagens genéricas de erro
- [ ] 5.5 Configurar rotas e redirecionamento automático por perfil (`role === 'nutricionista'` $\rightarrow$ `/dashboard/pacientes`, `role === 'paciente'` $\rightarrow$ `/dieta`)
