# food-base-management Specification

## Purpose
Define os requisitos para busca, criação de alimentos customizados e seleção de alimentos da base durante a montagem de planos alimentares.

## Requirements

### Requirement: Search Food Base
The system SHALL allow the nutritionist to search for foods in a systemic database by name during meal plan creation.

#### Scenario: Successful food search by name
- **GIVEN** the nutritionist is adding a food item to a meal
- **WHEN** they type a food name (e.g., "arroz") in the search field
- **THEN** the system SHALL display matching foods from `alimentos_base` sorted by relevance, showing name, portion (100g), and calories

#### Scenario: Food search with no results
- **GIVEN** the nutritionist types a search term
- **WHEN** no food matches the term
- **THEN** the system SHALL display "Nenhum alimento encontrado" with an option to create a custom food

#### Scenario: Food search RLS isolation
- **GIVEN** a nutritionist is authenticated
- **WHEN** they search the food base
- **THEN** the system SHALL return only systemic foods (nutricionista_id IS NULL) and foods they previously created (nutricionista_id = auth.uid())

### Requirement: Create Custom Food
The system SHALL allow the nutritionist to create a custom food item during meal plan creation when the desired food is not found in the systemic base.

#### Scenario: Create custom food successfully
- **GIVEN** the nutritionist did not find the desired food in the base
- **WHEN** they select "Criar novo alimento", fill in name, portion (g/ml), calories, proteins, carbohydrates, and fats, and confirm
- **THEN** the system persists the custom food linked to the nutritionist and makes it available for selection in future plans

#### Scenario: Create custom food with empty name
- **GIVEN** the nutritionist is creating a custom food
- **WHEN** they try to save with an empty name field
- **THEN** the system SHALL display "O nome do alimento é obrigatório" and prevent saving

### Requirement: Select Food from Base for Meal
The system SHALL allow the nutritionist to select a food from the search results and add it to a meal with a specified quantity.

#### Scenario: Add food from search result to meal
- **GIVEN** the nutritionist sees search results from the food base
- **WHEN** they select a food and specify the quantity in grams
- **THEN** the system SHALL calculate the calories proportionally to the specified quantity and add the food item to the meal
