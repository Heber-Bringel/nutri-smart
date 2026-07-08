## Context

O sistema NutriSmart possui cadastro de pacientes (Épico 1) mas ainda não implementa os fluxos clínicos do nutricionista — criação e edição de planos alimentares (HU-06), seleção de alimentos de uma base cadastrada ou criação manual (HU-22), gráfico de evolução com peso e adesão (HU-07), registro e histórico de medidas corporais (HU-11, HU-12), anotações clínicas (HU-13, HU-14) — nem a área do paciente com visualização do plano diário (HU-08), marcação de refeições (HU-09) e indicador de progresso (HU-10). As tabelas estão modeladas no banco com DDL definido. A implementação segue a arquitetura do PRD: casos de uso isolados de React e Supabase, bibliotecas externas via Adapter, RLS para isolamento de dados.

## Goals / Non-Goals

**Goals:**
- Criar e editar plano alimentar com refeições, alimentos, quantidades e cálculo automático de calorias (RF007–RF008, HU-06)
- Base de Alimentos: selecionar alimentos de uma base sistêmica ou criar manualmente durante a prescrição (RF034, HU-22)
- Gráfico de evolução (peso + adesão, últimos 30 dias) (RF010, HU-07)
- Registrar e consultar histórico de medidas corporais com edição e exclusão (RF020–RF022, HU-11–HU-12)
- Criar, listar, editar e excluir anotações clínicas com isolamento LGPD (RF023–RF025, HU-13–HU-14)
- Área do paciente: visualizar plano diário com refeições/alimentos/calorias (RF011, HU-08), marcar refeições como concluídas (RF012, HU-09), barra de progresso (RF013, HU-10)
- RLS: nutricionista vê apenas seus dados; paciente vê apenas seu plano e adesão

**Non-Goals:**
- Cálculos de IMC/TMB/GET (já existentes, HU-05 — fora do escopo da issue)
- Relatórios PDF (Épico 5)
- Agenda de consultas (Épico 6)
- Notificações push/WhatsApp

## Decisions

### 1. Nomenclatura: Service em vez de Repository

Os adaptadores seguem a convenção `XxxService`/`SupabaseXxxService` para consistência com `IPacienteService` existente.

| Interface | Implementação | Tabelas |
|---|---|---|
| `IMealPlanService` | `SupabaseMealPlanService` | `planos_alimentares`, `refeicoes`, `alimentos` |
| `IFoodBaseService` | `SupabaseFoodBaseService` | `alimentos_base` |
| `IBodyMeasurementService` | `SupabaseBodyMeasurementService` | `medidas_corporais` |
| `IClinicalNoteService` | `SupabaseClinicalNoteService` | `anotacoes_clinicas` |
| `IAdesaoService` | `SupabaseAdesaoService` | `adesao_refeicoes` |

Nenhum caso de uso acessa o Supabase SDK diretamente.

### 2. Casos de Uso

| Caso de Uso | Entrada | Fluxo |
|---|---|---|
| `CreateMealPlanUseCase` | `{ pacienteId, refeicoes: [{ nome, alimentos: [{ nome, quantidade, calorias }] }] }` | valida refeições não vazias, calcula totais calóricos, persiste via service |
| `UpdateMealPlanUseCase` | `planoId, refeicoes` | carrega plano, substitui refeições/alimentos (delete + insert), recalcula totais |
| `GetMealPlanUseCase` | `pacienteId` | retorna plano ativo com refeições e alimentos |
| `SearchFoodBaseUseCase` | `termo` | busca textual em `alimentos_base` por nome |
| `CreateCustomFoodUseCase` | `{ nome, porcao, calorias, proteinas, carboidratos, gorduras }` | persiste alimento customizado vinculado ao nutricionista |
| `GetEvolutionChartDataUseCase` | `pacienteId` | agrega peso (`medidas_corporais`) e % adesão (`adesao_refeicoes`) nos últimos 30 dias |
| `RegisterMeasurementUseCase` | `{ pacienteId, data, cintura, quadril, braco, coxa, gordura, dobras }` | persiste em `medidas_corporais` |
| `ListMeasurementsUseCase` | `pacienteId` | lista medidas ordenadas por data descendente |
| `UpdateMeasurementUseCase` | `id, dados` | atualiza registro |
| `DeleteMeasurementUseCase` | `id` | remove registro |
| `CreateClinicalNoteUseCase` | `{ pacienteId, data, conteudo }` | persiste em `anotacoes_clinicas` |
| `ListClinicalNotesUseCase` | `pacienteId` | lista anotações ordenadas por data |
| `UpdateClinicalNoteUseCase` | `id, conteudo` | atualiza texto |
| `DeleteClinicalNoteUseCase` | `id` | remove anotação |
| `MarkMealAsCompletedUseCase` | `{ refeicaoId, pacienteId, data, concluida }` | upsert em `adesao_refeicoes` |
| `GetDailyProgressUseCase` | `{ pacienteId, data }` | calcula `concluidas / total` do dia |

