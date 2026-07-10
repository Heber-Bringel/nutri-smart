## ADDED Requirements

### Requirement: Encapsulamento da UI via ViewModels (Hooks)
O sistema SHALL encapsular toda a lógica de acesso a dados, gerenciamento de estado assíncrono (carregamento, erros) e invocação de UseCases em custom hooks (ViewModels), não permitindo chamadas diretas ao contêiner de Injeção de Dependências a partir das Views.

#### Scenario: Visualização e carregamento de listas de dados
- **GIVEN** o usuário acessa uma página que demanda listagem de dados (como listagem de pacientes ou agenda)
- **WHEN** a tela é montada e requisita as informações
- **THEN** a tela acessa o custom hook correspondente (ex: `usePacientesViewModel()`) que gerenciará o `isLoading` e o retorno dos dados.
- **AND** a UI refletirá os estados repassados de forma transparente, sem manipular chamadas de APIs ou serviços diretamente. (Regra de RLS aplicável: O repositório chamado internamente acessará a tabela de pacientes retornando apenas registros que pertençam ao tenant ativo/usuário autenticado).

#### Scenario: Isolação de efeitos colaterais
- **GIVEN** que o usuário executa uma ação complexa, como marcar uma consulta
- **WHEN** o hook `useAgendaViewModel` é invocado para enviar a ação
- **THEN** o hook repassa o comando ao `UseCase` de agendamento, que por sua vez coordena as regras de domínio e emite os eventos no `ConsultaEventEmitter` (Observer), mantendo a View inteiramente ignorante sobre emissão de eventos e persistência.
