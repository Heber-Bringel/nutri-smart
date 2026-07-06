## Why

O sistema NutriSmart possui o cadastro de pacientes (Épico 1), mas ainda não oferece as funcionalidades clínicas centrais: criação e edição de planos alimentares, registro de medidas corporais e anotações clínicas, além do gráfico de evolução do paciente. Sem esses módulos (Épicos 2 e 4), o nutricionista não consegue prescrever dietas, acompanhar a evolução clínica nem documentar atendimentos — fluxos essenciais para o MVP. Implementa RF007–RF008, RF010, RF020–RF025, HU-06–07, HU-11–14.

## What Changes

- **Criação de plano alimentar**: Interface para o nutricionista criar um plano vinculado a um paciente, definindo refeições (café da manhã, almoço, jantar, lanches) com alimentos, quantidades (g/ml) e calorias. Cálculo automático do total calórico por refeição.
- **Edição de plano alimentar**: Permite adicionar/remover/alterar refeições e alimentos de um plano existente.
- **Gráfico de evolução**: Gráfico de linha com peso (eixo Y) por data (eixo X) e percentual de adesão diária ao plano alimentar — últimos 30 dias, isolado por paciente via RLS.
- **Registro de medidas corporais**: Formulário para registrar circunferências (cintura, quadril, braço, coxa), percentual de gordura e dobras cutâneas, vinculado ao paciente e à data do atendimento.
- **Histórico de medidas corporais**: Tabela e gráfico do histórico de medidas, com suporte a edição e exclusão.
- **Anotações clínicas**: Campo de texto livre vinculado ao paciente e à data do atendimento, tratado como dado sensível (LGPD Art. 11) com isolamento via RLS.
- **Gerenciamento de anotações clínicas**: Listagem, edição e exclusão de anotações registradas.

## Capabilities

### New Capabilities
- `meal-plan-crud`: Criação e edição de planos alimentares com refeições, alimentos, quantidades e cálculo automático de calorias (RF007, RF008, HU-06)
- `patient-evolution-chart`: Gráfico de linha com evolução de peso e percentual de adesão diária ao plano alimentar (RF010, HU-07)
- `body-measurements`: Registro de medidas corporais (circunferências, percentual de gordura, dobras cutâneas) vinculadas à data do atendimento (RF020, HU-11)
- `body-measurements-history`: Histórico de medidas em tabela e gráfico com edição e exclusão (RF021, RF022, HU-12)
- `clinical-notes`: Registro de anotações clínicas em texto livre com data do atendimento (RF023, HU-13)
- `clinical-notes-management`: Listagem, edição e exclusão de anotações clínicas (RF024, RF025, HU-14)
- `patient-meal-plan-view`: Visualização do plano alimentar pelo paciente com refeições do dia, alimentos, quantidades e calorias (RF011, HU-08)
- `meal-adherence`: Marcação de refeições como concluídas pelo paciente com persistência e feedback visual imediato (RF012, HU-09)
- `daily-progress-indicator`: Barra de progresso ou percentual mostrando refeições concluídas vs. total planejado no dia (RF013, HU-10)

### Modified Capabilities
*(nenhuma — todas são novas capacidades)*

## Impact

- **Supabase (novas tabelas)**: `planos_alimentares`, `refeicoes`, `alimentos`, `adesao_refeicoes`, `medidas_corporais`, `anotacoes_clinicas` — com políticas RLS isolando dados por nutricionista e paciente
- **React (novos componentes)**: `MealPlanForm`, `MealPlanView`, `MealList`, `FoodItemRow`, `EvolutionChart`, `BodyMeasurementForm`, `MeasurementHistoryTable`, `MeasurementChart`, `ClinicalNoteForm`, `ClinicalNoteList`, `PatientMealPlanView`, `AdherenceToggle`, `ProgressBar`
- **Domínio (novos casos de uso)**: `CreateMealPlanUseCase`, `UpdateMealPlanUseCase`, `GetMealPlanUseCase`, `RegisterMeasurementUseCase`, `ListMeasurementsUseCase`, `CreateClinicalNoteUseCase`, `ListClinicalNotesUseCase`, `UpdateClinicalNoteUseCase`, `DeleteClinicalNoteUseCase`, `MarkMealAsCompletedUseCase`, `GetDailyProgressUseCase`
- **Repositórios**: `MealPlanRepository`, `RefeicaoRepository`, `AlimentoRepository`, `AdesaoRepository`, `BodyMeasurementRepository`, `ClinicalNoteRepository`
- **Adapter para cálculos**: Módulo `nutritional-calculations` (IMC, TMB, GET) já existe — sem alterações (excluído do escopo)
