## 1. Banco de Dados e RLS (Supabase)

- [x] 1.1 Criar scripts de migração/definição para a tabela `consultas`
- [x] 1.2 Configurar políticas de Row Level Security (RLS) para a tabela `consultas` (Nutricionista: CRUD próprio; Paciente: Leitura própria)
- [x] 1.3 Garantir a estrutura e políticas de RLS para a tabela `adesao_refeicoes` (Paciente: CRUD próprio)

## 2. Domínio e Contratos (Domain)

- [x] 2.1 Criar a entidade `Consulta` e a interface `IConsultaRepository` no domínio
- [x] 2.2 Criar a interface `ICalendarAdapter` no domínio para desacoplamento de ferramentas de calendário
- [x] 2.3 Implementar a interface `IAgendamentoValidator` e a estratégia `EvitarChoqueHorarioValidator` (Strategy GoF)
- [x] 2.4 Implementar o event emitter `ConsultaEventEmitter` (Observer GoF) para desacoplamento de ações de agendamento

## 3. Infraestrutura e Adapters (Infra)

- [x] 3.1 Implementar o repositório `SupabaseConsultaRepository` utilizando o SDK do Supabase na camada infra
- [x] 3.2 Implementar o `ReactBigCalendarAdapter` na camada infra para mapear dados de consultas para a biblioteca externa
- [x] 3.3 Registrar novas dependências e repositórios no módulo de injeção de dependências (DI)

## 4. Casos de Uso e ViewModels (Use Cases / ViewModel)

- [x] 4.1 Implementar casos de uso da Área do Paciente: carregar plano alimentar e salvar adesão de refeições
- [x] 4.2 Implementar casos de uso de Agenda: criar consulta (com validação de choque), editar, cancelar e listar consultas
- [x] 4.3 Implementar o `PatientAreaViewModel` para controle de estado do plano diário, progresso de refeições e próxima consulta
- [x] 4.4 Implementar o `AgendaViewModel` para gerenciar estado do calendário de agendamento do nutricionista

## 5. Interface Gráfica React (App)

- [x] 5.1 Criar a tela da Área do Paciente contendo barra de navegação de datas, exibição das refeições diárias e barra de progresso (HU-08, HU-10)
- [x] 5.2 Adicionar toggle de adesão de refeição com feedback em no máximo 2 toques sem recarga da página (HU-09)
- [x] 5.3 Exibir o box contendo a próxima consulta futura agendada na área logada do paciente (HU-20)
- [x] 5.4 Implementar a página de Agenda de Consultas do Nutricionista com visão diária/semanal em calendário (HU-18)
- [x] 5.5 Implementar modais/formulários para agendamento, edição e cancelamento de consultas (HU-17, HU-19)
