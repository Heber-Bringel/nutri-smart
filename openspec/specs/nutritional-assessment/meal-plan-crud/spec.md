# meal-plan-crud Specification

## Purpose
Define os requisitos para criação e edição de planos alimentares pelo nutricionista, incluindo cálculo automático de calorias por refeição e validação de sessão.

## Requirements

### Requirement: Create Meal Plan
The system SHALL allow the nutritionist to create a meal plan for a selected patient, defining meals (e.g., breakfast, lunch, dinner, snacks) with foods, quantities (g/ml), and caloric values.

#### Scenario: Successful meal plan creation
- **GIVEN** the nutritionist is authenticated and on the patient's profile page
- **WHEN** they select "Criar plano alimentar", fill in meals with foods (name, quantity, calories), and confirm
- **THEN** the system persists the meal plan linked to the nutritionist and patient in Supabase with RLS, calculates the total calories per meal, and displays a success confirmation

#### Scenario: Meal plan creation with empty meal
- **GIVEN** the nutritionist is creating a meal plan
- **WHEN** they try to save with at least one meal having no food items
- **THEN** the system SHALL display "Cada refeição deve conter ao menos um alimento" and prevent saving

#### Scenario: Meal plan creation with database failure
- **GIVEN** the nutritionist is saving a meal plan
- **WHEN** a Supabase connection failure occurs
- **THEN** the system SHALL display "Não foi possível salvar o plano. Verifique sua conexão e tente novamente." and retain the filled form data

#### Scenario: RLS isolation on meal plan creation
- **GIVEN** nutritionist A creates a meal plan for a patient
- **WHEN** nutritionist B tries to access that meal plan
- **THEN** the RLS policy SHALL prevent nutritionist B from reading or modifying it

### Requirement: Edit Meal Plan
The system SHALL allow the nutritionist to edit an existing meal plan, including adding, removing, or modifying meals and their food items.

#### Scenario: Edit existing meal plan
- **GIVEN** the nutritionist is viewing a patient with an active meal plan
- **WHEN** they select "Editar plano"
- **THEN** the system loads the current plan with all meals and foods pre-filled, allows modifications, recalculates calorie totals after each change, and persists the updated plan upon save

#### Scenario: Edit meal plan – remove a meal
- **GIVEN** the nutritionist is editing an existing meal plan
- **WHEN** they remove an entire meal and save
- **THEN** the system SHALL delete the meal and its associated food items, and update the plan's total calories

#### Scenario: Edit meal plan – add food to existing meal
- **GIVEN** the nutritionist is editing an existing meal plan
- **WHEN** they add a new food item to an existing meal and save
- **THEN** the system SHALL recalculate the meal's total calories to include the new item

### Requirement: Auto-calculate Calorie Totals
The system SHALL automatically calculate and display the total caloric value per meal based on the sum of all food items' calories within that meal.

#### Scenario: Calorie display after food addition
- **GIVEN** the nutritionist is editing a meal
- **WHEN** they add or modify food items
- **THEN** the system SHALL update the displayed total calorie count for that meal immediately

### Requirement: Nutritionist Session Validation
The system SHALL validate that the nutritionist has a valid JWT session before allowing meal plan creation or editing.

#### Scenario: Expired session during meal plan creation
- **GIVEN** the nutritionist has an expired JWT session
- **WHEN** they attempt to create or edit a meal plan
- **THEN** the system SHALL redirect to "/login" with the message "Sua sessão expirou. Faça login novamente."
