# clinical-notes Specification

## Purpose
Define os requisitos para registro de anotações clínicas pelo nutricionista com proteção LGPD (Art. 11) e validação de conteúdo obrigatório.

## Requirements

### Requirement: Register Clinical Note
The system SHALL allow the nutritionist to register a free-text clinical note linked to the patient and appointment date, treated as sensitive data (LGPD Art. 11).

#### Scenario: Successful clinical note registration
- **GIVEN** the nutritionist is on the patient's clinical notes page
- **WHEN** they fill in the date and note content, and confirm
- **THEN** the system persists the note in `anotacoes_clinicas` linked to the patient and nutritionist, and displays a success confirmation

#### Scenario: Clinical note with empty content
- **GIVEN** the nutritionist is writing a clinical note
- **WHEN** they try to save with empty content
- **THEN** the system SHALL display "O conteúdo da anotação é obrigatório" and prevent saving

#### Scenario: Clinical note RLS isolation (LGPD)
- **GIVEN** nutritionist A registers a clinical note for a patient
- **WHEN** the patient tries to view their own clinical notes
- **THEN** the RLS policy SHALL prevent the patient from accessing any clinical note records, as they are restricted exclusively to the nutritionist

### Requirement: Validate Nutritionist Access to Clinical Notes
The system SHALL ensure that only the nutritionist who registered the clinical note can view it.

#### Scenario: Cross-nutritionist access denied
- **GIVEN** nutritionist A registered a clinical note for a patient
- **WHEN** nutritionist B tries to access that note
- **THEN** the RLS policy SHALL prevent access since the note is linked to nutritionist A's user ID
