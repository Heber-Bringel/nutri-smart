## ADDED Requirements

### Requirement: Listar pacientes (RF002, HU-03)
O sistema SHALL exibir a lista completa de pacientes do nutricionista autenticado em uma tabela com nome, data do último atendimento e status do plano alimentar ativo.
O sistema SHALL permitir buscar pacientes por nome e acessar a ficha individual de cada paciente.

#### Scenario: Listagem padrão
- **WHEN** o nutricionista acessa a página de listagem de pacientes
- **THEN** o sistema exibe uma tabela com todos os pacientes vinculados ao `nutritionist_id` do nutricionista autenticado
- **AND** cada linha contém nome, data do último atendimento e status do plano alimentar ativo

#### Scenario: Paginação na listagem
- **WHEN** o nutricionista possui mais de 20 pacientes cadastrados
- **THEN** o sistema exibe os pacientes em páginas de 20 registros cada
- **AND** o nutricionista pode navegar entre as páginas

#### Scenario: Busca por nome
- **WHEN** o nutricionista digita um termo no campo de busca
- **THEN** o sistema filtra a lista exibindo apenas pacientes cujo nome contenha o termo digitado (case-insensitive)
- **AND** atualiza a tabela a cada caractere digitado (debounce de 300ms)

#### Scenario: Acesso à ficha do paciente
- **WHEN** o nutricionista clica em um paciente na listagem
- **THEN** o sistema redireciona para a rota `/patients/:id` com a ficha completa do paciente

#### Scenario: RLS — nutricionista vê apenas seus pacientes
- **WHEN** o nutricionista autenticado com ID `X` acessa a listagem
- **THEN** a política RLS `nutritionist_select_own_patients` retorna apenas registros onde `nutritionist_id = auth.uid()`
- **AND** pacientes de outros nutricionistas nunca aparecem nos resultados

### Requirement: Visualizar ficha do paciente (RF003, HU-03)
O sistema SHALL exibir a ficha completa do paciente com dados cadastrais (nome, e-mail, data de nascimento, sexo biológico), indicadores clínicos (peso, altura, IMC, TMB, GET) e metadados (data de criação, data da última atualização).

#### Scenario: Visualização da ficha
- **WHEN** o nutricionista acessa a rota `/patients/:id`
- **THEN** o sistema exibe todos os dados cadastrais do paciente
- **AND** exibe os indicadores clínicos calculados (IMC, TMB, GET)
- **AND** exibe a data de criação e última atualização do registro

#### Scenario: Acesso negado a paciente de outro nutricionista
- **WHEN** o nutricionista tenta acessar a ficha de um paciente cujo `nutritionist_id` não corresponde ao seu `auth.uid()`
- **THEN** a política RLS bloqueia a consulta
- **AND** o sistema exibe uma mensagem de erro ou redireciona para a listagem
