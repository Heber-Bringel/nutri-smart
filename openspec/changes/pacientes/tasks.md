## 1. Database & RLS

- [x] 1.1 Criar migration para adicionar colunas faltantes (email, imc, tmb, get, deleted_at) na tabela `pacientes`
- [x] 1.2 Atualizar políticas RLS na tabela `pacientes` com suporte a soft delete
- [x] 1.3 Criar trigger `on_auth_user_created_paciente` para vincular `usuario_id` quando paciente confirma e-mail
- [x] 1.4 Criar função `purge_pacientes_excluidos()` para purge de registros com `deleted_at > 90 dias`

## 2. Domínio — Entidades e Interfaces

- [x] 2.1 Criar entidade `Paciente` com campos de domínio (id, nutricionistaId, usuarioId, nomeCompleto, email, dataNascimento, sexoBiologico, pesoInicial, altura, nivelAtividadeFisica, imc, tmb, get, createdAt, updatedAt, deletedAt)
- [x] 2.2 Criar types: `SexoBiologico` (masculino/feminino), `NivelAtividadeFisica` (sedentario/levemente_ativo/moderadamente_ativo/muito_ativo/extremamente_ativo)
- [x] 2.3 Criar interface `IPacienteService` com métodos: create, findAll, findById, softDelete, resendInvite
- [x] 2.4 Criar classe `PacienteError`

## 3. Módulo de Cálculos Nutricionais

- [x] 3.1 Implementar `calculateIMC(pesoKg, alturaCm): number`
- [x] 3.2 Implementar `calculateTMB(pesoKg, alturaCm, idade, sexo): number` (Mifflin-St Jeor)
- [x] 3.3 Implementar `calculateGET(tmb, nivelAtividade): number` com fatores de atividade


## 4. Casos de Uso

- [x] 4.1 Implementar `CreatePacienteUseCase`: validar input, chamar IPacienteService.create()
- [x] 4.2 Implementar `ListPacientesUseCase`: receber filters (search, page), chamar IPacienteService.findAll()
- [x] 4.3 Implementar `GetPacienteUseCase`: receber patientId, chamar IPacienteService.findById()
- [x] 4.4 Implementar `DeletePacienteUseCase`: receber patientId, chamar IPacienteService.softDelete()

## 5. Adapters (Infraestrutura)

- [x] 5.1 Implementar `SupabasePacienteService`: create(), findAll() com range/ilike, findById(), softDelete() com deleted_at
- [x] 5.2 Implementar `PacienteMapper` e atualizar `Container.ts` com novos serviços e casos de uso

## 6. Componentes React

- [x] 6.1 Criar `PatientForm` com campos validados (nomeCompleto, email, dataNascimento, sexoBiologico, pesoInicial, altura, nivelAtividadeFisica)
- [x] 6.2 Criar `PatientFormPage` na rota `/dashboard/pacientes/novo` integrando PatientForm + CreatePacienteUseCase
- [x] 6.3 Criar `PatientSearchBar` com input de busca e debounce de 300ms
- [x] 6.4 Criar `PatientTable` com colunas (nome, e-mail) e paginação (20/página)
- [x] 6.5 Criar `PatientListPage` na rota `/dashboard/pacientes` integrando PatientSearchBar + PatientTable + ListPacientesUseCase
- [x] 6.6 Criar `PatientInfoCard` exibindo dados cadastrais e indicadores clínicos (IMC, TMB, GET)
- [x] 6.7 Criar `PatientProfilePage` na rota `/dashboard/pacientes/:id` integrando PatientInfoCard + GetPacienteUseCase + DeletePatientDialog
- [x] 6.8 Criar `DeletePatientDialog` com modal de confirmação em 2 etapas (digitar "EXCLUIR") + DeletePacienteUseCase

## 7. Roteamento e Integração

- [ ] 7.1 Configurar rota `/patients/new` para PatientFormPage
- [ ] 7.2 Configurar rota `/patients` para PatientListPage
- [ ] 7.3 Configurar rota `/patients/:id` para PatientProfilePage
- [ ] 7.4 Integrar link de reenvio de invite na UI quando o envio falhar


