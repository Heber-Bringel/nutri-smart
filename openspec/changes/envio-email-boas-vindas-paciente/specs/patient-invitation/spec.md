## ADDED Requirements

### Requirement: Solicitação de convite após cadastro do paciente
O sistema SHALL solicitar o envio de um convite de acesso ao e-mail do paciente somente após a persistência bem-sucedida do cadastro clínico, por meio do contrato de domínio `IPatientInvitationService` implementado por `SupabasePatientInvitationAdapter`. A solicitação MUST ser desacoplada do resultado do cadastro (não bloqueante).

#### Scenario: Convite solicitado após cadastro bem-sucedido
- **GIVEN** um nutricionista autenticado que cadastrou um paciente com e-mail válido
- **WHEN** a persistência do cadastro clínico for concluída
- **THEN** o sistema SHALL solicitar ao Supabase Auth o envio do convite para o e-mail informado
- **AND** SHALL registrar o estado do convite como `enviado` quando a solicitação for aceita

#### Scenario: Cadastro sem e-mail válido não dispara convite
- **GIVEN** um formulário de cadastro de paciente
- **WHEN** o e-mail informado for inválido ou ausente
- **THEN** o sistema SHALL bloquear a submissão do cadastro e não SHALL solicitar convite

### Requirement: Link de convite individual, de uso único e temporário
O convite SHALL conter mensagem de boas-vindas, instruções sobre os próximos passos e um link individual, de uso único, válido por 24 horas, que direciona o paciente à tela de definição de senha. O sistema MUST NOT gerar, transmitir ou armazenar senha em texto aberto, nem derivar senha de dado pessoal (ex.: data de nascimento).

#### Scenario: Paciente define senha por link válido
- **GIVEN** um paciente que recebeu o convite
- **WHEN** ele abrir o link em até 24 horas e informar uma nova senha válida
- **THEN** o sistema SHALL criar/confirmar a credencial no Supabase Auth
- **AND** SHALL vincular `pacientes.usuario_id` ao perfil autenticado do paciente

#### Scenario: Link expirado ou já utilizado
- **GIVEN** um convite cujo link expirou ou já foi utilizado
- **WHEN** o paciente abrir o link
- **THEN** o sistema SHALL exibir mensagem neutra informando que o convite não é mais válido
- **AND** MUST NOT expor token, senha ou existência de outra conta

### Requirement: Tratamento não bloqueante de falhas de envio
Falhas na solicitação do convite SHALL ser registradas com paciente, estado, data e mensagem técnica sanitizada, sem desfazer o cadastro clínico concluído e sem retornar erro ao nutricionista responsável. Nenhum registro público, log ou e-mail MUST conter senha ou token de autenticação.

#### Scenario: Falha no envio mantém o cadastro
- **GIVEN** um cadastro de paciente já persistido
- **WHEN** a solicitação do convite falhar por indisponibilidade ou limite do serviço de e-mail
- **THEN** o sistema SHALL registrar o estado do convite como `falhou` com mensagem técnica sanitizada
- **AND** o paciente SHALL permanecer cadastrado
- **AND** o nutricionista MUST NOT receber erro relativo ao envio

### Requirement: Operação administrativa isolada em Edge Function
A criação/convite de usuário no Supabase Auth SHALL ser executada exclusivamente por uma Supabase Edge Function autenticada, que valida se o solicitante é o nutricionista responsável. A credencial `service_role` MUST NOT ser exposta ao cliente React.

#### Scenario: Solicitante inválido é rejeitado
- **GIVEN** uma requisição de convite recebida pela Edge Function
- **WHEN** o solicitante não for o nutricionista responsável pelo paciente
- **THEN** a Edge Function SHALL rejeitar a operação sem executar o convite e sem expor a chave administrativa

### Requirement: Confidencialidade do estado do convite por RLS
O estado operacional do convite SHALL ser persistido em `convites_paciente`, sem token nem senha. Row Level Security MUST permitir que apenas o nutricionista responsável (`auth.uid() = nutricionista_id`) leia os registros de convite dos seus pacientes; o paciente e terceiros MUST NOT acessar logs ou mensagens técnicas de falha.

#### Scenario: Nutricionista responsável consulta o estado
- **GIVEN** registros de convite vinculados a pacientes de um nutricionista
- **WHEN** esse nutricionista autenticado consultar o estado dos convites
- **THEN** a RLS SHALL retornar apenas os convites cujos `nutricionista_id` correspondem ao seu `auth.uid()`

#### Scenario: Paciente não acessa registros de convite
- **GIVEN** um paciente autenticado
- **WHEN** houver tentativa de leitura da tabela `convites_paciente`
- **THEN** a RLS MUST NOT retornar registros ao paciente
