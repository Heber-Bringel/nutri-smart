# NutriSmart — Atividade Prática (Épicos, Histórias de Usuário e Casos de Uso)

**Versão 1.3 — Escopo ampliado: Convite Seguro de Acesso do Paciente**

| Campo | Descrição |
|-------|-----------|
| Componente Curricular | Engenharia de Software 2 |
| Professor | Mayllon Veras |
| Semestre | 2026.1 |
| Documento | Atividade Prática — MVP NutriSmart |
| Versão | 1.3 (alinhada à ERS v1.3 — convite seguro de acesso) |
| Versão Anterior | 1.2 (módulos clínicos, relatórios e agenda) |

Esta revisão (1.2) incorpora ao backlog os quatro módulos adicionados na ERS v1.1: Registro de Medidas Corporais, Anotações Clínicas, Emissão de Relatórios e Agenda de Consultas (RF020–RF033).

A versão 1.3 formaliza a Base de Alimentos como HU-21 e adiciona a HU-22 para o convite seguro de acesso do paciente após seu cadastro clínico.

Os épicos e histórias anteriores permanecem reproduzidos para manter o documento autocontido; a HU-02 foi atualizada para exigir o e-mail necessário ao convite.

---

# 1. Épicos Principais do MVP

Com base na análise da ERS NutriSmart (versão atual 1.3), foram identificados sete épicos que organizam todas as funcionalidades do MVP em grupos de valor coerentes.

| Épico | Nome | Requisitos | Descrição Resumida |
|-------|------|------------|--------------------|
| Épico 0 | Autenticação e Controle de Acesso | RF000 (RF015–RF019) | Garante que apenas usuários cadastrados acessem o sistema, com perfis distintos para nutricionista e paciente. Base de segurança para todos os demais épicos. |
| Épico 1 | Gestão de Pacientes | RF001, RF002, RF003, RF009, RF035 | Concentra o ciclo de vida do paciente: criação, convite seguro de acesso, consulta, listagem e exclusão. |
| Épico 2 | Avaliação e Planejamento Nutricional | RF004–RF008, RF010 | Engloba os cálculos clínicos automáticos (IMC, TMB, GET) e toda a gestão do plano alimentar criado pelo nutricionista. |
| Épico 3 | Adesão e Acompanhamento pelo Paciente | RF011–RF014 | Agrupa as funcionalidades voltadas ao paciente: visualização do plano diário, marcação de refeições concluídas e acompanhamento do progresso. |
| Épico 4 | Avaliação Clínica Avançada | RF020–RF025 | Amplia o acompanhamento clínico além do peso isolado: registro e histórico de medidas corporais e anotações clínicas de consulta. |
| Épico 5 | Relatórios | RF026–RF028 | Permite a emissão de relatórios consolidados em PDF com dados cadastrais, indicadores clínicos, evolução e plano alimentar do paciente. |
| Épico 6 | Agenda de Consultas | RF029–RF033 | Organiza a rotina do nutricionista com agendamento, visualização e gestão de consultas, com validação de conflitos de horário. |

## Épico 0 — Autenticação e Controle de Acesso

É o épico de infraestrutura de segurança do MVP. Sem autenticação funcional, nenhum dado clínico pode ser acessado com segurança.

Implementado via Supabase Auth com JWT e Row Level Security (RLS), garante que nutricionistas acessem apenas seus próprios pacientes e que cada paciente visualize exclusivamente seu plano alimentar.

Este épico é pré-requisito de todos os demais.

## Épico 1 — Gestão de Pacientes

Concentra todas as operações relacionadas ao ciclo de vida do registro de um paciente no sistema: criação, convite para definição de senha, consulta, listagem e exclusão.

É o épico base, pois sem pacientes cadastrados nenhuma outra funcionalidade pode ser utilizada.

Depende do Épico 0 para garantir que o nutricionista esteja autenticado.

## Épico 2 — Avaliação e Planejamento Nutricional

Engloba os cálculos clínicos automáticos (IMC, TMB, GET) e toda a gestão do plano alimentar criado pelo nutricionista.

É o épico de maior complexidade e maior valor clínico do MVP original, sendo responsável pela proposta central de eficiência e precisão descrita na ERS.

## Épico 3 — Adesão e Acompanhamento pelo Paciente

Agrupa as funcionalidades voltadas ao paciente:

- Visualização do plano diário;
- Marcação de refeições concluídas;
- Acompanhamento do progresso.

Traduz o engajamento do paciente descrito como um dos pilares de valor do MVP.

O acesso do paciente à sua área depende diretamente do Épico 0.

## Épico 4 — Avaliação Clínica Avançada (Novo)

