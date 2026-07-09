# meal-adherence Specification

## Purpose
Define os requisitos para marcação de refeições como concluídas pelo paciente com feedback visual imediato e prevenção de duplicidade.

## Requirements

### Requirement: Mark Meal as Completed
The system SHALL allow the patient to mark a meal as completed, with immediate visual feedback and background persistence.

#### Scenario: Mark meal as completed
- **GIVEN** the patient is viewing their daily meal plan
- **WHEN** they toggle a meal to "completed"
- **THEN** the system SHALL immediately update the visual state (optimistic UI), persist via `INSERT ... ON CONFLICT DO UPDATE` in `adesao_refeicoes`, and show a checkmark or green indicator

#### Scenario: Unmark a completed meal
- **GIVEN** the patient has a meal marked as completed
- **WHEN** they toggle it back to "not completed"
- **THEN** the system SHALL immediately update the visual state and persist the change

#### Scenario: Adherence persistence failure
- **GIVEN** the patient toggles a meal
- **WHEN** the Supabase request fails
- **THEN** the system SHALL revert the optimistic UI to the previous state and display "Erro ao salvar. Tente novamente."

#### Scenario: Adherence RLS for patient
- **GIVEN** a patient is authenticated
- **WHEN** they mark a meal as completed
- **THEN** the RLS policy SHALL allow the patient to insert/update only their own adherence records (via paciente_id linked to their user_id)

### Requirement: Prevent Duplicate Adherence Records
The system SHALL prevent duplicate adherence records for the same meal on the same day.

#### Scenario: Unique constraint enforcement
- **GIVEN** a patient marks the same meal as completed twice on the same day
- **WHEN** the second request reaches Supabase
- **THEN** the unique constraint on `(refeicao_id, data)` SHALL cause an upsert that updates the existing record rather than creating a duplicate
