# Design Técnico: Autenticação e Controle de Acesso

> Referências: Issue #7 | RF000 (RF015–RF019), HU-00 | RNF005 | ADR 0002, ADR 0003, ADR 0004, ADR 0005

## Context

Atualmente, o NutriSmart não possui mecanismo de controle de login e permissões. Conforme estabelecido na ADR 0004, há necessidade imediata de proteger dados clínicos sensíveis, individualizar perfis de usuário (Nutricionista vs. Paciente) e garantir que a consulta de dados reflita a identidade autenticada.

A arquitetura do projeto segue **Clean Architecture + MVVM** (ADR 0002). O provedor de autenticação escolhido foi o **Supabase Auth** (ADR 0003, ADR 0004). O desacoplamento do SDK nativo deve ser mantido através de padrões de projeto GoF (Adapter e Factory) (ADR 0005).

## Goals / Non-Goals

**Goals:**
- Implementar o fluxo completo de login via Supabase Auth (e-mail/senha).
- Isolar a biblioteca externa (`@supabase/supabase-js`) na camada `infra/` através do adaptador `SupabaseAuthService` e da interface `IAuthService` na camada `model/services/`.
- Prover Casos de Uso (`LoginUseCase`, `RegisterUseCase`, `GetCurrentUserUseCase`) desacoplados da UI.
- Gerenciar estado global da sessão via ViewModel / Context reactivo no Frontend.
- Proteger rotas no React (redirecionando Nutricionista para `/dashboard/pacientes` e Paciente para `/dieta`).
- Configurar políticas de Row Level Security (RLS) no PostgreSQL/Supabase para isolamento de dados por perfil.

**Non-Goals:**
- Integração com provedores sociais OAuth (Google, Apple, etc.) - Candidato a v2.
- Autenticação de dois fatores (2FA/MFA) - Candidato a v2.
- Integração com WhatsApp/SMS para recuperação de senha - Candidato a v2 (explicitamente fora do escopo do MVP no PRD).

## Decisions

### 1. Padrão Adapter & Factory para Autenticação (ADR 0002, ADR 0004, ADR 0005)
- **Decisão:** Criar a interface de domínio `IAuthService` em `src/model/services/IAuthService.ts` e a implementação `SupabaseAuthService` em `src/infra/auth/SupabaseAuthService.ts`. O contêiner de Injeção de Dependências em `src/di/` instanciará a implementação apropriada.
- **Alternativa Considerada:** Usar a biblioteca `@supabase/supabase-js` diretamente nos componentes React ou nos ViewModels.
- **Justificativa:** Viola a Clean Architecture. Se o provedor de auth mudar no futuro, a lógica de domínio e apresentação não será impactada.

### 2. Casos de Uso e MVVM (ADR 0002)
- **Decisão:** Criar `LoginUseCase`, `RegisterUseCase` e `GetCurrentUserUseCase` na camada `src/usecase/auth/`. O `AuthViewModel` consumirá esses Casos de Uso para expor estados e ações reativas para os componentes React em `src/app/pages/auth/`.
- **Alternativa Considerada:** Chamar `IAuthService` diretamente da View.
- **Justificativa:** O padrão MVVM exige a separação da lógica de apresentação (estado de carregamento, validação visual) da regra de negócio (Casos de Uso).

### 3. Configuração de Row Level Security (RLS) no Supabase (ADR 0004)
- **Decisão:** Ativar RLS nas tabelas `patients`, `diets` e `clinical_records`.
  - Política para `patients`: `auth.uid() = nutritionist_id`
  - Política para `diets`: `auth.uid() = patient_id OR auth.uid() IN (SELECT nutritionist_id FROM patients WHERE id = diets.patient_id)`
- **Alternativa Considerada:** Filtrar dados exclusivamente na camada de aplicação (frontend/backend).
- **Justificativa:** Filtragem no cliente não previne vazamento de dados via requisições diretas de API. RLS garante a segurança diretamente na camada de banco de dados.

### 4. Estrutura de Arquivos e Pastas

```
src/
├── model/
│   ├── entities/
│   │   └── User.ts
│   └── services/
│       └── IAuthService.ts
├── infra/
│   └── auth/
│       ├── SupabaseAuthService.ts
│       └── mappers/
│           └── UserMapper.ts
├── usecase/
│   └── auth/
│       ├── LoginUseCase.ts
│       ├── RegisterUseCase.ts
│       └── GetCurrentUserUseCase.ts
├── viewmodel/
│   └── auth/
│       └── AuthViewModel.ts
├── app/
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   └── pages/
│       └── auth/
│           └── LoginPage.tsx
└── di/
    └── container.ts
```

## Risks / Trade-offs

- **[Risco] Incompatibilidade ou divergência no estado da sessão durante navegação multi-abas**  
  $\rightarrow$ **Mitigação:** Utilizar o listener nativo `onAuthStateChange` do Supabase dentro do `SupabaseAuthService` para notificar a aplicação reativamente sobre mudanças de sessão.
- **[Risco] Vazamento de dados em tabelas sem políticas RLS configuradas**  
  $\rightarrow$ **Mitigação:** Escrever scripts de migração SQL explícitos habilitando `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` para todas as tabelas clínicas.

## Migration Plan

1. Executar scripts SQL no Supabase para criação da tabela de perfis/funções e habilitação de RLS.
2. Implementar `User` (entidade) e `IAuthService` (interface no domínio).
3. Implementar `SupabaseAuthService` e `UserMapper` na infraestrutura.
4. Implementar `LoginUseCase`, `RegisterUseCase` e `GetCurrentUserUseCase`.
5. Implementar `AuthViewModel` e registrar as dependências no DI Container.
6. Criar os componentes React (`LoginPage`, `ProtectedRoute`) e atualizar o roteador da aplicação.

## Open Questions

- Nenhuma pendência aberta no momento (alinhado com ADR 0004 e ERS v1.1).