Estende o Épico 2 com um acompanhamento clínico mais completo:

- medidas corporais;
- circunferências;
- percentual de gordura;
- dobras cutâneas;
- anotações de consulta em texto livre.

Permite ao nutricionista enxergar a evolução do paciente para além do peso, mantendo um histórico clínico textual privado por atendimento.

Depende dos Épicos 0 e 1.

## Épico 5 — Relatórios (Novo)

Consolida em um único documento PDF os dados já existentes no sistema:

- cadastro;
- indicadores;
- medidas;
- evolução;
- plano alimentar.

Elimina o trabalho manual de montar relatórios para o paciente ou encaminhamentos.

Depende dos Épicos 1, 2 e 4.

## Épico 6 — Agenda de Consultas (Novo)

Organiza a rotina de atendimento do nutricionista, com:

- agendamento;
- visualização em calendário;
- prevenção de conflitos de horário.

O paciente também passa a visualizar sua próxima consulta agendada.

Depende do Épico 0 (autenticação) e do Épico 1 (paciente já cadastrado).

---

# 2. Histórias de Usuário

Cada épico foi decomposto em histórias de usuário escritas no formato padrão:

> Como...
> Quero...
> Para que...

com critérios de aceitação mensuráveis e rastreados aos requisitos da ERS.

# Épico 0 — Autenticação e Controle de Acesso

## HU-00 — Prioridade: Alta (Crítica — pré-requisito do sistema)

Como usuário (nutricionista ou paciente), quero realizar login no sistema utilizando meu e-mail e senha, para que eu possa acessar as funcionalidades correspondentes ao meu perfil de forma segura e isolada.

### Critérios de Aceitação

- Formulário de login exibe campos de e-mail e senha com validação de formato (RF000)
- Credenciais inválidas exibem mensagem de erro sem revelar qual campo está incorreto
- Login bem-sucedido redireciona nutricionista ao painel de pacientes e paciente à sua área de dieta
- Sessão JWT gerenciada pelo Supabase Auth persiste entre abas do navegador (RNF005)
- Políticas de Row Level Security garantem que o nutricionista acesse apenas seus próprios pacientes.

**Requisitos:** RF000, Supabase Auth, RNF005
## HU-01 — Prioridade: Alta

Como usuário (nutricionista ou paciente), quero recuperar minha senha por meio de um link enviado ao meu e-mail cadastrado, para que eu possa voltar a acessar minha conta mesmo que esqueça a senha, sem depender de suporte manual.

### Critérios de Aceitação

- Tela de login exibe link **"Esqueci minha senha"** visível sem necessidade de rolagem.
- Ao informar o e-mail, o sistema envia link de redefinição via Supabase Auth em até 60 segundos.
- Link de redefinição expira em 1 hora e é válido para uso único.
- Após redefinição bem-sucedida, o usuário é redirecionado à tela de login com mensagem de confirmação.

**Requisitos:** RF000a, Supabase Auth

---

# Épico 1 — Gestão de Pacientes

## HU-02 — Prioridade: Alta

Como nutricionista, quero cadastrar um novo paciente informando nome completo, e-mail, data de nascimento, sexo biológico, peso (kg), altura (cm) e nível de atividade física, para que eu possa registrar suas informações clínicas no sistema e gerar os indicadores nutricionais automaticamente.

### Critérios de Aceitação

- Todos os campos são obrigatórios, incluindo e-mail em formato válido; o formulário bloqueia submissão com campos vazios (RF001).
- Após o cadastro, o paciente aparece imediatamente na listagem (RF002).
- A persistência bem-sucedida inicia o fluxo independente de convite de acesso (RF035), sem atrasar ou desfazer o cadastro clínico.
- Os dados são persistidos no Supabase com RLS vinculando o paciente ao nutricionista autenticado (RNF005).

**Requisitos:** RF001, RF002, RNF005

---

## HU-03 — Prioridade: Alta

Como nutricionista, quero visualizar a lista completa dos meus pacientes com nome, data do último atendimento e status do plano alimentar ativo, para que eu possa acessar rapidamente a ficha de qualquer paciente e priorizar os atendimentos.

### Critérios de Aceitação

- Lista exibe nome, data do último atendimento e indicador de status do plano (RF002).
- Apenas pacientes vinculados ao nutricionista autenticado são exibidos (RLS — Épico 0).
- Clique em qualquer paciente abre a ficha completa com histórico e indicadores clínicos (RF003).
- Tempo de resposta inferior a 2 segundos para até 10 usuários simultâneos (RNF001).

**Requisitos:** RF002, RF003, RNF001

---

## HU-04 — Prioridade: Média

