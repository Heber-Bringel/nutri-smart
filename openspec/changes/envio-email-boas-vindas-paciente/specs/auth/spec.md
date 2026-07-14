## MODIFIED Requirements

### Requirement: Inclusão do campo de e-mail na tabela de pacientes
A tabela `public.pacientes` SHALL possuir a coluna `email VARCHAR(255) NOT NULL`, obrigatória e normalizada, informada pelo nutricionista no cadastro do paciente para envio do convite de acesso e posterior vinculação da conta. O e-mail SHALL ser usado para solicitar o convite (capability `patient-invitation`); o vínculo `usuario_id` SHALL ser preenchido apenas após o paciente aceitar o convite e definir a própria senha.

#### Scenario: Cadastro de paciente pelo nutricionista informando e-mail
- **GIVEN** que o nutricionista autenticado está preenchendo o formulário de cadastro de paciente
- **WHEN** o nutricionista informa os dados antropométricos e um e-mail válido do paciente
- **THEN** o e-mail é persistido em `public.pacientes` como valor obrigatório e normalizado
- **AND** as políticas RLS `pacientes_nutricionista_all` e `pacientes_self_select` garantem que apenas o nutricionista responsável e o próprio paciente (quando vinculado por `usuario_id`) tenham acesso aos dados do paciente

#### Scenario: Cadastro bloqueado sem e-mail
- **GIVEN** o formulário de cadastro de paciente
- **WHEN** o e-mail estiver ausente ou em formato inválido
- **THEN** o sistema SHALL bloquear a submissão e não SHALL persistir o paciente

#### Scenario: Vínculo da conta após aceitação do convite
- **GIVEN** um paciente cadastrado com e-mail e um convite de acesso aceito
- **WHEN** o paciente definir a própria senha pelo link do convite
- **THEN** o sistema SHALL vincular `pacientes.usuario_id` ao perfil autenticado correspondente
- **AND** a RLS `pacientes_self_select` (`auth.uid() = usuario_id`) SHALL passar a permitir que o próprio paciente leia seu registro
