# patient-evolution-chart Specification

## Purpose
Define os requisitos para exibição do gráfico de evolução do paciente com peso e adesão diária nos últimos 30 dias.

## Requirements

### Requirement: Display Evolution Chart
The system SHALL display a line chart showing the patient's weight progression and daily meal adherence percentage over the last 30 days.

#### Scenario: View evolution chart with data
- **GIVEN** the nutritionist is on the patient's evolution page
- **WHEN** the patient has weight records and adherence data in the last 30 days
- **THEN** the system SHALL render a dual-axis line chart: left Y-axis for weight (kg), right Y-axis for adherence (%), X-axis for date, with a legend identifying each line

#### Scenario: View evolution chart with no data
- **GIVEN** the nutritionist is on the patient's evolution page
- **WHEN** the patient has no weight records or adherence data in the last 30 days
- **THEN** the system SHALL display "Nenhum registro de evolução encontrado" with a call-to-action to register the first measurement

#### Scenario: Evolution chart RLS isolation
- **GIVEN** nutritionist A is viewing a patient's evolution
- **WHEN** the chart loads
- **THEN** the system SHALL only display data for patients linked to nutritionist A, enforced by RLS policies on `medidas_corporais` and `adesao_refeicoes`

### Requirement: Adherence Data Source
The system SHALL calculate the daily adherence percentage as the ratio of completed meals to total planned meals for that day.

#### Scenario: Adherence calculation
- **GIVEN** a patient has 4 meals planned and marked 3 as completed on a given day
- **WHEN** the evolution chart loads that day
- **THEN** the adherence percentage SHALL be displayed as 75%