Como nutricionista, quero excluir permanentemente o registro de um paciente, incluindo todos os dados clínicos e planos alimentares vinculados, para que eu possa manter a base de dados atualizada e sem registros obsoletos.

### Critérios de Aceitação

- Sistema solicita confirmação antes de executar a exclusão (RF009).
- Todos os dados vinculados (planos, histórico e indicadores) são removidos junto com o registro (RF009).
- O paciente desaparece da listagem imediatamente após a exclusão confirmada.
- Exclusão respeita o direito de remoção de dados previsto no Art. 18 da LGPD.

**Requisitos:** RF009, LGPD Art. 18

---

# Épico 2 — Avaliação e Planejamento Nutricional

## HU-05 — Prioridade: Alta

Como nutricionista, quero que o sistema calcule automaticamente o IMC, a TMB e o Gasto Energético Total (GET) ao cadastrar ou editar um paciente, para que eu elimine erros manuais nos cálculos e reduza o tempo administrativo por consulta.

### Critérios de Aceitação

- IMC calculado a partir de peso e altura, exibindo valor numérico e classificação OMS (RF004).
- TMB calculada pela fórmula Mifflin-St Jeor diferenciada por sexo biológico, em kcal/dia (RF005).
- GET = TMB × fator de atividade física selecionado no cadastro (RF006).
- Resultado exibido em menos de 500 ms após a submissão do formulário (RNF002).

**Requisitos:** RF004, RF005, RF006, RNF002

---

## HU-06 — Prioridade: Alta

Como nutricionista, quero criar um plano alimentar personalizado para o paciente, definindo refeições (café da manhã, almoço, jantar etc.) e adicionando alimentos com quantidades e calorias, para que eu possa prescrever uma dieta adequada às necessidades calóricas e clínicas de cada paciente.

### Critérios de Aceitação

- Plano vinculado ao paciente selecionado com pelo menos uma refeição cadastrada (RF007).
- Cada refeição aceita múltiplos alimentos com nome, quantidade (g/ml) e valor calórico.
- O sistema calcula automaticamente o total calórico por refeição.
- Plano salvo fica disponível para visualização do paciente autenticado (RF011, Épico 0).

**Requisitos:** RF007, RF011

---

## HU-07 — Prioridade: Alta

Como nutricionista, quero visualizar um gráfico de linha com a evolução de peso e o percentual de adesão diária ao plano alimentar do paciente, para que eu possa avaliar a efetividade do tratamento e ajustar o plano conforme a evolução clínica.

### Critérios de Aceitação

- Gráfico de linha exibe peso (eixo Y) por data (eixo X) com dados históricos do paciente (RF010).
- Percentual de adesão diária ao plano alimentar exibido na mesma tela (RF010).
- Dados dos últimos 30 dias apresentados por padrão (RF014).
- Apenas dados do paciente selecionado são exibidos, respeitando o isolamento por RLS.

**Requisitos:** RF010, RF014
# Épico 3 — Adesão e Acompanhamento pelo Paciente

## HU-08 — Prioridade: Alta

Como paciente, quero visualizar as refeições planejadas para o dia atual com nome da refeição, lista de alimentos, quantidades e calorias totais por refeição, para que eu saiba exatamente o que comer em cada horário sem precisar contatar o nutricionista.

### Critérios de Aceitação

- Acesso à área do paciente exige autenticação prévia via Supabase Auth (Épico 0).
- Exibe somente as refeições do dia atual vinculadas ao paciente autenticado (RF011).
- Lista alimentos com quantidade em g/ml e calorias individuais e totais por refeição (RF011).
- Interface responsiva e funcional em telas a partir de 360px de largura (RNF003).
- Funcionamento verificado no Chrome Mobile e Safari Mobile (RNF003).

**Requisitos:** RF011, RNF003, Épico 0

---

## HU-09 — Prioridade: Alta

Como paciente, quero marcar cada refeição do dia como concluída utilizando no máximo dois toques na tela, para que eu registre minha adesão ao plano de forma rápida e sem dificuldade técnica.

### Critérios de Aceitação

- Marcação executável em no máximo 2 interações (toques/cliques), sem navegação entre telas (RNF004).
- Estado de marcação persistido no Supabase com vínculo ao paciente autenticado (RNF005).
- Interface atualiza visualmente de imediato após a marcação, sem recarregar a página (RF012).

**Requisitos:** RF012, RNF004, RNF005

---

## HU-10 — Prioridade: Alta

Como paciente, quero ver um indicador visual de progresso diário mostrando quantas refeições já concluí em relação ao total planejado para o dia, para que eu me mantenha motivado e tenha clareza sobre meu desempenho ao longo do dia.

