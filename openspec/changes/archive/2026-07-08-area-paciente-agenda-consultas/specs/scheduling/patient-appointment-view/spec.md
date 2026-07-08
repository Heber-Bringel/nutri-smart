## ADDED Requirements

### Requirement: Patient Views Next Appointment
O sistema SHALL exibir ao paciente autenticado a data, hora e observações de sua próxima consulta agendada no futuro. O sistema MUST assegurar via políticas de RLS que o paciente só consiga visualizar agendamentos em que esteja explicitamente associado.

#### Scenario: View Next Scheduled Appointment
- **GIVEN** o paciente está autenticado e acessa a Área do Paciente
- **WHEN** há um ou mais agendamentos de consultas futuras associados ao seu ID
- **THEN** o sistema SHALL identificar e exibir na tela a consulta futura mais próxima da data/hora atual (exibindo data, hora e notas), garantindo via RLS que dados de outros pacientes permaneçam inacessíveis

#### Scenario: View Next Appointment When None Scheduled
- **GIVEN** o paciente está autenticado e acessa a Área do Paciente
- **WHEN** não há nenhum agendamento de consulta futura associado ao seu ID no banco de dados
- **THEN** o sistema SHALL exibir na tela a mensagem informativa: "Nenhuma consulta agendada."
