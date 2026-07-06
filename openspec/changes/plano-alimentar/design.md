## Context

O sistema NutriSmart possui cadastro de pacientes (Épico 1) mas ainda não implementa os fluxos clínicos do nutricionista — criação e edição de planos alimentares, registro de medidas corporais e anotações clínicas — nem a área do paciente com visualização do plano diário, marcação de refeições e indicador de progresso. As tabelas `planos_alimentares`, `refeicoes`, `alimentos`, `adesao_refeicoes`, `medidas_corporais` e `anotacoes_clinicas` já estão modeladas no banco com DDL e RLS policies definidas. A implementação deve seguir a arquitetura do PRD: casos de uso isolados de React e Supabase, bibliotecas externas via Adapter, RLS para isolamento de dados.

## Goals / Non-Goals

**Goals:**
- Implementar criação e edição de plano alimentar com refeições, alimentos e cálculo automático de calorias (RF007, RF008, HU-06)
- Implementar gráfico de evolução com peso e percentual de adesão (últimos 30 dias) (RF010, HU-07)
- Implementar registro e histórico (tabela + gráfico) de medidas corporais com edição e exclusão (RF020–RF022, HU-11–HU-12)
- Implementar registro, listagem, edição e exclusão de anotações clínicas com isolamento LGPD Art. 11 (RF023–RF025, HU-13–HU-14)
- Implementar área do paciente: visualização do plano diário, marcação de refeições como concluídas e barra de progresso (RF011–RF013, HU-08–HU-10)
- Garantir RLS: nutricionista vê apenas seus pacientes/planos/medidas/anotações; paciente vê apenas seu plano e suas refeições

**Non-Goals:**
- Cálculos de IMC/TMB/GET (já implementados no Épico 1 / HU-05)
- Emissão de relatórios em PDF (será no Épico 5)
- Agenda de consultas (será no Épico 6)
- Notificações push ou WhatsApp

## Decisions

### 1. Arquitetura de Casos de Uso (Domínio)

Cada operação clínica será um caso de uso isolado com injeção de repositório por interface, seguindo o padrão dos casos de uso existentes (ex: `RegisterPatientUseCase`).

```
CreateMealPlanUseCase(input: CreateMealPlanInput) → valida refeições não vazias, calcula totais calóricos, chama MealPlanRepository.create()
UpdateMealPlanUseCase(input: UpdateMealPlanInput) → carrega plano existente, aplica alterações, recalcula totais, chama MealPlanRepository.update()
GetMealPlanUseCase(patientId) → chama MealPlanRepository.findByPatient(patientId)
RegisterMeasurementUseCase(input: MeasurementInput) → chama BodyMeasurementRepository.create()
ListMeasurementsUseCase(patientId) → chama BodyMeasurementRepository.findByPatient(patientId)
UpdateMeasurementUseCase(id, input) → chama BodyMeasurementRepository.update(id, input)
DeleteMeasurementUseCase(id) → chama BodyMeasurementRepository.delete(id)
CreateClinicalNoteUseCase(input: NoteInput) → chama ClinicalNoteRepository.create()
ListClinicalNotesUseCase(patientId) → chama ClinicalNoteRepository.findByPatient(patientId)
UpdateClinicalNoteUseCase(id, input) → chama ClinicalNoteRepository.update(id, input)
DeleteClinicalNoteUseCase(id) → chama ClinicalNoteRepository.delete(id)
MarkMealAsCompletedUseCase(refeicaoId, pacienteId, data) → upsert em adesao_refeicoes
GetDailyProgressUseCase(pacienteId, data) → calcula N concluídas / N total do dia
```

### 2. Repositórios (Adapter Pattern)

| Interface de Domínio | Implementação Concreta | Tabela |
|---|---|---|
| `MealPlanRepository` | `SupabaseMealPlanRepository` | `planos_alimentares`, `refeicoes`, `alimentos` |
| `BodyMeasurementRepository` | `SupabaseBodyMeasurementRepository` | `medidas_corporais` |
| `ClinicalNoteRepository` | `SupabaseClinicalNoteRepository` | `anotacoes_clinicas` |
| `AdesaoRepository` | `SupabaseAdesaoRepository` | `adesao_refeicoes` |

Nenhum caso de uso acessa o Supabase SDK diretamente — todo acesso a dados passa pela interface de repositório.

### 3. RLS Policies

As políticas já estão definidas em `docs/database.md` e serão aplicadas via migration. Resumo por tabela:

