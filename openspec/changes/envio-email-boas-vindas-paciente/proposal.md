## Why

Hoje o paciente é cadastrado pelo nutricionista, mas não há um fluxo seguro para ele ativar a própria conta e acessar sua área. A issue #53 exige que, após o cadastro, o paciente receba por e-mail um convite de boas-vindas para acessar o sistema. Implementa RF035 e HU-22 (ERS v1.3), com apoio de RF001, RF015, RF019 e RNF014.

## What Changes

- Torna o e-mail **obrigatório** no cadastro do paciente (RF001) — **BREAKING** em relação ao schema atual, onde `pacientes.email` é opcional.
- Após a persistência bem-sucedida do cadastro clínico, o sistema solicita ao Supabase Auth o envio de um convite de acesso ao e-mail informado (RF035).
- O convite contém boas-vindas, instruções e um link individual, de uso único, válido por 24 horas, pelo qual o paciente define a própria senha.
- Nenhuma senha é gerada, transmitida em texto aberto ou derivada de dado pessoal (ex.: data de nascimento).
- A solicitação do convite é **não bloqueante**: falhas de envio são registradas sem desfazer o cadastro e sem retornar erro ao nutricionista (RNF014).
- Registro do estado operacional do convite (`pendente`, `enviado`, `falhou`, `aceito`) em nova tabela, sem armazenar token ou senha.
- Vínculo de `pacientes.usuario_id` ao perfil autenticado após o paciente definir a senha.
- Nova tela `/definir-senha` para criação de senha a partir do link do convite.

## Capabilities

### New Capabilities

- `patient-invitation`: convite seguro de acesso do paciente após o cadastro — solicitação via `IPatientInvitationService`/`SupabasePatientInvitationAdapter` executada por Supabase Edge Function, link de uso único válido por 24 horas, tela de definição de senha, tratamento não bloqueante de falhas e RLS do estado do convite (RF035, HU-22, RNF014; ADR 0006).

### Modified Capabilities

- `auth`: o requisito "Inclusão do campo de e-mail na tabela de pacientes" passa a exigir e-mail **obrigatório** (`NOT NULL`, normalizado) e a descrever o vínculo posterior de `usuario_id` após aceitação do convite (RF001).

## Impact

- **Requisitos:** RF001 (e-mail obrigatório), RF035, RNF014; apoio de RF015 e RF019.
- **Banco de dados:** `pacientes.email` de `NULL` para `NOT NULL`; nova tabela `convites_paciente` com RLS (somente o nutricionista responsável consulta o estado).
- **Domínio/Infra:** novo contrato `IPatientInvitationService` e adapter `SupabasePatientInvitationAdapter`; caso de uso de convite acionado após o cadastro (UC-03).
- **Supabase:** nova Edge Function para operação administrativa do Auth (a `service_role` nunca é exposta ao React); template de e-mail de convite.
- **UI:** campo de e-mail obrigatório no formulário de cadastro; nova rota/tela `/definir-senha`.
- **Documentação de referência:** ERS v1.3, ADR 0006, `docs/database.md`, `docs/ui-system-design.md`, `docs/Context/USE_CASES.md` (UC-03).
- **Fora de escopo:** SMTP externo (ex.: Resend) permanece alternativa futura sem alterar os contratos de domínio.
