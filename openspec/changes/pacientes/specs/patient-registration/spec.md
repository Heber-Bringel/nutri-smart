## ADDED Requirements

### Requirement: Cadastrar paciente (RF001, HU-02)
O sistema SHALL permitir que o nutricionista cadastre um novo paciente informando nome completo, e-mail, data de nascimento, sexo biológico, peso (kg), altura (cm) e nível de atividade física.
O sistema SHALL calcular automaticamente IMC, TMB (Mifflin-St Jeor) e GET após o cadastro.
O sistema SHALL disparar um e-mail de primeiro acesso (invite) para o paciente definir sua senha.

#### Scenario: Cadastro bem-sucedido
- **WHEN** o nutricionista preenche todos os campos obrigatórios com dados válidos e submete o formulário
- **THEN** o sistema cria o registro na tabela `patients` com `nutritionist_id` igual ao ID do nutricionista autenticado
- **AND** calcula IMC, TMB e GET e persiste os valores
- **AND** retorna os dados do paciente criado com sucesso

#### Scenario: Invite enviado ao paciente
- **WHEN** o cadastro do paciente é concluído com sucesso
- **THEN** o sistema invoca `auth.invite_user_by_email` do Supabase para o e-mail informado
- **AND** o paciente recebe um e-mail com link para definição de senha
- **AND** nenhum dado clínico é incluído no corpo do e-mail

#### Scenario: Validação de campos obrigatórios
- **WHEN** o nutricionista tenta cadastrar sem preencher nome, e-mail ou data de nascimento
- **THEN** o sistema exibe mensagens de erro específicas para cada campo ausente
- **AND** o formulário não é submetido

#### Scenario: E-mail duplicado
- **WHEN** o nutricionista tenta cadastrar um paciente com e-mail já existente no sistema
- **THEN** o sistema retorna erro de e-mail duplicado
- **AND** exibe a mensagem "Já existe um paciente cadastrado com este e-mail"

#### Scenario: Cálculo automático de IMC
- **WHEN** o nutricionista informa peso = 70 kg e altura = 175 cm
- **THEN** o sistema calcula IMC = 22.86 (70 / (1.75)²)

#### Scenario: Cálculo automático de TMB (homem)
- **WHEN** o nutricionista informa sexo = masculino, peso = 70 kg, altura = 175 cm, idade = 30 anos
- **THEN** o sistema calcula TMB = 10 × 70 + 6.25 × 175 - 5 × 30 + 5 = 1663.75 kcal/dia

#### Scenario: Cálculo automático de TMB (mulher)
- **WHEN** o nutricionista informa sexo = feminino, peso = 60 kg, altura = 165 cm, idade = 30 anos
- **THEN** o sistema calcula TMB = 10 × 60 + 6.25 × 165 - 5 × 30 - 161 = 1320.25 kcal/dia

#### Scenario: Cálculo automático de GET
- **WHEN** o sistema calcula TMB = 1663.75 e o nível de atividade é "moderate" (fator 1.55)
- **THEN** o sistema calcula GET = 1663.75 × 1.55 = 2578.81 kcal/dia

#### Scenario: RLS — nutricionista cria apenas seus pacientes
- **WHEN** o nutricionista autenticado com ID `X` submete o cadastro
- **THEN** a política RLS `nutritionist_insert_patients` assegura que `nutritionist_id = auth.uid()` = X
- **AND** nutricionistas com ID diferente de X não conseguem visualizar este registro

#### Scenario: Resposta de erro do Supabase Auth no invite
- **WHEN** o cadastro é salvo mas o envio do invite falha (e.g., e-mail inválido)
- **THEN** o sistema retorna erro com a mensagem do Supabase Auth
- **AND** o nutricionista pode reenviar o invite manualmente pela interface