### Critérios de Aceitação

- Barra de progresso ou percentual exibido na tela principal do paciente (RF013).
- Indicador atualiza automaticamente a cada refeição marcada como concluída (RF013).
- Exibição correta em todos os navegadores suportados: Chrome 120+, Firefox 120+, Safari 17+ (RNF009).

**Requisitos:** RF013, RNF009

---

# Épico 4 — Avaliação Clínica Avançada (Novo)

## HU-11 — Prioridade: Alta

Como nutricionista, quero registrar medidas corporais do paciente (circunferências, percentual de gordura e dobras cutâneas) a cada atendimento, para que eu possa acompanhar a evolução clínica do paciente além do peso isolado.

### Critérios de Aceitação

- Formulário permite registrar circunferência de cintura, quadril, braço e coxa, percentual de gordura e dobras cutâneas (RF020).
- Cada registro é associado automaticamente à data do atendimento.
- Os dados são persistidos no Supabase com RLS vinculando o registro ao paciente e ao nutricionista autenticado.
- Resultado salvo fica disponível imediatamente no histórico do paciente (RF021).

**Requisitos:** RF020, RNF005

---

## HU-12 — Prioridade: Média

Como nutricionista, quero visualizar o histórico de medidas corporais do paciente em tabela e em gráfico, para que eu possa comparar a evolução entre atendimentos e ajustar a conduta clínica.

### Critérios de Aceitação

- Histórico exibido em tabela cronológica com todas as medidas registradas (RF021).
- Gráfico de evolução disponível por tipo de medida (ex.: percentual de gordura ao longo do tempo) (RF021).
- Nutricionista pode editar ou excluir um registro lançado incorretamente (RF022).
- Apenas dados do paciente selecionado são exibidos, respeitando o isolamento por RLS.

**Requisitos:** RF021, RF022

---

## HU-13 — Prioridade: Alta

Como nutricionista, quero registrar uma anotação clínica em texto livre vinculada ao paciente e à data do atendimento, para que eu mantenha um histórico de observações sobre a evolução, adesão e queixas do paciente.

### Critérios de Aceitação

- Campo de texto livre disponível na ficha do paciente, vinculado à data do atendimento (RF023).
- Anotação é visível apenas ao nutricionista responsável pelo paciente, nunca ao paciente (RF023).
- Anotação persistida no Supabase com RLS, tratada como dado de saúde sensível (Art. 11 da LGPD).

**Requisitos:** RF023, LGPD Art. 11

---

## HU-14 — Prioridade: Média

Como nutricionista, quero visualizar, editar e excluir as anotações clínicas já registradas para um paciente, para que eu possa manter o histórico de observações correto e atualizado.

### Critérios de Aceitação

- Lista cronológica de anotações exibida na ficha do paciente, com data e autor (RF024).
- Nutricionista pode editar o texto de uma anotação existente (RF025).
- Nutricionista pode excluir uma anotação mediante confirmação (RF025).

**Requisitos:** RF024, RF025
# Épico 5 — Relatórios (Novo)

## HU-15 — Prioridade: Alta

Como nutricionista, quero gerar um relatório em PDF do paciente contendo dados cadastrais, indicadores clínicos, histórico de medidas, evolução de peso e o plano alimentar vigente, para que eu possa documentar o atendimento ou compartilhar as informações com o paciente.

### Critérios de Aceitação

- Relatório inclui dados cadastrais, IMC, TMB, GET, histórico de medidas corporais, gráfico de evolução de peso e plano alimentar vigente (RF026).
- Relatório é gerado em formato PDF a partir dos dados já carregados no navegador (client-side).
- Relatório gerado e disponível para download em até 3 segundos para pacientes com até 90 dias de histórico (RNF011).
- Sistema permite download e impressão direta do relatório pelo navegador (RF027).

**Requisitos:** RF026, RF027, RNF011

---

## HU-16 — Prioridade: Baixa

Como nutricionista, quero selecionar o período (últimos 30, 60 ou 90 dias) a ser considerado nos gráficos de evolução do relatório, para que eu possa adequar o documento ao contexto do acompanhamento de cada paciente.

### Critérios de Aceitação

- Seletor de período disponível na tela de geração do relatório, com opções de 30, 60 e 90 dias (RF028).
- Gráficos de evolução de peso e medidas no relatório refletem o período selecionado.

**Requisitos:** RF028

---

# Épico 6 — Agenda de Consultas (Novo)

## HU-17 — Prioridade: Alta

Como nutricionista, quero agendar uma consulta para um paciente informando data, horário de início, duração e observações, para que eu possa organizar minha rotina de atendimentos.

### Critérios de Aceitação

