# auth Specification

## Purpose
TBD - created by archiving change autenticacao. Update Purpose after archive.
## Requirements
### Requirement: Form Validation and Submission
The system SHALL provide a login interface with real-time format validation for e-mail and password inputs before submission.

#### Scenario: Valid credentials submission
- **WHEN** user inputs a valid email structure and password and submits the form
- **THEN** system dispatches authentication request to the authentication service

#### Scenario: Invalid email format
- **WHEN** user inputs an invalid email string (e.g. missing '@')
- **THEN** system SHALL highlight the field with a validation error and disable form submission

### Requirement: Secure Failure Feedback
The system SHALL display generic failure error messages upon authentication failure without disclosing whether the email or the password was incorrect.

#### Scenario: Invalid password or unregistered email
- **WHEN** user submits non-matching email or password credentials
- **THEN** system SHALL display "E-mail ou senha inválidos" error toast/alert without specifying which field failed

### Requirement: Role-Based Routing Navigation
The system SHALL automatically redirect authenticated users to their specific workspace area based on their profile role upon successful login.

#### Scenario: Successful login as Nutritionist
- **WHEN** a user with 'nutritionist' role successfully authenticates
- **THEN** system SHALL redirect the browser to `/dashboard/pacientes`

#### Scenario: Successful login as Patient
- **WHEN** a user with 'patient' role successfully authenticates
- **THEN** system SHALL redirect the browser to `/dieta`

### Requirement: Session Persistence
The system SHALL maintain active JWT session state using Supabase Auth across page reloads and browser tabs until explicitly logged out or expired.

#### Scenario: Tab reload or new tab navigation
- **WHEN** an authenticated user opens a new tab or refreshes the page
- **THEN** system SHALL restore user identity from stored session token and keep user logged in

#### Scenario: Sign out action
- **WHEN** user clicks the sign out button
- **THEN** system SHALL clear session state, revoke tokens, and redirect user to the `/login` route

### Requirement: Data Access Control
The system SHALL enforce PostgreSQL Row Level Security (RLS) policies in Supabase so that data access is restricted according to authenticated identity.

#### Scenario: Patient data querying by nutritionist
- **WHEN** an authenticated nutritionist requests patient records
- **THEN** system SHALL return only patient records associated with that nutritionist's user ID

#### Scenario: Patient accessing diet data
- **WHEN** an authenticated patient requests diet plans
- **THEN** system SHALL return only the diet plan matching the patient's own ID

