## 1. Database & RLS

- [x] 1.1 Criar migration para adicionar colunas faltantes (email, imc, tmb, get, deleted_at) na tabela `pacientes`
- [x] 1.2 Atualizar políticas RLS na tabela `pacientes` com suporte a soft delete
- [x] 1.3 Criar trigger `on_auth_user_created_paciente` para vincular `usuario_id` quando paciente confirma e-mail
- [x] 1.4 Criar função `purge_pacientes_excluidos()` para purge de registros com `deleted_at > 90 dias`

## 2. Domínio — Entidades e Interfaces

- [ ] 2.1 Criar entidade `Patient` com campos de domínio (id, nutritionistId, name, email, dateOfBirth, biologicalSex, weightKg, heightCm, activityLevel, imc, tmb, get, createdAt, updatedAt, deletedAt)
- [ ] 2.2 Criar value objects: `BiologicalSex` (male/female), `ActivityLevel` (sedentary/light/moderate/active/very_active), `Email`
- [ ] 2.3 Criar interface `PatientRepository` com métodos: create, findAll, findById, softDelete
- [ ] 2.4 Criar interface `InviteService` com método: sendInvite(email)

## 3. Módulo de Cálculos Nutricionais

- [ ] 3.1 Implementar `calculateIMC(weightKg, heightCm): number`
- [ ] 3.2 Implementar `calculateTMB(weightKg, heightCm, age, sex): number` (Mifflin-St Jeor)
- [ ] 3.3 Implementar `calculateGET(tmb, activityLevel): number` com fatores de atividade


## 4. Casos de Uso

- [ ] 4.1 Implementar `RegisterPatientUseCase`: validar input, calcular IMC/TMB/GET, chamar PatientRepository.create(), chamar InviteService.send()
- [ ] 4.2 Implementar `ListPatientsUseCase`: receber filters (search, page), chamar PatientRepository.findAll() com paginação
- [ ] 4.3 Implementar `GetPatientUseCase`: receber patientId, chamar PatientRepository.findById(), verificar ownership
- [ ] 4.4 Implementar `DeletePatientUseCase`: receber patientId, chamar PatientRepository.softDelete() com cascade lógico

## 5. Adapters (Infraestrutura)

- [ ] 5.1 Implementar `SupabasePatientRepository` (adapter de PatientRepository): create() com insert no Supabase, findAll() com range/ilike, findById(), softDelete() com updated_at + deleted_at
- [ ] 5.2 Implementar `SupabaseAuthAdapter` (adapter de InviteService): sendInvite() usando `auth.invite_user_by_email` do Supabase com opção de reenvio

## 6. Componentes React

- [ ] 6.1 Criar `PatientForm` com campos validados (name, email, dateOfBirth, biologicalSex, weightKg, heightCm, activityLevel) e exibição dos cálculos (IMC/TMB/GET)
- [ ] 6.2 Criar `PatientFormPage` na rota `/patients/new` integrando PatientForm + RegisterPatientUseCase
- [ ] 6.3 Criar `PatientSearchBar` com input de busca e debounce de 300ms
- [ ] 6.4 Criar `PatientTable` com colunas (nome, último atendimento, status do plano) e paginação (20/página)
- [ ] 6.5 Criar `PatientListPage` na rota `/patients` integrando PatientSearchBar + PatientTable + ListPatientsUseCase
- [ ] 6.6 Criar `PatientInfoCard` exibindo dados cadastrais e indicadores clínicos
- [ ] 6.7 Criar `PatientProfilePage` na rota `/patients/:id` integrando PatientInfoCard + GetPatientUseCase
- [ ] 6.8 Criar `DeletePatientDialog` com modal de confirmação em 2 etapas (digitar "EXCLUIR") + DeletePatientUseCase

## 7. Roteamento e Integração

- [ ] 7.1 Configurar rota `/patients/new` para PatientFormPage
- [ ] 7.2 Configurar rota `/patients` para PatientListPage
- [ ] 7.3 Configurar rota `/patients/:id` para PatientProfilePage
- [ ] 7.4 Integrar link de reenvio de invite na UI quando o envio falhar