- Formulário de agendamento exige paciente, data, horário de início e duração (RF029).
- Campo de observações sobre o atendimento é opcional (RF029).
- Sistema impede o agendamento de horários sobrepostos para o mesmo nutricionista, exibindo mensagem de erro ao detectar conflito (RF032, RNF013).
- Consulta salva aparece imediatamente na agenda do nutricionista (RF030).

**Requisitos:** RF029, RF032, RNF013

---

## HU-18 — Prioridade: Alta

Como nutricionista, quero visualizar minha agenda de consultas em formato de calendário (diário e semanal), para que eu possa ter uma visão clara dos meus atendimentos e me preparar para cada um deles.

### Critérios de Aceitação

- Calendário exibe visão diária e semanal, listando paciente, horário e status de cada consulta (RF030).
- Apenas consultas do nutricionista autenticado são exibidas (RLS — Épico 0).
- Calendário renderizado corretamente a partir de 360px de largura, com alvo de toque mínimo de 44×44 px por horário (RNF012).
- Funcionamento verificado no Chrome e Safari Mobile (RNF012).

**Requisitos:** RF030, RNF012

---

## HU-19 — Prioridade: Média

Como nutricionista, quero reagendar ou cancelar uma consulta previamente marcada, para que eu possa lidar com imprevistos sem perder o controle da minha agenda.

### Critérios de Aceitação

- Nutricionista pode alterar data e horário de uma consulta existente, respeitando a validação de conflito (RF031, RF032).
- Nutricionista pode cancelar uma consulta mediante confirmação (RF031).
- Consulta cancelada ou reagendada reflete imediatamente na visualização da agenda (RF030).

**Requisitos:** RF031, RF032

---

## HU-20 — Prioridade: Média

Como paciente, quero visualizar a data e o horário da minha próxima consulta agendada, para que eu possa me programar e não perder o atendimento.

### Critérios de Aceitação

- Acesso à informação exige autenticação prévia via Supabase Auth (Épico 0).
- Área do paciente exibe data, horário e nutricionista responsável da próxima consulta agendada (RF033).
- Caso não haja consulta futura agendada, sistema exibe mensagem informativa apropriada.

**Requisitos:** RF033, Épico 0

---

## HU-21 — Prioridade: Alta

Como nutricionista, quero selecionar alimentos a partir de uma base cadastrada ou criá-los manualmente durante a montagem do plano alimentar, para que eu tenha flexibilidade e rapidez na prescrição dietética.

### Critérios de Aceitação

- A base permite buscar e selecionar alimentos cadastrados (RF034).
- Alimentos da base carregam calorias e macronutrientes disponíveis proporcionalmente à quantidade informada.
- O nutricionista pode registrar um alimento manual sem depender da base.

**Requisitos:** RF034

---

## HU-22 — Prioridade: Alta

Como paciente cadastrado por um nutricionista, quero receber um convite seguro por e-mail para definir minha própria senha, para que eu possa ativar minha conta e acessar minha área no NutriSmart.

### Critérios de Aceitação

- **Given** que o nutricionista autenticado cadastrou um paciente com e-mail válido, **when** a persistência clínica for concluída, **then** o sistema solicita o envio de um convite pelo Supabase Auth (RF035).
- **Given** que o convite foi entregue, **when** o paciente abrir o link em até 24 horas, **then** ele pode definir sua própria senha sem receber senha temporária.
- **Given** que o serviço de convite falhou, **when** o cadastro clínico já estiver persistido, **then** o paciente permanece cadastrado, a falha é registrada e nenhum erro é retornado ao nutricionista (RNF014).
- **Given** um convite expirado ou já utilizado, **when** o paciente abrir o link, **then** o sistema informa que o convite não é mais válido, sem expor dados da conta.
- **Given** os registros de convite, **when** houver tentativa de leitura, **then** a RLS permite acesso apenas ao nutricionista responsável; o paciente não acessa mensagens técnicas de falha.

**Requisitos:** RF001, RF015, RF019, RF035, RNF006, RNF007, RNF014

---

# 3. Casos de Uso Detalhados

O MVP do NutriSmart possui três casos de uso de alta complexidade que foram detalhados na versão 1.3 da Atividade Prática:

- **HU-00 — Autenticação (RF000)**, por ser pré-requisito de todo o sistema.
- **HU-06 — Criar Plano Alimentar (RF007)**, por envolver o maior número de passos, validações e integrações entre módulos.
- **HU-22 — Receber convite de acesso (RF035)**, por envolver criação de identidade, e-mail transacional, expiração e tratamento não bloqueante de falhas.

Os fluxos completos são reproduzidos abaixo.

