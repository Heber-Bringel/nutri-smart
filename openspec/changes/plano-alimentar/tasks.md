## 1. Domínio — Entidades e Interfaces

- [x] 1.1 Criar entidade `MealPlan` (id, pacienteId, nutricionistaId, dataCriacao, dataAtualizacao)
- [x] 1.2 Criar entidade `Refeicao` (id, planoAlimentarId, nome, totalCalorias)
- [x] 1.3 Criar entidade `Alimento` (id, refeicaoId, nome, quantidade, calorias, proteinas, carboidratos, gorduras)
- [x] 1.4 Criar entidade `AlimentoBase` (id, nome, porcao, calorias, proteinas, carboidratos, gorduras, nutricionistaId)
- [x] 1.5 Criar entidade `BodyMeasurement` (id, pacienteId, nutricionistaId, data, cintura, quadril, braco, coxa, gordura, dobras)
- [x] 1.6 Criar entidade `ClinicalNote` (id, pacienteId, nutricionistaId, data, conteudo, createdAt, updatedAt)
- [x] 1.7 Criar entidade `Adesao` (id, refeicaoId, pacienteId, data, concluida)
- [x] 1.8 Criar interface `IMealPlanService` (create, update, findByPatient, findById)
- [x] 1.9 Criar interface `IFoodBaseService` (search, createCustom)
- [x] 1.10 Criar interface `IBodyMeasurementService` (create, findByPatient, update, delete)
- [x] 1.11 Criar interface `IClinicalNoteService` (create, findByPatient, update, delete)
- [x] 1.12 Criar interface `IAdesaoService` (upsert, getDailyProgress)

## 2. Casos de Uso — Plano Alimentar

- [x] 2.1 Implementar `CreateMealPlanUseCase` — valida refeições não vazias, calcula totais calóricos
- [x] 2.2 Implementar `UpdateMealPlanUseCase` — substitui refeições/alimentos, recalcula totais
- [x] 2.3 Implementar `GetMealPlanUseCase` — retorna plano ativo do paciente com refeições e alimentos
- [x] 2.4 Implementar `SearchFoodBaseUseCase` — busca textual em alimentos_base por nome
- [x] 2.5 Implementar `CreateCustomFoodUseCase` — persiste alimento customizado para o nutricionista

## 3. Casos de Uso — Medidas Corporais

- [x] 3.1 Implementar `RegisterMeasurementUseCase` — valida data e valores positivos
- [x] 3.2 Implementar `ListMeasurementsUseCase` — lista medidas por paciente ordenadas por data
- [x] 3.3 Implementar `UpdateMeasurementUseCase` — atualiza registro existente
- [x] 3.4 Implementar `DeleteMeasurementUseCase` — remove registro

## 4. Casos de Uso — Anotações Clínicas

- [x] 4.1 Implementar `CreateClinicalNoteUseCase` — valida conteúdo não vazio
- [x] 4.2 Implementar `ListClinicalNotesUseCase` — lista anotações por paciente
- [x] 4.3 Implementar `UpdateClinicalNoteUseCase` — atualiza conteúdo da anotação
- [x] 4.4 Implementar `DeleteClinicalNoteUseCase` — remove anotação

## 5. Casos de Uso — Adesão e Evolução

- [x] 5.1 Implementar `MarkMealAsCompletedUseCase` — upsert em adesao_refeicoes
- [x] 5.2 Implementar `GetDailyProgressUseCase` — calcula razão concluídas/total do dia
- [x] 5.3 Implementar `GetEvolutionChartDataUseCase` — agrega peso e % adesão nos últimos 30 dias

## 6. Adapters — Supabase Services

- [x] 6.1 Implementar `SupabaseMealPlanService` com mappers para planos_alimentares, refeicoes, alimentos
- [x] 6.2 Implementar `SupabaseFoodBaseService` com mapper para alimentos_base e busca ilike
- [x] 6.3 Implementar `SupabaseBodyMeasurementService` com mapper para medidas_corporais
- [x] 6.4 Implementar `SupabaseClinicalNoteService` com mapper para anotacoes_clinicas
- [x] 6.5 Implementar `SupabaseAdesaoService` com mapper para adesao_refeicoes e cálculo de progresso

## 7. UI — Plano Alimentar

- [x] 7.1 Criar `MealPlanForm` — formulário de criação/edição com acordeão por refeição
- [x] 7.2 Criar `FoodItemRow` — linha de alimento com nome, quantidade, calorias e botão remover
- [x] 7.3 Criar `FoodBaseSelector` — autocomplete com busca na base e opção "Criar novo alimento"
- [x] 7.4 Criar `MealPlanPage` — página integrando formulário, voltada ao nutricionista

## 8. UI — Medidas Corporais

- [x] 8.1 Criar `BodyMeasurementForm` — formulário com campos de circunferências, gordura e dobras
- [x] 8.2 Criar `MeasurementHistoryTable` — tabela com histórico ordenado por data
- [ ] 8.3 Criar `MeasurementChart` — gráfico SVG de linha por tipo de medida
- [x] 8.4 Criar `BodyMeasurementFormPage` — página combinando formulário + histórico + gráfico

## 9. UI — Anotações Clínicas

- [x] 9.1 Criar `ClinicalNoteForm` — formulário com data e texto livre
- [x] 9.2 Criar `ClinicalNoteList` — listagem com preview e ações editar/excluir
- [x] 9.3 Criar `ClinicalNotesPage` — página combinando lista + formulário

## 10. UI — Área do Paciente

- [x] 10.1 Criar `PatientMealPlanView` — visualização do plano diário com refeições e alimentos
- [x] 10.2 Criar `AdherenceToggle` — toggle button com optimistic UI para marcar refeição
- [x] 10.3 Criar `ProgressBar` — barra de progresso com contador N/M concluídas
- [x] 10.4 Criar `EvolutionChart` — gráfico SVG de linha dupla (peso + adesão)
- [x] 10.5 Criar `PatientMealPlanPage` — página do paciente com plano, adesão e progresso
- [x] 10.6 Criar `EvolutionChartPage` — página do nutricionista com gráfico de evolução

## 11. Rotas e DI

- [x] 11.1 Registrar rotas do nutricionista em App.tsx (/pacientes/:id/plano-alimentar, /evolucao, /medidas, /anotacoes)
- [x] 11.2 Registrar rota do paciente em App.tsx (/meu-plano)
- [x] 11.3 Atualizar container DI com todos os serviços e casos de uso
- [x] 11.4 Adicionar verificação de sessão expirada com redirect para /login

## 12. Banco de Dados

- [x] 12.1 Criar migration com DDL das tabelas (planos_alimentares, refeicoes, alimentos, alimentos_base, medidas_corporais, anotacoes_clinicas, adesao_refeicoes)
- [x] 12.2 Aplicar RLS policies em todas as tabelas conforme design.md
- [x] 12.3 Inserir seed de alimentos_base (~50 alimentos comuns)
