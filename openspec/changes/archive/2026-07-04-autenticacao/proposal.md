# Proposal: Autenticação e Controle de Acesso

> Referências: Issue #7 | RF000 (RF015–RF019), HU-00 | ADR 0004

## Why

A introdução de autenticação e controle de acesso é fundamental para proteger dados clínicos sensíveis, individualizar históricos alimentares e garantir a privacidade de nutricionistas e pacientes no NutriSmart. Atualmente, o sistema precisa controlar o acesso para garantir que nutricionistas acessem apenas seus próprios pacientes e pacientes visualizem exclusivamente suas dietas prescritas (ADR 0004).

## What Changes

- **Formulário de Login:** Interface com validação de formato de e-mail e senha (RF000).
- **Tratamento Seguro de Erros:** Credenciais inválidas exibem mensagem genérica de erro sem expor se o e-mail ou a senha está incorreto.
- **Redirecionamento baseado em Perfil (Role-Based Routing):**
  - Nutricionistas são redirecionados para o painel de gerenciamento de pacientes.
  - Pacientes são redirecionados para a área de acompanhamento de dieta.
- **Gerenciamento de Sessão:** Persistência de sessão JWT via Supabase Auth entre abas do navegador (RNF005).
- **Segurança de Dados (RLS):** Aplicação de políticas de Row Level Security (RLS) no PostgreSQL/Supabase.
- **Desacoplamento Arquitetural (Clean Architecture + MVVM):**
  - Contrato/Interface `IAuthService` em `src/model/services/`.
  - Implementação `SupabaseAuthService` em `src/infra/auth/`.
  - Casos de Uso `LoginUseCase`, `RegisterUseCase`, `GetCurrentUserUseCase` em `src/usecase/auth/`.

## Capabilities

### New Capabilities
- `auth`: Sistema de autenticação, gerenciamento de sessão de usuário e controle de rotas por perfil de acesso (Nutricionista / Paciente).

### Modified Capabilities
*(Nenhuma funcionalidade existente teve seus requisitos alterados)*

## Impact

- **Frontend / Interface (`src/app/`):** Novas páginas e componentes de Login e proteção de rotas (`ProtectedRoute`).
- **ViewModel (`src/viewmodel/`):** ViewModel de autenticação para controle de estado da sessão na UI.
- **Casos de Uso (`src/usecase/`):** `LoginUseCase`, `RegisterUseCase`, `GetCurrentUserUseCase`.
- **Domínio (`src/model/`):** Interface `IAuthService` e entidade `User` / `Session`.
- **Infraestrutura (`src/infra/`):** `SupabaseAuthService` integrando com SDK Supabase Auth.
- **Banco de Dados:** Configuração de políticas de RLS nas tabelas do Supabase.