As histórias de usuário dos novos Épicos 4, 5 e 6 possuem complexidade transacional menor (operações de CRUD simples e geração de documento a partir de dados já existentes) e, por isso, não exigem detalhamento de caso de uso nesta versão; seus fluxos estão integralmente cobertos pelos critérios de aceitação de cada HU.

---

## 3.1 Diagrama de Caso de Uso — Visão Geral do MVP

O diagrama abaixo representa os casos de uso do NutriSmart MVP, com os atores envolvidos e os relacionamentos de inclusão obrigatória (`<<include>>`) e extensões opcionais (`<<extend>>`).

Os casos de uso dos Épicos 4, 5 e 6 (medidas corporais, anotações clínicas, relatórios e agenda) foram incorporados como extensões do fluxo do nutricionista, todos dependentes de **UC-00 — Realizar Login**.

### Sistema NutriSmart — MVP Completo (v1.3)

#### Nutricionista

- (Realizar login) <<include>> ← UC-00 [Épico 0]
- (Recuperar senha) <<extend>>
- (Cadastrar paciente) <<include>> ← UC-01 [Épico 1]
- (Enviar convite para definir senha) <<extend>> ← UC-03 [Épicos 0 e 1]
- (Listar pacientes) <<include>>
- (Excluir paciente) <<extend>>
- (Calcular IMC/TMB/GET) <<include>> ← UC-02 [Épico 2]
- (Criar plano alimentar) <<include>>
- (Editar plano alimentar) <<extend>>
- (Visualizar gráfico de evolução) <<include>>
- (Registrar medidas corporais) <<extend>> [Épico 4]
- (Registrar anotação clínica) <<extend>> [Épico 4]
- (Emitir relatório do paciente) <<extend>> [Épico 5]
- (Gerenciar agenda de consultas) <<include>> [Épico 6]

#### Paciente

- (Realizar login) <<include>> ← UC-00 [Épico 0]
- (Visualizar plano diário) <<include>> ← UC-03 [Épico 3]
- (Marcar refeição como concluída) <<include>>
- (Visualizar progresso diário) <<include>>
- (Visualizar próxima consulta) <<extend>> [Épico 6]

**Legenda**

- `<<include>>` → inclusão obrigatória
- `<<extend>>` → extensão opcional
## 3.2 UC-00 — Realizar Login (RF000) [Épico 0]

A autenticação é o caso de uso central do Épico 0 e pré-condição de todos os demais.

Por ser transversal ao sistema — utilizado por dois atores diferentes com redirecionamentos distintos — merece detalhamento completo de fluxos.

### Pré-condição

Usuário possui cadastro ativo no sistema:

- Nutricionista criado pelo administrador;
- Paciente criado pelo nutricionista.

### Pós-condição

Usuário autenticado com sessão JWT ativa.

- Nutricionista redirecionado ao painel de pacientes.
- Paciente redirecionado à área de dieta do dia.

---

## Fluxo Principal — Login com E-mail e Senha

| Passo | Descrição |
|-------|-----------|
| 1 | O usuário acessa a URL do NutriSmart e o sistema exibe a tela de login com campos de e-mail e senha. |
| 2 | O usuário preenche e-mail e senha e aciona o botão **Entrar**. |
| 3 | O sistema valida o formato do e-mail (regex) e a presença da senha antes de enviar a requisição. |
| 4 | O sistema envia as credenciais ao Supabase Auth via HTTPS. |
| 5 | O Supabase Auth valida as credenciais e retorna um token JWT com o perfil do usuário (role: nutricionista ou paciente). |
| 6 | O sistema lê o perfil do token e redireciona: nutricionista → `/dashboard`; paciente → `/meu-plano`. |
| 7 | A sessão JWT é armazenada pelo Supabase Auth e persiste entre abas do navegador. |

---

## Fluxo Alternativo A — Recuperação de Senha

**Condição**

Usuário clica em **"Esqueci minha senha"** na tela de login.

| Passo | Descrição |
|-------|-----------|
| A1 | O sistema exibe campo para informar o e-mail cadastrado. |
| A2 | O usuário informa o e-mail e aciona **Enviar link de redefinição**. |
| A3 | O Supabase Auth envia e-mail com link de redefinição válido por 1 hora. |
| A4 | O usuário acessa o link, define nova senha e é redirecionado à tela de login com mensagem de sucesso. |

---

## Fluxos de Exceção — UC-00

