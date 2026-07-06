## 1. Database & RLS

- [x] 1.1 Garantir que as migrations das tabelas `planos_alimentares`, `refeicoes`, `alimentos`, `adesao_refeicoes`, `medidas_corporais` e `anotacoes_clinicas` estejam aplicadas com DDL conforme `docs/database.md`
- [x] 1.2 Aplicar políticas RLS em todas as tabelas: nutricionista ALL + paciente SELECT (exceto `anotacoes_clinicas` — nutricionista ONLY)
- [x] 1.3 Aplicar índices de desempenho: `idx_planos_paciente`, `idx_planos_ativo`, `idx_refeicoes_plano`, `idx_alimentos_refeicao`, `idx_adesao_paciente_data`, `idx_medidas_paciente_data`, `idx_anotacoes_paciente_data`

## 2. Domínio — Meal Plan CRUD (RF007, RF008, HU-06)

- [x] 2.1 Criar entidades de domínio: `MealPlan`, `Refeicao`, `Alimento` com tipagens e validações
- [x] 2.2 Criar interface `IMealPlanRepository` com métodos: create, update, findByPatientId, findById
- [x] 2.3 Criar casos de uso: `CreateMealPlanUseCase` (validar refeições não vazias, calcular totais calóricos, persistir), `UpdateMealPlanUseCase` (carregar plano, aplicar alterações, recalcular, salvar), `GetMealPlanUseCase`
- [x] 2.4 Implementar `SupabaseMealPlanRepository` com batch insert de refeições/alimentos e transação

## 3. Adapters — Meal Plan (Infraestrutura)

- [x] 3.1 Implementar `SupabaseMealPlanRepository.create()` com insert do plano + refeições + alimentos em sequência
- [x] 3.2 Implementar `SupabaseMealPlanRepository.update()` com replace de refeições e alimentos (delete + insert)
- [x] 3.3 Implementar `SupabaseMealPlanRepository.findByPatientId()` com joins para carregar plano + refeições + alimentos
- [x] 3.4 Criar mappers: `MealPlanMapper`, `RefeicaoMapper`, `AlimentoMapper`
- [x] 3.5 Registrar repositório e casos de uso no Container

## 4. Componentes React — Meal Plan

- [x] 4.1 Criar `MealPlanForm` com acordeão por refeição, adição/remoção de alimentos, cálculo automático de calorias
- [x] 4.2 Criar `FoodItemRow` com campos nome, quantidade (g/ml) e calorias
- [x] 4.3 Criar `MealPlanPage` na rota `/dashboard/pacientes/:id/plano-alimentar` integrando form + casos de uso
- [x] 4.4 Exibir indicadores clínicos (IMC, TMB, GET) como base para prescrição na página do plano

## 5. Gráfico de Evolução (RF010, HU-07)

- [x] 5.1 Criar caso de uso `GetEvolutionChartDataUseCase` (peso dos últimos 30 dias + percentual de adesão)
- [x] 5.2 Criar `EvolutionChartPage` na rota `/dashboard/pacientes/:id/evolucao` com gráfico SVG de linha dupla (peso + % adesão)
- [x] 5.3 Implementar empty state quando não houver dados

## 6. Medidas Corporais (RF020–RF022, HU-11–HU-12)

- [x] 6.1 Criar entidade `MedidaCorporal` com campos de domínio
- [x] 6.2 Criar interface `IBodyMeasurementRepository` e implementação `SupabaseBodyMeasurementRepository`
- [x] 6.3 Criar casos de uso: `RegisterMeasurementUseCase`, `ListMeasurementsUseCase`, `UpdateMeasurementUseCase`, `DeleteMeasurementUseCase`
- [x] 6.4 Criar `BodyMeasurementFormPage` na rota `/dashboard/pacientes/:id/medidas` com formulário de circunferências, percentual de gordura e dobras cutâneas
- [x] 6.5 Criar `MeasurementHistoryTable` e `MeasurementChart` (tabela de histórico com dados)
- [x] 6.6 Suporte a edição e exclusão de registros de medida

## 7. Anotações Clínicas (RF023–RF025, HU-13–HU-14)

- [x] 7.1 Criar entidade `AnotacaoClinica` com campos paciente, data, conteúdo
- [x] 7.2 Criar interface `IClinicalNoteRepository` e implementação `SupabaseClinicalNoteRepository` (apenas nutricionista — paciente sem acesso)
- [x] 7.3 Criar casos de uso: `CreateClinicalNoteUseCase`, `ListClinicalNotesUseCase`, `UpdateClinicalNoteUseCase`, `DeleteClinicalNoteUseCase`
- [x] 7.4 Criar `ClinicalNotesPage` na rota `/dashboard/pacientes/:id/anotacoes` com formulário de texto livre + listagem com edição e exclusão

## 8. Área do Paciente (RF011–RF013, HU-08–HU-10)

- [x] 8.1 Criar `PatientMealPlanPage` na rota `/paciente/meu-plano` exibindo refeições do dia com alimentos, quantidades e calorias totais
- [x] 8.2 Criar `AdherenceToggle` (botão até 2 toques) com optimistic UI para marcar refeição como concluída
- [x] 8.3 Criar `ProgressBar` com percentual de refeições concluídas vs. total do dia, atualizando em tempo real
- [x] 8.4 Criar caso de uso `MarkMealAsCompletedUseCase` e `GetDailyProgressUseCase`
- [x] 8.5 Criar `SupabaseAdesaoRepository` com upsert e tratamento de conflito unique (refeicao_id, data)

## 9. Roteamento e Integração

- [x] 9.1 Registrar rotas do nutricionista: `/dashboard/pacientes/:id/plano-alimentar`, `/dashboard/pacientes/:id/evolucao`, `/dashboard/pacientes/:id/medidas`, `/dashboard/pacientes/:id/anotacoes`
- [x] 9.2 Registrar rota do paciente: `/paciente/meu-plano`
- [x] 9.3 Adicionar links de navegação na ficha do paciente (tabs ou menu lateral) para plano alimentar, evolução, medidas e anotações
- [x] 9.4 Adicionar link na área do paciente para acesso ao plano alimentar diário