### 3. Base de Alimentos (HU-22, RF034)

- Tabela `alimentos_base`: seed com alimentos comuns (arroz, feijão, frango, etc.) com valores nutricionais por 100g
- `IFoodBaseService.search(termo)`: busca case-insensitive por nome via `ilike`
- Alimentos customizados criados pelo nutricionista têm `nutricionista_id` preenchido; alimentos sistêmicos têm `nutricionista_id IS NULL`
- `FoodBaseSelector` componente de busca com autocomplete + opção "Criar novo alimento"
- RLS: SELECT liberado para qualquer nutricionista autenticado na base sistêmica; INSERT/UPDATE/DELETE apenas para alimentos próprios (nutricionista_id = auth.uid())

### 4. RLS Policies

- **planos_alimentares**: nutricionista ALL (USING auth.uid() = nutricionista_id); paciente SELECT (via JOIN pacientes ON paciente_id = pacientes.id AND pacientes.usuario_id = auth.uid())
- **refeicoes**: nutricionista ALL (via plano_alimentar_id → nutricionista_id); paciente SELECT (via mesma cadeia → usuario_id)
- **alimentos**: nutricionista ALL (via refeicao_id → plano_alimentar_id → nutricionista_id); paciente SELECT (via mesma cadeia → usuario_id)
- **alimentos_base**: nutricionista SELECT (sistêmicos WHERE nutricionista_id IS NULL) + ALL próprios; paciente sem acesso
- **adesao_refeicoes**: paciente ALL (via paciente_id → usuario_id); nutricionista SELECT (via refeicao_id → plano_alimentar_id → nutricionista_id)
- **medidas_corporais**: nutricionista ALL (USING auth.uid() = nutricionista_id); paciente SELECT (via paciente_id → usuario_id)
- **anotacoes_clinicas**: nutricionista ONLY (USING auth.uid() = nutricionista_id) — paciente sem acesso (LGPD Art. 11)

### 5. Cálculo Automático de Calorias

Somatório calculado no client-side (caso de uso) ao adicionar/remover alimentos. O total é persistido por refeição. Alternativa considerada: trigger PostgreSQL — rejeitada para manter lógica de negócio centralizada e testável.

### 6. Gráfico de Evolução

- Implementado com SVG inline (sem dependência externa — Recharts não está no projeto)
- Dados: peso de `medidas_corporais` + % adesão de `adesao_refeicoes` nos últimos 30 dias
- GET /pacientes/:id/evolucao → linha dupla: peso (eixo Y esquerdo) e % adesão (eixo Y direito)

### 7. Marcação de Refeição (HU-09)

- Toggle button por refeição com optimistic UI: estado visual atualiza imediatamente, requisição Supabase em background
- `INSERT ... ON CONFLICT (refeicao_id, data) DO UPDATE` previne duplicidade

### 8. Rotas

**Nutricionista:**
- `/pacientes/:id/plano-alimentar` → `MealPlanPage`
- `/pacientes/:id/evolucao` → `EvolutionChartPage`
- `/pacientes/:id/medidas` → `BodyMeasurementFormPage`
- `/pacientes/:id/anotacoes` → `ClinicalNotesPage`

**Paciente:**
- `/meu-plano` → `PatientMealPlanPage`

## Risks / Trade-offs

- **[Performance]**: Gráfico com muitos dias degrada. → Últimos 30 dias com GROUP BY no Supabase
- **[Concorrência]**: Marcação simultânea rara. → Unique constraint + tratamento de erro 23505
- **[LGPD]**: Anotações clínicas e medidas são dados sensíveis. → RLS exclusivo do nutricionista; paciente nunca acessa anotações
- **[Base de Alimentos]**: Base sistêmica limitada. → Seed inicial com ~50 alimentos; nutricionista pode complementar com customizados
- **[Complexidade]**: Plano alimentar com múltiplas refeições é o fluxo mais complexo. → Formulário em acordeão por refeição; validação antes de salvar