| Exceção | Descrição |
|---------|-----------|
| A (Passo 4) | Credenciais inválidas: o Supabase Auth rejeita a autenticação. O sistema exibe a mensagem **"E-mail ou senha incorretos."**, sem indicar qual campo está errado (segurança). O fluxo retorna ao Passo 2. |
| B (Passo 4) | Falha de conexão com o Supabase Auth (timeout ou indisponibilidade). O sistema exibe **"Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."** Os campos permanecem preenchidos. |
| C (Passo 3) | Formato de e-mail inválido: validação client-side bloqueia o envio e destaca o campo com a mensagem **"Informe um e-mail válido."** |

---

# 3.3 UC-01 — Criar Plano Alimentar (RF007) [Épico 2]

A criação do plano alimentar é a história de usuário de maior complexidade do MVP original (HU-06).

Ela envolve:

- múltiplos passos sequenciais;
- validações;
- cálculos automáticos;
- persistência de dados;
- integração com funcionalidades de outros módulos.

Depende do UC-00 como pré-condição de autenticação.

---

## Pré-condição

- Nutricionista autenticado com sessão JWT válida (UC-00).
- Pelo menos um paciente cadastrado no sistema.

---

## Pós-condição

Plano alimentar vinculado ao paciente, persistido no Supabase com RLS e disponível para visualização pelo paciente autenticado (RF011).

---

## Fluxo Principal — Criar Plano Alimentar

| Passo | Descrição |
|-------|-----------|
| 1 | O nutricionista acessa a ficha do paciente selecionado na listagem (RF003). |
| 2 | O sistema exibe os indicadores clínicos calculados (IMC, TMB, GET) como base para a prescrição nutricional (RF004, RF005, RF006). |
| 3 | O nutricionista seleciona a opção **Criar plano alimentar** (RF007). |
| 4 | O sistema apresenta um formulário para definição de refeições. |
| 5 | O nutricionista define as refeições do dia (ex.: café da manhã, almoço, lanche da tarde e jantar). |
| 6 | Para cada refeição, o nutricionista adiciona alimentos, podendo selecioná-los de uma base cadastrada (que preenche calorias e macros automaticamente) ou criá-los manualmente informando nome, quantidade e calorias. |
| 7 | O sistema calcula automaticamente o total calórico por refeição. |
| 8 | O nutricionista revisa o plano e confirma o salvamento. |
| 9 | O sistema persiste o plano no Supabase com RLS vinculando o plano ao nutricionista e ao paciente. Exibe confirmação de sucesso. |
| 10 | O plano fica disponível para o paciente acessar via área autenticada (RF011). |
## Fluxo Alternativo — Editar Plano Existente (RF008)

**Condição de ativação:**

No passo 3 do fluxo principal, o sistema detecta que o paciente já possui um plano alimentar ativo.

| Passo | Descrição |
|-------|-----------|
| 3a | O sistema detecta plano existente e exibe as opções **"Editar plano"** ou **"Criar novo plano"**. |
| 3b | O nutricionista seleciona **"Editar plano"**. |
| 3c | O sistema carrega o plano atual com todas as refeições e alimentos preenchidos (RF008). |
| 3d | O nutricionista adiciona, remove ou modifica refeições e/ou alimentos conforme necessário. |
| 3e | O sistema recalcula automaticamente os totais calóricos após cada alteração. |
| 3f | O nutricionista salva. O fluxo retorna ao passo 9 do fluxo principal. |

---

## Fluxos de Exceção — UC-01

| Exceção | Descrição |
|---------|-----------|
| A (Passo 8) | Refeição sem alimentos: o nutricionista tenta salvar com ao menos uma refeição vazia. O sistema exibe **"Cada refeição deve conter ao menos um alimento."** O fluxo retorna ao passo 6. |
| B (Passo 9) | Falha de conexão com o Supabase: timeout ou indisponibilidade. O sistema exibe **"Não foi possível salvar o plano. Verifique sua conexão e tente novamente."** Os dados preenchidos permanecem no formulário. Se o problema persistir, o sistema orienta o nutricionista a tentar novamente mais tarde (MVP sem funcionalidade offline). |
| C (Pré-condição) | Sessão expirada: se o token JWT expirar durante a criação do plano, o sistema redireciona o nutricionista para a tela de login com o aviso **"Sua sessão expirou. Faça login novamente."** (comportamento gerenciado pelo Supabase Auth). |

---

# 3.4 UC-03 — Convidar Paciente para Definir Senha (RF035) [Épicos 0 e 1]

## Pré-condições

- Nutricionista autenticado com sessão válida.
- Cadastro clínico do paciente persistido com nome e e-mail válido.

## Pós-condições

- Convite solicitado ao Supabase Auth e estado registrado como `enviado`; ou
- falha técnica registrada como `falhou`, sem desfazer o cadastro clínico.

## Fluxo Principal

