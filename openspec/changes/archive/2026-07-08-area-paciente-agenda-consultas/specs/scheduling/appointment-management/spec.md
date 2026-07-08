## ADDED Requirements

### Requirement: Create Appointment
O sistema SHALL permitir que o nutricionista agende uma consulta para um paciente associado ao seu perfil, informando paciente, data, horário de início, duração e observações. O sistema MUST aplicar políticas de RLS para garantir que apenas o nutricionista criador e o paciente associado possuam acesso aos dados da consulta.

#### Scenario: Successful Appointment Creation
- **GIVEN** o nutricionista está autenticado no sistema
- **WHEN** ele insere uma consulta com data, horário e duração válidos para um de seus pacientes cadastrados
- **THEN** o sistema SHALL salvar o agendamento no banco de dados e aplicar a política de RLS garantindo que apenas este nutricionista e o paciente associado possam ler/escrever estes dados

### Requirement: Prevent Appointment Overlapping
O sistema SHALL validar e impedir o agendamento de consultas com horários sobrepostos para o mesmo nutricionista.

#### Scenario: Attempt to Create Overlapping Appointment
- **GIVEN** o nutricionista já possui uma consulta agendada das 14:00 às 15:00 em uma determinada data
- **WHEN** ele tenta agendar uma nova consulta na mesma data com início às 14:30 e término às 15:30
- **THEN** o sistema SHALL bloquear a criação do agendamento, mantendo o estado do banco íntegro, e exibir uma mensagem informativa de conflito de horário

### Requirement: View Scheduling Calendar
O sistema SHALL prover uma visualização da agenda de consultas do nutricionista autenticado em formato de calendário (com suporte a visões diária e semanal), aplicando filtros via RLS para exibir apenas os atendimentos do próprio nutricionista.

#### Scenario: View Weekly Agenda
- **GIVEN** o nutricionista está na página de Agenda
- **WHEN** ele seleciona a visualização semanal do calendário
- **THEN** o sistema SHALL carregar e renderizar os blocos de horário correspondentes às suas consultas ativas na semana atual, omitindo quaisquer consultas pertencentes a outros profissionais

### Requirement: Edit or Cancel Appointment
O sistema SHALL permitir que o nutricionista altere os detalhes (data, hora, observações) ou realize o cancelamento de uma consulta sob sua responsabilidade. As permissões MUST ser validadas via RLS.

#### Scenario: Reschedule Appointment Successfully
- **GIVEN** o nutricionista seleciona uma consulta existente para edição
- **WHEN** ele altera o horário de início para uma faixa livre de conflitos e confirma a edição
- **THEN** o sistema SHALL atualizar a consulta no banco de dados e disparar um evento (via ConsultaEventEmitter) para notificar as alterações

#### Scenario: Cancel Appointment Successfully
- **GIVEN** o nutricionista deseja remover uma consulta de sua agenda
- **WHEN** ele aciona a opção de exclusão/cancelamento da consulta
- **THEN** o sistema SHALL marcar o registro como excluído ou deletá-lo do banco de dados, atualizando a exibição do calendário imediatamente
