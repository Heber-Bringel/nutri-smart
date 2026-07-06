## 1. Database & RLS

- [ ] 1.1 Garantir que as migrations das tabelas `planos_alimentares`, `refeicoes`, `alimentos`, `adesao_refeicoes`, `medidas_corporais` e `anotacoes_clinicas` estejam aplicadas com DDL conforme `docs/database.md`
- [ ] 1.2 Aplicar políticas RLS em todas as tabelas: nutricionista ALL + paciente SELECT (exceto `anotacoes_clinicas` — nutricionista ONLY)
- [ ] 1.3 Aplicar índices de desempenho: `idx_planos_paciente`, `idx_planos_ativo`, `idx_refeicoes_plano`, `idx_alimentos_refeicao`, `idx_adesao_paciente_data`, `idx_medidas_paciente_data`, `idx_anotacoes_paciente_data`

## 2. Domínio — Meal Plan CRUD (RF007, RF008, HU-06)

- [ ] 2.1 Criar entidades de domínio: `MealPlan`, `Refeicao`, `Alimento` com tipagens e validações
- [ ] 2.2 Criar interface `IMealPlanRepository` com métodos: create, update, findByPatientId, findById
- [ ] 2.3 Criar casos de uso: `CreateMealPlanUseCase` (validar refeições não vazias, calcular totais calóricos, persistir), `UpdateMealPlanUseCase` (carregar plano, aplicar alterações, recalcular, salvar), `GetMealPlanUseCase`
- [ ] 2.4 Implementar `SupabaseMealPlanRepository` com batch insert de refeições/alimentos e transação

## 3. Adapters — Meal Plan (Infraestrutura)

- [ ] 3.1 Implementar `SupabaseMealPlanRepository.create()` com insert do plano + refeições + alimentos em sequência
- [ ] 3.2 Implementar `SupabaseMealPlanRepository.update()` com replace de refeições e alimentos (delete + insert)
- [ ] 3.3 Implementar `SupabaseMealPlanRepository.findByPatientId()` com joins para carregar plano + refeições + alimentos
- [ ] 3.4 Criar mappers: `MealPlanMapper`, `RefeicaoMapper`, `AlimentoMapper`
- [ ] 3.5 Registrar repositório e casos de uso no Container

## 4. Componentes React — Meal Plan

- [ ] 4.1 Criar `MealPlanForm` com acordeão por refeição, adição/remoção de alimentos, cálculo automático de calorias
- [ ] 4.2 Criar `FoodItemRow` com campos nome, quantidade (g/ml) e calorias
- [ ] 4.3 Criar `MealPlanPage` na rota `/dashboard/pacientes/:id/plano-alimentar` integrando form + casos de uso
- [ ] 4.4 Exibir indicadores clínicos (IMC, TMB, GET) como base para prescrição na página do plano

## 5. Gráfico de Evolução (RF010, HU-07)

- [ ] 5.1 Criar caso de uso `GetEvolutionChartDataUseCase` (peso dos últimos 30 dias + percentual de adesão)
- [ ] 5.2 Criar `EvolutionChartPage` na rota `/dashboard/pacientes/:id/evolucao` com gráfico Recharts de linha dupla (peso + % adesão)
- [ ] 5.3 Implementar empty state quando não houver dados

## 6. Medidas Corporais (RF020–RF022, HU-11–HU-12)

- [ ] 6.1 Criar entidade `MedidaCorporal` com campos de domínio
- [ ] 6.2 Criar interface `IBodyMeasurementRepository` e implementação `SupabaseBodyMeasurementRepository`
- [ ] 6.3 Criar casos de uso: `RegisterMeasurementUseCase`, `ListMeasurementsUseCase`, `UpdateMeasurementUseCase`, `DeleteMeasurementUseCase`
- [ ] 6.4 Criar `BodyMeasurementFormPage` na rota `/dashboard/pacientes/:id/medidas` com formulário de circunferências, percentual de gordura e dobras cutâneas
- [ ] 6.5 Criar `MeasurementHistoryTable` e `MeasurementChart` (gráfico de linha por tipo de medida)
- [ ] 6.6 Suporte a edição e exclusão de registros de medida

## 7. Anotações Clínicas (RF023–RF025, HU-13–HU-14)

- [ ] 7.1 Criar entidade `AnotacaoClinica` com campos paciente, data, conteúdo
- [ ] 7.2 Criar interface `IClinicalNoteRepository` e implementação `SupabaseClinicalNoteRepository` (apenas nutricionista — paciente sem acesso)
- [ ] 7.3 Criar casos de uso: `CreateClinicalNoteUseCase`, `ListClinicalNotesUseCase`, `UpdateClinicalNoteUseCase`, `DeleteClinicalNoteUseCase`
- [ ] 7.4 Criar `ClinicalNotesPage` na rota `/dashboard/pacientes/:id/anotacoes` com formulário de texto livre + listagem com edição e exclusão

## 8. Área do Paciente (RF011–RF013, HU-08–HU-10)

- [ ] 8.1 Criar `PatientMealPlanPage` na rota `/paciente/meu-plano` exibindo refeições do dia com alimentos, quantidades e calorias totais
- [ ] 8.2 Criar `AdherenceToggle` (botão até 2 toques) com optimistic UI para marcar refeição como concluída
- [ ] 8.3 Criar `ProgressBar` com percentual de refeições concluídas vs. total do dia, atualizando em tempo real
- [ ] 8.4 Criar caso de uso `MarkMealAsCompletedUseCase` e `GetDailyProgressUseCase`
- [ ] 8.5 Criar `SupabaseAdesaoRepository` com upsert e tratamento de conflito unique (refeicao_id, data)

## 9. Roteamento e Integração

- [ ] 9.1 Registrar rotas do nutricionista: `/dashboard/pacientes/:id/plano-alimentar`, `/dashboard/pacientes/:id/evolucao`, `/dashboard/pacientes/:id/medidas`, `/dashboard/pacientes/:id/anotacoes`
- [ ] 9.2 Registrar rota do paciente: `/paciente/meu-plano`
- [ ] 9.3 Adicionar links de navegação na ficha do paciente (tabs ou menu lateral) para plano alimentar, evolução, medidas e anotações
- [ ] 9.4 Adicionar link na área do paciente para acesso ao plano alimentar diário
