## ADDED Requirements

### Requirement: Validação estruturada de formulários
O sistema SHALL aplicar validações estritas usando `zod` em conjunto com `react-hook-form` nos campos de formulários da aplicação (ex: Login, Cadastro de Paciente, Agendamento).

#### Scenario: Submissão com campos inválidos
- **GIVEN** o usuário (nutricionista ou paciente) acessa um formulário
- **WHEN** o usuário tenta submeter o formulário com dados ausentes ou formato incorreto (ex: e-mail inválido, senha curta)
- **THEN** o sistema bloqueia a submissão antes de acionar os UseCases do domínio
- **AND** exibe mensagens descritivas de erro nos respectivos campos afetados.

#### Scenario: Validação e submissão do formulário de cadastro de paciente
- **GIVEN** o nutricionista autenticado acessa a criação de paciente
- **WHEN** o formulário é preenchido com dados perfeitamente válidos conforme o schema Zod e é submetido
- **THEN** o sistema valida o formulário, os dados fluem para o ViewModel respectivo e são transmitidos ao domínio. (Regra de RLS: o cadastro do paciente e quaisquer anotações clínicas inseridas estarão vinculados estritamente ao ID do nutricionista logado, garantindo visibilidade exclusiva).
