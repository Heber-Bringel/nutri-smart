## Why

Atualmente, o projeto não possui validação de formulários estruturada e executa os UseCases (da injeção de dependências) diretamente na camada de visualização, acoplando a lógica de negócios com a apresentação. A introdução de React Hook Form e Zod proverá validação robusta dos dados de entrada (cumprindo requisitos do Trabalho Final). Adicionalmente, a extração dessa lógica para custom hooks dedicados (ex: `usePacientes`, `useAgenda`) consolidará a camada ViewModel, desacoplando completamente a UI do domínio e isolando os SDKs.

## What Changes

- Instalação das bibliotecas `react-hook-form`, `zod` e `@hookform/resolvers`.
- Criação de esquemas (schemas) de validação do Zod para os formulários principais, como Login (`LoginPage.tsx`) e Cadastro de Pacientes (`PatientForm.tsx`).
- Refatoração dos componentes de formulário existentes para utilizarem a integração Zod + React Hook Form.
- Criação de hooks de apresentação/consumo de dados (ex: `usePacientes` e `useAgenda`) para gerenciar estados como carregamento, erros, exclusões e paginação.
- Substituição da execução direta de UseCases nas Views para a chamada dos novos custom hooks, alinhando com a arquitetura definida (Clean Architecture + MVVM).
- **BREAKING**: Componentes de UI não acessarão mais UseCases diretamente e dependerão estritamente dos hooks.

## Capabilities

### New Capabilities
- `form-validation`: Validação padronizada e segura de formulários do lado do cliente utilizando React Hook Form integrado com schemas Zod.
- `presentation-hooks`: Centralização do consumo de dados (UseCases) em hooks personalizados dedicados a conectar a UI aos serviços de domínio.

### Modified Capabilities

## Impact

- **UI / Telas:** Componentes como `LoginPage`, `PatientForm` e demais telas que manipulam dados (como agenda) serão modificados para remover acoplamento.
- **Arquitetura (View/ViewModel):** Melhor definição das fronteiras de responsabilidade. As lógicas de loading e submit ficarão nos hooks.
- **Dependências:** Adição de `react-hook-form`, `zod` e `@hookform/resolvers` nas dependências do projeto.
