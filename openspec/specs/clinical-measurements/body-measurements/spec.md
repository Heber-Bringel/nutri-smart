# body-measurements Specification

## Purpose
Define os requisitos para registro de medidas corporais pelo nutricionista com validação de data e valores positivos.

## Requirements

### Requirement: Register Body Measurements
The system SHALL allow the nutritionist to record body measurements (waist, hip, arm, thigh circumferences, body fat percentage, skinfold thickness) linked to the patient and appointment date.

#### Scenario: Successful measurement registration
- **GIVEN** the nutritionist is on the patient's measurements page
- **WHEN** they fill in the form with date, circumferences (waist, hip, arm, thigh), body fat percentage, and skinfold measurements, and confirm
- **THEN** the system persists the record in `medidas_corporais` linked to the patient and nutritionist, and displays a success confirmation

#### Scenario: Measurement registration with missing date
- **GIVEN** the nutritionist is filling the measurement form
- **WHEN** they try to save without selecting a date
- **THEN** the system SHALL display "A data do atendimento é obrigatória" and prevent saving

#### Scenario: Measurement registration RLS isolation
- **GIVEN** nutritionist A registers a measurement for a patient
- **WHEN** nutritionist B tries to access that record
- **THEN** the RLS policy SHALL prevent nutritionist B from reading or modifying it

### Requirement: Validate Measurement Values
The system SHALL validate that measurement values are positive numbers within a reasonable physiological range.

#### Scenario: Measurement with negative value
- **GIVEN** the nutritionist is filling the measurement form
- **WHEN** they enter a negative value for any measurement field
- **THEN** the system SHALL display "Os valores das medidas devem ser positivos" and prevent saving
