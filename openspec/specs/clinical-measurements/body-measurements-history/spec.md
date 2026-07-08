# body-measurements-history Specification

## Purpose
Define os requisitos para visualização do histórico de medidas corporais em tabela e gráfico, com edição e exclusão de registros.

## Requirements

### Requirement: View Measurement History
The system SHALL display the patient's body measurement history in a table and a line chart, ordered by date descending.

#### Scenario: View measurement history table
- **GIVEN** the nutritionist is on the patient's measurements page
- **WHEN** the patient has registered measurements
- **THEN** the system SHALL display a table with columns: date, waist, hip, arm, thigh, body fat %, and actions (edit/delete)

#### Scenario: View measurement history chart
- **GIVEN** the nutritionist is on the patient's measurements page
- **WHEN** the patient has 2 or more registered measurements
- **THEN** the system SHALL render a line chart showing each measurement type over time

#### Scenario: Empty measurement history
- **GIVEN** the nutritionist is on the patient's measurements page
- **WHEN** the patient has no registered measurements
- **THEN** the system SHALL display "Nenhuma medida registrada" with a call-to-action to register the first measurement

### Requirement: Edit Measurement
The system SHALL allow the nutritionist to edit an existing body measurement record.

#### Scenario: Edit a measurement successfully
- **GIVEN** the nutritionist is viewing the measurement history
- **WHEN** they select "Editar" on a record, modify the values, and confirm
- **THEN** the system SHALL update the record and refresh the table and chart

### Requirement: Delete Measurement
The system SHALL allow the nutritionist to delete an existing body measurement record.

#### Scenario: Delete a measurement successfully
- **GIVEN** the nutritionist is viewing the measurement history
- **WHEN** they select "Excluir" on a record and confirm the deletion
- **THEN** the system SHALL remove the record and refresh the table and chart

#### Scenario: Cancel measurement deletion
- **GIVEN** the nutritionist selected "Excluir" on a record
- **WHEN** they cancel the confirmation dialog
- **THEN** the system SHALL NOT delete the record and return to the history view