| Passo | Descrição |
|-------|-----------|
| 1 | Após persistir o paciente, o caso de uso publica a solicitação de convite sem acoplar o cadastro ao resultado do e-mail. |
| 2 | `SupabasePatientInvitationAdapter`, por meio de uma Edge Function autenticada, valida se o usuário solicitante é o nutricionista responsável. |
| 3 | A Edge Function solicita ao Supabase Auth o convite do e-mail, com metadados mínimos de nome, papel e paciente. |
| 4 | O Supabase Auth envia a mensagem de boas-vindas com link individual, de uso único e válido por 24 horas. |
| 5 | O paciente abre o link, acessa `/definir-senha` e informa a própria senha. |
| 6 | O Supabase Auth cria/confirma a credencial e o sistema vincula `pacientes.usuario_id` ao perfil autenticado. |

## Fluxos de Exceção

| Exceção | Tratamento |
|---------|------------|
| Falha de envio | Registrar estado `falhou` e mensagem técnica sanitizada; manter o paciente cadastrado e não retornar erro ao nutricionista. |
| Link expirado ou utilizado | Exibir mensagem neutra de convite inválido; nenhuma credencial ou dado interno é revelado. |
| E-mail já associado a usuário | Vincular somente após validação segura da identidade; nunca sobrescrever outro vínculo automaticamente. |
| Sessão do solicitante inválida | A Edge Function rejeita a operação sem expor a chave administrativa. |

## Segurança e RLS

- Somente o nutricionista responsável pode consultar os estados dos convites vinculados aos seus pacientes.
- A criação de usuário e o envio administrativo usam credencial de serviço apenas dentro da Edge Function.
- Pacientes não podem ler logs, mensagens técnicas ou registros de outros usuários.
- Senhas e tokens de convite não são persistidos nas tabelas públicas.

---

# 4. Rastreabilidade — HUs × Requisitos × Épicos

Tabela consolidada com todas as histórias de usuário do projeto, incluindo HU-21 (Base de Alimentos) e HU-22 (Convite de Acesso).

| História | Requisitos | Épico | Depende de |
|----------|------------|--------|------------|
| HU-00 — Login | RF000, RNF005 | Épico 0 | — |
| HU-01 — Recuperar senha | RF000a | Épico 0 | HU-00 |
| HU-02 — Cadastrar paciente | RF001, RF002, RF035, RNF005 | Épico 1 | HU-00 |
| HU-03 — Listar pacientes | RF002, RF003, RNF001 | Épico 1 | HU-00 |
| HU-04 — Excluir paciente | RF009, LGPD Art. 18 | Épico 1 | HU-00, HU-02 |
| HU-05 — Calcular IMC/TMB/GET | RF004, RF005, RF006, RNF002 | Épico 2 | HU-02 |
| HU-06 — Criar plano alimentar | RF007, RF011 | Épico 2 | HU-05 |
| HU-07 — Gráfico de evolução | RF010, RF014 | Épico 2 | HU-06 |
| HU-08 — Visualizar plano diário | RF011, RNF003 | Épico 3 | HU-00, HU-06 |
| HU-09 — Marcar refeição | RF012, RNF004, RNF005 | Épico 3 | HU-08 |
| HU-10 — Progresso diário | RF013, RNF009 | Épico 3 | HU-09 |
| HU-11 — Registrar medidas corporais | RF020, RNF005 | Épico 4 | HU-00, HU-02 |
| HU-12 — Histórico de medidas corporais | RF021, RF022 | Épico 4 | HU-11 |
| HU-13 — Registrar anotação clínica | RF023, LGPD Art. 11 | Épico 4 | HU-00, HU-02 |
| HU-14 — Gerenciar anotações clínicas | RF024, RF025 | Épico 4 | HU-13 |
| HU-15 — Emitir relatório do paciente | RF026, RF027, RNF011 | Épico 5 | HU-05, HU-06, HU-11 |
| HU-16 — Selecionar período do relatório | RF028 | Épico 5 | HU-15 |
| HU-17 — Agendar consulta | RF029, RF032, RNF013 | Épico 6 | HU-00, HU-02 |
| HU-18 — Visualizar agenda | RF030, RNF012 | Épico 6 | HU-17 |
| HU-19 — Editar/cancelar consulta | RF031, RF032 | Épico 6 | HU-17 |
| HU-20 — Paciente visualiza próxima consulta | RF033, Épico 0 | Épico 6 | HU-00, HU-17 |
| HU-21 — Selecionar alimento da base | RF034 | Épico 2 | HU-06 |
| HU-22 — Receber convite de acesso | RF001, RF015, RF019, RF035, RNF014 | Épicos 0 e 1 | HU-00, HU-02 |