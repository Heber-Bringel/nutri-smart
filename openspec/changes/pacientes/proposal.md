## Why

O nutricionista precisa gerenciar seus pacientes dentro do sistema — cadastrar novos pacientes, visualizar a lista completa, acessar fichas individuais e excluir registros. Sem essa funcionalidade base (Épico 1), nenhum fluxo clínico ou de acompanhamento é possível. Implementa os RF001–RF003 e RF009, HU-02 a HU-04.

## What Changes

- **Cadastro de paciente**: Formulário com nome completo, e-mail, data de nascimento, sexo biológico, peso (kg), altura (cm) e nível de atividade física. Geração de link de primeiro acesso para o paciente definir sua senha.
- **Listagem de pacientes**: Tabela com nome, data do último atendimento e status do plano alimentar ativo. Acesso rápido à ficha de cada paciente.
- **Ficha do paciente**: Visualização completa dos dados cadastrais e clínicos do paciente, integrando histórico e indicadores.
- **Exclusão de paciente**: Exclusão permanente com confirmação em duas etapas, removendo em cascata todos os registros vinculados (dados clínicos, planos alimentares), em conformidade com LGPD Art. 18.
- **RLS & Segurança**: Políticas Row Level Security no Supabase para isolar pacientes por nutricionista autenticado.

## Capabilities

### New Capabilities
- `patient-registration`: Cadastro de pacientes com validação de campos, cálculo automático de IMC/TMB/GET e geração de link de primeiro acesso
- `patient-listing`: Listagem paginada e buscável de pacientes com filtros por nome, data e status do plano
- `patient-deletion`: Exclusão permanente de paciente com confirmação em duas etapas e remoção em cascata de todos os dados vinculados

### Modified Capabilities
*(nenhuma — primeira funcionalidade do domínio de pacientes)*

## Impact

- **Supabase**: Nova tabela `patients` com políticas RLS por `nutritionist_id`
- **Auth**: Trigger `after_insert` para espelhar perfil `patients` ao confirmar e-mail do paciente
- **React**: Novos componentes — `PatientForm`, `PatientList`, `PatientProfile`, `DeletePatientDialog`
- **Domínio**: Novos casos de uso — `RegisterPatientUseCase`, `ListPatientsUseCase`, `GetPatientUseCase`, `DeletePatientUseCase`
- **Repositório**: `PatientRepository` com implementação concreta `SupabasePatientRepository` via adapter pattern
- **Cálculos**: Módulo `nutritional-calculations` (IMC, TMB, GET) integrado ao cadastro
