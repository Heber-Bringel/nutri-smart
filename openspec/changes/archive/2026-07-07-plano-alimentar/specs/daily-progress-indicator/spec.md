## ADDED Requirements

### Requirement: Display Daily Progress Bar
The system SHALL display a progress bar or percentage showing the number of completed meals versus the total planned meals for the current day.

#### Scenario: View daily progress with partial completion
- **GIVEN** the patient is viewing their daily meal plan
- **WHEN** they have completed 2 out of 4 meals for the day
- **THEN** the system SHALL display a progress bar at 50% with the text "2 de 4 refeições concluídas"

#### Scenario: View daily progress with all meals completed
- **GIVEN** the patient is viewing their daily meal plan
- **WHEN** all meals for the day are marked as completed
- **THEN** the system SHALL display a full progress bar (100%) with the text "Todas as refeições concluídas!" and a checkmark icon

#### Scenario: View daily progress with no meals completed
- **GIVEN** the patient is viewing their daily meal plan
- **WHEN** no meals have been completed for the day
- **THEN** the system SHALL display an empty progress bar (0%) with the text "Nenhuma refeição concluída hoje"

### Requirement: Update Progress on Adherence Change
The system SHALL update the progress bar immediately when the patient toggles a meal's completion status.

#### Scenario: Progress updates after toggle
- **GIVEN** the patient marks a meal as completed
- **WHEN** the optimistic UI updates
- **THEN** the progress bar SHALL immediately reflect the new count of completed meals

### Requirement: Calculate Progress for Any Date
The system SHALL calculate the daily progress for any selected date, not just the current day.

#### Scenario: View progress for a past date
- **GIVEN** the patient navigates to a different date
- **WHEN** the meals for that date load
- **THEN** the progress bar SHALL display the completion status for that specific date
