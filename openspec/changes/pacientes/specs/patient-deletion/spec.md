## ADDED Requirements

### Requirement: Excluir paciente (RF009, HU-04)
O sistema SHALL permitir que o nutricionista exclua permanentemente um paciente, incluindo todos os dados clínicos e planos alimentares vinculados, com confirmação em duas etapas.
A exclusão SHALL ser lógica (`deleted_at`), com purge físico programado após 90 dias para atender ao Art. 18 da LGPD.

#### Scenario: Confirmação em duas etapas
- **WHEN** o nutricionista clica em "Excluir paciente" na ficha do paciente
- **THEN** o sistema exibe um modal de confirmação com a mensagem "Tem certeza que deseja excluir este paciente? Esta ação removerá todos os dados clínicos e planos alimentares vinculados."
- **AND** o modal requer que o nutricionista digite "EXCLUIR" em um campo de texto antes de habilitar o botão de confirmação

#### Scenario: Exclusão bem-sucedida
- **WHEN** o nutricionista confirma a exclusão no modal
- **THEN** o sistema define `deleted_at = now()` no registro do paciente
- **AND** o paciente não aparece mais na listagem (filtro `deleted_at IS NULL`)
- **AND** o sistema desvincula logicamente os registros associados (planos alimentares, anotações clínicas, medidas corporais)

#### Scenario: Exclusão de paciente inexistente
- **WHEN** o nutricionista tenta excluir um paciente cujo ID não existe
- **THEN** o sistema retorna erro "Paciente não encontrado"

#### Scenario: Acesso negado na exclusão
- **WHEN** o nutricionista tenta excluir um paciente de outro nutricionista
- **THEN** a política RLS bloqueia a operação
- **AND** o sistema retorna erro de permissão

#### Scenario: RLS — soft delete
- **WHEN** o nutricionista autenticado executa a exclusão lógica
- **THEN** a política RLS `nutritionist_soft_delete_own_patients` permite o UPDATE apenas se `nutritionist_id = auth.uid()`

#### Scenario: Purga programática (LGPD)
- **WHEN** um job agendado (edge function ou cron) é executado diariamente
- **THEN** o sistema identifica registros com `deleted_at` há mais de 90 dias
- **AND** executa DELETE físico desses registros e de todos os dados vinculados em cascata
- **AND** registra a purga em log de auditoria
