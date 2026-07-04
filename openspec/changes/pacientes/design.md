## Context

O sistema NutriSmart atualmente não possui funcionalidades de gestão de pacientes — o nutricionista não pode cadastrar, listar, visualizar fichas nem excluir pacientes. Essa é a funcionalidade base (Épico 1) sobre a qual todos os outros épicos (plano alimentar, medidas, relatórios) dependem. A implementação deve seguir a arquitetura definida no PRD: casos de uso isolados de React e Supabase, bibliotecas externas via Adapter, e RLS para isolamento de dados por nutricionista.

## Goals / Non-Goals

**Goals:**
- Implementar cadastro de paciente com validação de campos obrigatórios e cálculo automático de IMC/TMB/GET
- Implementar listagem de pacientes com busca e filtros, acessível apenas ao nutricionista autenticado
- Implementar ficha do paciente com dados cadastrais completos
- Implementar exclusão lógica ou física de paciente com remoção em cascata de registros vinculados
- Garantir isolamento de dados via RLS — cada nutricionista vê apenas seus pacientes
- Gerar link de primeiro acesso (definição de senha) para o paciente via e-mail

**Non-Goals:**
- Portal completo do paciente (será no Épico 3)
- Plano alimentar e medidas corporais (serão nos Épicos 2 e 4)

## Decisions

### 1. Estrutura da tabela `patients`
- `id`: uuid (PK, default `gen_random_uuid()`)
- `nutritionist_id`: uuid (FK → `profiles.id`, NOT NULL) — dono do registro
- `name`: text (NOT NULL)
- `email`: text (UNIQUE, NOT NULL) — usado para invite e login do paciente
- `date_of_birth`: date (NOT NULL)
- `biological_sex`: `'male' | 'female'` (NOT NULL)
- `weight_kg`: numeric(5,2) (NOT NULL)
- `height_cm`: numeric(5,2) (NOT NULL)
- `activity_level`: `'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'` (NOT NULL)
- `imc`: numeric(4,2) — calculado localmente
- `tmb`: numeric(6,2) — calculado localmente (Mifflin-St Jeor)
- `get`: numeric(6,2) — calculado localmente
- `created_at`: timestamptz (default `now()`)
- `updated_at`: timestamptz (default `now()`)
- `deleted_at`: timestamptz (default null) — para exclusão lógica com cascade programático

**Alternativa considerada**: Exclusão física direta. Optou-se por exclusão lógica (`deleted_at`) para permitir undo window e atender LGPD com purge programático posterior.

### 2. Fluxo de primeiro acesso (invite)
- Nutricionista cadastra paciente → sistema gera token temporário (`auth.invite_user_by_email` do Supabase) → Supabase envia e-mail com link para definir senha → paciente confirma e profile `patients` é espelhado via trigger `after_insert` na tabela `auth.users`
- O e-mail contém apenas instruções de acesso — nenhum dado clínico é enviado por e-mail (LGPD Art. 6)

### 3. RLS Policy
```sql
-- SELECT: nutricionista vê apenas seus pacientes
CREATE POLICY "nutritionist_select_own_patients" ON patients
  FOR SELECT USING (nutritionist_id = auth.uid());

-- INSERT: nutricionista cria pacientes com seu próprio ID
CREATE POLICY "nutritionist_insert_patients" ON patients
  FOR INSERT WITH CHECK (nutritionist_id = auth.uid());

-- UPDATE: nutricionista edita apenas seus pacientes
CREATE POLICY "nutritionist_update_own_patients" ON patients
  FOR UPDATE USING (nutritionist_id = auth.uid());

-- DELETE (lógico): nutricionista "exclui" apenas seus pacientes
CREATE POLICY "nutritionist_soft_delete_own_patients" ON patients
  FOR UPDATE USING (nutritionist_id = auth.uid());
```

### 4. Casos de uso (domínio)
- `RegisterPatientUseCase(input: PatientInput)` → valida campos, calcula IMC/TMB/GET, chama `PatientRepository.create()`, chama `InviteService.send()`
- `ListPatientsUseCase(input: ListFilters)` → chama `PatientRepository.findAll(nutritionistId, filters)` com paginação
- `GetPatientUseCase(input: patientId)` → chama `PatientRepository.findById(patientId)` com verificação de ownership
- `DeletePatientUseCase(input: patientId)` → chama `PatientRepository.softDelete(patientId)` com cascade programático (desvincula planos, anotações, medidas)

### 5. Adapter pattern
- `PatientRepository` (interface de domínio) → `SupabasePatientRepository` (implementação concreta via adapter)
- `InviteService` (interface de domínio) → `SupabaseAuthAdapter` implementa `sendInvite(email)`

### 6. Cálculos nutricionais (módulo isolado)
- `calculateIMC(weight, height)` → peso / (altura/100)²
- `calculateTMB(weight, height, age, sex)` → Mifflin-St Jeor
- `calculateGET(tmb, activityLevel)` → TMB × fator de atividade
- Módulo puro (sem dependências externas), testável isoladamente

### 7. Componentes React
- `PatientFormPage`: rota `/patients/new`, contém `PatientForm` + `NutritionalSummary`
- `PatientListPage`: rota `/patients`, contém `PatientSearchBar` + `PatientTable`
- `PatientProfilePage`: rota `/patients/:id`, contém `PatientInfoCard` + tabs para histórico
- `DeletePatientDialog`: modal de confirmação em 2 etapas com input textual "EXCLUIR"

## Risks / Trade-offs

- **[Dependência]**: O fluxo de invite depende do Supabase Auth + e-mail transacional. Se o e-mail não chegar (spam), o paciente fica sem acesso. → Mitigação: página de reenvio de invite na UI do nutricionista e feedback visual com código de erro do Supabase
- **[Performance]**: Listagem com muitos pacientes pode degradar sem paginação no backend. → Mitigação: paginação via Supabase `.range()` com limite de 20 por página
- **[LGPD]**: Exclusão lógica mantém dados no banco. → Mitigação: job agendado (edge function ou cron) que purga registros com `deleted_at` > 90 dias, e UI informa o paciente sobre a retenção temporária
- **[RLS]**: Políticas RLS mal formuladas podem vazar dados entre nutricionistas. → Mitigação: testes de integração no Supabase Local que validam ownership antes de cada operação (ver `tests/supabase/rls.test.sql`)