- **planos_alimentares**: nutricionista ALL (USING auth.uid() = nutricionista_id); paciente SELECT (via JOIN com pacientes.usuario_id)
- **refeicoes**: nutricionista ALL (via plano_alimentar_id → nutricionista_id); paciente SELECT (via plano_alimentar_id → paciente_id → usuario_id)
- **alimentos**: nutricionista ALL (via refeicao_id → plano_alimentar_id → nutricionista_id); paciente SELECT (via refeicao_id → plano_alimentar_id → paciente_id → usuario_id)
- **adesao_refeicoes**: paciente ALL (via paciente_id → usuario_id); nutricionista SELECT (via refeicao_id → plano_alimentar_id → nutricionista_id)
- **medidas_corporais**: nutricionista ALL (USING auth.uid() = nutricionista_id); paciente SELECT (via paciente_id → usuario_id)
- **anotacoes_clinicas**: nutricionista ONLY (USING auth.uid() = nutricionista_id) — paciente não tem acesso (LGPD Art. 11)
- **historico_peso**: nutricionista ALL; paciente SELECT

### 4. Cálculo Automático de Calorias

O somatório de calorias por refeição é calculado no client-side (camada de domínio) ao adicionar/remover alimentos, e o total é persistido como campo calculado na tabela `refeicoes` ou calculado via query com `SUM(calorias)`.

**Alternativa considerada**: trigger PostgreSQL para recalcular total. Optou-se pelo cálculo no domínio para manter a lógica de negócio centralizada e testável, sem depender de funções de banco.

### 5. Gráfico de Evolução (HU-07)

- Biblioteca: Recharts (já utilizado no projeto, sem dependência externa adicional)
- Dados: `historico_peso` (peso) + `adesao_refeicoes` (percentual de adesão por data)
- Query: `SELECT data, AVG(concluida::int) * 100 as adesao FROM adesao_refeicoes WHERE paciente_id = :id AND data >= CURRENT_DATE - 30 GROUP BY data`
- Gráfico de linha dupla (eixo Y esquerdo: peso, eixo Y direito: % adesão)

### 6. Componentes React (Rotas)

**Área do Nutricionista:**
- `/patients/:id/meal-plan` → `MealPlanPage` (criação/edição do plano)
- `/patients/:id/evolution` → `EvolutionChartPage` (gráfico de evolução)
- `/patients/:id/measurements` → `BodyMeasurementsPage` (registro + histórico)
- `/patients/:id/clinical-notes` → `ClinicalNotesPage` (lista + formulário)

**Área do Paciente:**
- `/my-plan` → `PatientMealPlanPage` (refeições do dia + toggle adesão + barra de progresso)

### 7. Marcação de Refeição (HU-09)

- Implementado como toggle button em cada refeição
- Até 2 toques/cliques para marcar (RNF004)
- Otimistic UI: estado visual atualiza imediatamente, requisição ao Supabase em background
- Unique constraint `(refeicao_id, data)` na tabela `adesao_refeicoes` previne duplicidade

### 8. Adapter para Cálculos (já existente)

O módulo `nutritional-calculations` com IMC/TMB/GET já existe e não será alterado (excluído do escopo).

## Risks / Trade-offs

- **[Performance]**: Gráfico de evolução com muitos dias pode degradar com re-renders. → Mitigação: paginação nos últimos 30 dias (default) com opção de intervalo customizado; dados agregados via SQL `GROUP BY` no Supabase
- **[Concorrência]**: Marcação de refeição simultânea (raro em cenário acadêmico) pode causar conflito de upsert. → Mitigação: constraint UNIQUE + tratamento de erro 23505 (duplicate key) com feedback visual
- **[LGPD]**: Anotações clínicas são dados sensíveis (Art. 11). → Mitigação: RLS restringe acesso exclusivamente ao nutricionista; nenhuma política SELECT para paciente na tabela `anotacoes_clinicas`; UI do paciente não expõe nem o número de anotações existentes
- **[Dependência]**: Gráfico de evolução e histórico de medidas dependem de dados preenchidos anteriormente. → Mitigação: estado vazio (empty state) com mensagem clara "Nenhum registro encontrado" e CTA para criar o primeiro registro
- **[Complexidade]**: O fluxo de criação de plano alimentar (múltiplas refeições, cada uma com múltiplos alimentos) é o de maior complexidade do MVP (HU-06). → Mitigação: formulário em etapas (step-by-step) ou acordeão por refeição; validação por refeição antes de salvar
