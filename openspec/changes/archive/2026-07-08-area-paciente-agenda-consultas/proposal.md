## Why

Esta change resolve a necessidade de fornecer aos pacientes uma área exclusiva para visualização do seu plano alimentar diário, marcação de adesão a refeições e visualização de sua próxima consulta, além de prover ao nutricionista uma agenda de consultas em formato de calendário para organização de sua rotina de atendimentos.

## What Changes

Implementação da Área do Paciente e do módulo de Agenda de Consultas:
- **Área do Paciente:**
  - Visualização de refeições planejadas para o dia atual com alimentos, quantidades e calorias (HU-08).
  - Marcação de refeição como concluída com feedback imediato (HU-09).
  - Barra de progresso diário de adesão ao plano alimentar (HU-10).
  - Visualização da data e hora da próxima consulta agendada (HU-20).
- **Agenda de Consultas (Nutricionista):**
  - Agendamento de consultas com data, horário, duração e observações (HU-17).
  - Visualização de agenda em formato de calendário (visões diária e semanal) (HU-18).
  - Reagendamento e cancelamento de consultas (HU-19).
  - Validação para impedir sobreposição de horários de consultas para o mesmo nutricionista (RF032).

## Capabilities

### New Capabilities
- `scheduling/appointment-management`: Gestão de consultas pelo nutricionista, incluindo agendamento, reagendamento, cancelamento e visualização em calendário diário e semanal (RF029, RF030, RF031, RF032).
- `scheduling/patient-appointment-view`: Visualização da próxima consulta agendada por parte do paciente autenticado (RF033).

### Modified Capabilities
*(Nenhuma modificação em requisitos de capabilities existentes. As especificações de `patient-adherence` já estão definidas e serão implementadas nesta change).*

## Impact

- **Database:** Criação/alteração da tabela de consultas no banco de dados e definição das políticas de RLS.
- **Frontend Components:**
  - Criação da área do paciente com navegação por data, exibição de plano alimentar e barra de progresso.
  - Integração do componente de calendário para visualização das consultas do nutricionista.
  - Tela/modal para agendamento e edição de consultas.
- **Domain/UseCases:**
  - Implementação de casos de uso para agendamento, cancelamento e edição de consultas.
  - Validação de choque de horários (IAgendamentoValidator).
- **External Dependencies:** Integração da biblioteca React Big Calendar via padrão Adapter (ReactBigCalendarAdapter) na camada infra.
