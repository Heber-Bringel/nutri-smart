## ADDED Requirements

### Requirement: View Daily Meal Plan
The system SHALL allow the patient to view their daily meal plan with meals, foods, quantities, and caloric values.

#### Scenario: Patient views daily meal plan
- **GIVEN** the patient is authenticated and on the "Meu Plano" page
- **WHEN** the patient has an active meal plan
- **THEN** the system SHALL display the meals for the current day, each showing food items with name, quantity (g/ml), and calories, along with the total calories per meal and the daily total

#### Scenario: Patient with no meal plan
- **GIVEN** the patient is on the "Meu Plano" page
- **WHEN** no active meal plan exists for this patient
- **THEN** the system SHALL display "Nenhum plano alimentar encontrado. Consulte seu nutricionista."

#### Scenario: Meal plan RLS for patient
- **GIVEN** a patient is authenticated
- **WHEN** they access their meal plan
- **THEN** the RLS policy SHALL only allow access to plans linked to that patient via their user ID, preventing access to other patients' plans

### Requirement: Display Current Day by Default
The system SHALL default to showing the current day's meals when the patient accesses the meal plan view.

#### Scenario: Navigate to different day
- **GIVEN** the patient is viewing the current day's meal plan
- **WHEN** they select a different date
- **THEN** the system SHALL load and display the meals for the selected date
