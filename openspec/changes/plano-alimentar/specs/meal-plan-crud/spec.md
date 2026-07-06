## ADDED Requirements

### Requirement: Create Meal Plan
The system SHALL allow the nutritionist to create a meal plan for a selected patient, defining meals (e.g., breakfast, lunch, dinner, snacks) with foods, quantities (g/ml), and caloric values.

#### Scenario: Successful meal plan creation
- **WHEN** the nutritionist accesses the patient's profile, selects "Criar plano alimentar", fills in meals with foods (name, quantity, calories), and confirms
- **THEN** the system persists the meal plan linked to the nutritionist and patient in Supabase with RLS, calculates the total calories per meal, and displays a success confirmation

#### Scenario: Meal plan creation with empty meal
- **WHEN** the nutritionist tries to save a meal plan where at least one meal has no food items
- **THEN** the system SHALL display an error message "Cada refeição deve conter ao menos um alimento" and prevent saving

#### Scenario: Meal plan creation with database failure
- **WHEN** a Supabase connection failure occurs during save
- **THEN** the system SHALL display "Não foi possível salvar o plano. Verifique sua conexão e tente novamente." and retain the filled form data

#### Scenario: RLS isolation on meal plan creation
- **WHEN** nutritionist A creates a meal plan for a patient
- **THEN** the system SHALL ensure via RLS policy that only nutritionist A and the linked patient can read that meal plan

### Requirement: Edit Meal Plan
The system SHALL allow the nutritionist to edit an existing meal plan, including adding, removing, or modifying meals and their food items.

#### Scenario: Edit existing meal plan
- **WHEN** the nutritionist accesses a patient with an active meal plan and selects "Editar plano"
- **THEN** the system loads the current plan with all meals and foods pre-filled, allows the nutritionist to add/remove/modify meals and foods, recalculates calorie totals after each change, and persists the updated plan upon save

#### Scenario: Edit meal plan – remove a meal
- **WHEN** the nutritionist removes an entire meal from an existing plan and saves
- **THEN** the system SHALL delete the meal and its associated food items, and update the plan's total calories

#### Scenario: Edit meal plan – add food to existing meal
- **WHEN** the nutritionist adds a new food item to an existing meal and saves
- **THEN** the system SHALL recalculate the meal's total calories to include the new item

### Requirement: Auto-calculate Calorie Totals
The system SHALL automatically calculate and display the total caloric value per meal based on the sum of all food items' calories within that meal.

#### Scenario: Calorie display after food addition
- **WHEN** the nutritionist adds or modifies food items in a meal
- **THEN** the system SHALL update the displayed total calorie count for that meal immediately

### Requirement: Nutritionist Session Validation
The system SHALL validate that the nutritionist has a valid JWT session before allowing meal plan creation or editing.

#### Scenario: Expired session during meal plan creation
- **WHEN** the nutritionist's JWT session expires during meal plan creation
- **THEN** the system SHALL redirect to login with the message "Sua sessão expirou. Faça login novamente."
