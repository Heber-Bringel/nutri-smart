# clinical-notes-management Specification

## Purpose
Define os requisitos para listagem, visualização completa, edição e exclusão de anotações clínicas com preview de 100 caracteres.

## Requirements

### Requirement: List Clinical Notes
The system SHALL display a list of all clinical notes for a patient, ordered by date descending.

#### Scenario: View clinical notes list
- **GIVEN** the nutritionist is on the patient's clinical notes page
- **WHEN** the patient has registered notes
- **THEN** the system SHALL display a list with date, preview of content (first 100 characters), and actions (view, edit, delete)

#### Scenario: Empty clinical notes list
- **GIVEN** the nutritionist is on the patient's clinical notes page
- **WHEN** the patient has no registered notes
- **THEN** the system SHALL display "Nenhuma anotação clínica registrada" with a call-to-action to create the first note

### Requirement: Edit Clinical Note
The system SHALL allow the nutritionist to edit an existing clinical note.

#### Scenario: Edit a clinical note successfully
- **GIVEN** the nutritionist is viewing the clinical notes list
- **WHEN** they select "Editar" on a note, modify the content, and confirm
- **THEN** the system SHALL update the note and refresh the list

### Requirement: Delete Clinical Note
The system SHALL allow the nutritionist to delete an existing clinical note.

#### Scenario: Delete a clinical note successfully
- **GIVEN** the nutritionist is viewing the clinical notes list
- **WHEN** they select "Excluir" on a note and confirm the deletion
- **THEN** the system SHALL remove the note and refresh the list

#### Scenario: Cancel clinical note deletion
- **GIVEN** the nutritionist selected "Excluir" on a note
- **WHEN** they cancel the confirmation dialog
- **THEN** the system SHALL NOT delete the note and return to the list view

### Requirement: View Full Clinical Note
The system SHALL allow the nutritionist to view the full content of a clinical note.

#### Scenario: View full note content
- **GIVEN** the nutritionist is viewing the clinical notes list
- **WHEN** they select a note to view
- **THEN** the system SHALL display the full note content with date and a "Voltar" button
