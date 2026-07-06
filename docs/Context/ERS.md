# NutriSmart — Especificação de Requisitos de Software (ERS)



## Versão 1.1 — MVP Acadêmico (Escopo Ampliado)



**Atualização:** inclusão de Medidas Corporais, Anotações Clínicas, Relatórios e Agenda de Consultas.



| Componente | Descrição |

|------------|-----------|

| Componente Curricular | Engenharia de Software 2 |

| Professor | Mayllon Veras |

| Semestre | 2026.1 |

| Versão do Documento | 1.1 — MVP com escopo ampliado |

| Versão Anterior | 1.0 — Entregue em 29/04/2025 |

| Data desta Revisão | 21/06/2026 |



---



# 0. Histórico de Revisões



Esta seção resume as alterações desta versão (1.1) em relação à versão 1.0 da ERS, consolidando o contexto registrado no Relatório de Status do Projeto e na Atividade Prática (v1.1).



| Versão | Data | Principais Mudanças |

|---------|------|---------------------|

| **1.0** | 29/04/2025 | Versão inicial do MVP: Gestão de Pacientes, Avaliação Nutricional (IMC/TMB/GET), Plano Alimentar e Adesão do Paciente. |

| **1.1** | 21/06/2026 | Correção da inconsistência entre a stack tecnológica (Supabase Auth) e a Seção 5.1, que classificava a autenticação como fora do MVP. Inclusão de quatro novas funcionalidades: Registro de Medidas Corporais, Anotações Clínicas, Emissão de Relatórios e Agenda de Consultas. Atualização da matriz de rastreabilidade e dos requisitos não funcionais. |



---



# 1. Descrição Geral do Produto (Escopo)



## 1.1 Visão Geral do Sistema



O NutriSmart é uma aplicação web voltada para a prática nutricional clínica, projetada para otimizar o fluxo de trabalho de nutricionistas e aumentar o engajamento dos pacientes com seus planos alimentares.



O MVP contempla dois perfis de usuário distintos com funcionalidades específicas para cada um.



Esta versão amplia o escopo original com acompanhamento clínico mais completo (medidas corporais e anotações), geração de relatórios e gestão de agenda de consultas.



---



## 1.2 Usuários do Sistema



| Perfil | Tipo de Usuário | Responsabilidades Principais |

|--------|-----------------|------------------------------|

| **Nutricionista** | Usuário Primário | Cadastrar pacientes, gerar indicadores clínicos (IMC, TMB), registrar medidas corporais e anotações clínicas, criar e gerenciar planos alimentares personalizados, emitir relatórios e gerenciar a agenda de consultas. |

| **Paciente** | Usuário Secundário | Acessar plano alimentar, marcar refeições como concluídas, acompanhar evolução ao longo do tempo e visualizar suas consultas agendadas. |



---



## 1.3 Valor Entregue pelo MVP



- **Eficiência clínica:** redução de até **75%** do tempo administrativo por consulta (de 15–20 minutos para menos de 5 minutos) por meio da automação dos cálculos de IMC e TMB.



- **Precisão:** eliminação de erros manuais nos cálculos nutricionais utilizando as fórmulas de **Harris-Benedict** e **Mifflin-St Jeor**.



- **Engajamento do paciente:** acesso simples ao plano alimentar diário e rastreamento da adesão ao tratamento.



- **Acompanhamento clínico longitudinal:** registro histórico de medidas corporais e anotações clínicas, permitindo avaliação da evolução do paciente além do peso isolado. *(Novo na versão 1.1).*



- **Documentação profissional:** emissão de relatórios consolidados para impressão ou envio ao paciente, reduzindo retrabalho manual. *(Novo na versão 1.1).*



- **Organização da rotina clínica:** agenda de consultas integrada, reduzindo conflitos de horário e esquecimentos. *(Novo na versão 1.1).*



---



## 1.4 Stack Tecnológica do MVP



- **Front-end:** React 19+ com TypeScript (SPA) — interface reativa e type-safe para nutricionista e paciente.



- **Persistência e Autenticação:** Supabase Free Tier + Supabase Auth.



- **Estilização:** CSS Modules / Tailwind CSS.



- **Geração de Relatórios:** biblioteca client-side para geração de PDF (ex.: jsPDF) utilizando os dados armazenados no Supabase.



- **Versionamento:** Git + GitHub.



---



# 2. Requisitos Funcionais (RF)



Os requisitos funcionais abaixo descrevem as funcionalidades indispensáveis para o funcionamento do MVP.



Cada requisito foi classificado por prioridade:



- **Alta:** essencial para o MVP.

- **Média:** importante, mas não bloqueante.

- **Baixa:** desejável.



Os requisitos **RF020 em diante** foram adicionados nesta versão 1.1.



## Módulo: Nutricionista



### RF001 — Cadastro de Paciente



**Prioridade:** Alta



O sistema deve permitir que o nutricionista cadastre um novo paciente informando:



- Nome completo;

- Data de nascimento;

- Sexo biológico;

- Peso (kg);

- Altura (cm);

- Nível de atividade física.



Todos os campos são obrigatórios.



---



### RF002 — Listagem de Pacientes



**Prioridade:** Alta



O sistema deve exibir uma lista de todos os pacientes cadastrados pelo nutricionista, contendo:



- Nome;

- Data do último atendimento;

- Indicador de status do plano alimentar ativo.



---



### RF003 — Visualização de Dados do Paciente



**Prioridade:** Alta



O sistema deve exibir a ficha completa do paciente selecionado, incluindo:



- Dados cadastrais;

- Histórico de peso;

- Indicadores clínicos calculados.



---



### RF004 — Cálculo Automático de IMC



**Prioridade:** Alta



O sistema deve calcular automaticamente o Índice de Massa Corporal (IMC) a partir do peso e da altura do paciente.



O resultado deve apresentar:



- Valor numérico;

- Classificação segundo a OMS:

  - Abaixo do peso;

  - Normal;

  - Sobrepeso;

  - Obesidade Grau I;

  - Obesidade Grau II;

  - Obesidade Grau III.



---



### RF005 — Cálculo Automático da TMB



**Prioridade:** Alta



O sistema deve calcular automaticamente a Taxa Metabólica Basal (TMB) utilizando a fórmula de **Mifflin-St Jeor**, diferenciando o cálculo conforme o sexo biológico.



O resultado deve ser apresentado em **kcal/dia**.



---



### RF006 — Cálculo do Gasto Calórico Total (GET)



**Prioridade:** Alta



O sistema deve calcular automaticamente o GET multiplicando a TMB pelo fator de atividade física informado no cadastro do paciente:



- Sedentário;

- Levemente ativo;

- Moderadamente ativo;

- Muito ativo;

- Extremamente ativo.

### RF007 — Criação de Plano Alimentar



**Prioridade:** Alta



O sistema deve permitir que o nutricionista crie um plano alimentar para o paciente, definindo:



- Refeições (ex.: café da manhã, almoço, jantar, lanches);

- Alimentos pertencentes a cada refeição (escolhidos de uma base cadastrada ou criados manualmente);

- Quantidade de cada alimento (g/ml);

- Valor calórico correspondente.



---



### RF008 — Edição de Plano Alimentar



**Prioridade:** Média



O sistema deve permitir que o nutricionista edite um plano alimentar existente, podendo:



- Adicionar refeições;

- Remover refeições;

- Alterar refeições;

- Adicionar alimentos;

- Remover alimentos;

- Alterar alimentos vinculados ao paciente.



---



### RF009 — Exclusão de Paciente



**Prioridade:** Média



O sistema deve permitir que o nutricionista exclua permanentemente o registro de um paciente, incluindo:



- Dados cadastrais;

- Dados clínicos;

- Planos alimentares vinculados.



---



### RF010 — Visualização da Evolução do Paciente



**Prioridade:** Alta



O sistema deve exibir ao nutricionista um gráfico de linha mostrando:



- Evolução do peso ao longo do tempo;

- Percentual de adesão diária ao plano alimentar.



---



# Módulo: Paciente



### RF011 — Visualização do Plano Alimentar



**Prioridade:** Alta



O sistema deve permitir que o paciente visualize as refeições do dia atual contendo:



- Nome da refeição;

- Lista de alimentos;

- Quantidade de cada alimento;

- Total de calorias por refeição.



---



### RF012 — Marcação de Refeição como Concluída



**Prioridade:** Alta



O sistema deve permitir que o paciente marque individualmente cada refeição do dia como concluída.



O estado da refeição deve:



- Ser persistido no banco de dados;

- Refletir imediatamente na interface.



---



### RF013 — Indicador de Progresso Diário



**Prioridade:** Alta



O sistema deve exibir ao paciente um indicador visual (barra de progresso ou percentual) mostrando quantas refeições do dia foram concluídas em relação ao total planejado.



---



### RF014 — Visualização do Histórico de Evolução



**Prioridade:** Média



O sistema deve exibir ao paciente um gráfico simples contendo:



- Evolução do peso;

- Evolução da adesão ao plano alimentar;



considerando os últimos **30 dias**.



---



# Módulo: Autenticação e Controle de Acesso



As funcionalidades abaixo fazem parte do MVP desde a versão 1.0, implementadas via **Supabase Auth**.



A Seção 5.1 foi corrigida nesta revisão para eliminar a inconsistência que classificava a autenticação como fora do escopo do MVP.



---



### RF015 — Cadastro de Usuários



**Prioridade:** Alta



O sistema deve permitir o cadastro de usuários utilizando:



- E-mail;

- Senha.



---



### RF016 — Login



**Prioridade:** Alta



O sistema deve permitir autenticação via e-mail e senha utilizando o **Supabase Auth**.



---



### RF017 — Logout



**Prioridade:** Alta



O sistema deve permitir o encerramento da sessão autenticada do usuário.



---



### RF018 — Controle de Perfis



**Prioridade:** Alta



O sistema deve diferenciar usuários dos tipos:



- Nutricionista;

- Paciente.



O acesso aos dados deverá ser restringido utilizando **Row Level Security (RLS)**.



---



### RF019 — Recuperação de Senha



**Prioridade:** Média



O sistema deve permitir a redefinição da senha por e-mail utilizando um link de uso único com validade de **1 hora**.

# Módulo: Avaliação Clínica Avançada *(Novo — v1.1)*



---



### RF020 — Registro de Medidas Corporais



**Prioridade:** Alta



O sistema deve permitir que o nutricionista registre, em cada atendimento, as seguintes medidas corporais do paciente:



- Circunferência da cintura;

- Circunferência do quadril;

- Circunferência do braço;

- Circunferência da coxa;

- Percentual de gordura corporal;

- Dobras cutâneas.



Cada registro deve estar associado à data do atendimento.



---



### RF021 — Histórico de Medidas Corporais



**Prioridade:** Média



O sistema deve exibir o histórico de medidas corporais do paciente em:



- Tabela cronológica;

- Gráfico de evolução por tipo de medida.



O histórico deve permitir comparação entre diferentes atendimentos.



---



### RF022 — Edição e Exclusão de Medidas



**Prioridade:** Baixa



O sistema deve permitir que o nutricionista:



- Edite um registro de medidas corporais;

- Exclua um registro de medidas lançado incorretamente.



---



### RF023 — Registro de Anotação Clínica



**Prioridade:** Alta



O sistema deve permitir que o nutricionista registre uma anotação de texto livre vinculada:



- ao paciente;

- à data do atendimento.



Essas anotações devem ser visíveis apenas para o nutricionista responsável.



---



### RF024 — Listagem de Anotações Clínicas



**Prioridade:** Média



O sistema deve exibir, na ficha do paciente, uma lista cronológica contendo:



- Data da anotação;

- Autor da anotação;

- Conteúdo registrado.



---



### RF025 — Edição e Exclusão de Anotações



**Prioridade:** Baixa



O sistema deve permitir que o nutricionista:



- Edite uma anotação clínica;

- Exclua uma anotação previamente registrada.



---



# Módulo: Relatórios *(Novo — v1.1)*



---



### RF026 — Emissão de Relatório do Paciente



**Prioridade:** Alta



O sistema deve permitir que o nutricionista gere um relatório em PDF contendo:



- Dados cadastrais do paciente;

- Indicadores clínicos (IMC, TMB e GET);

- Histórico de medidas corporais;

- Evolução do peso;

- Plano alimentar vigente.



---



### RF027 — Download e Impressão de Relatório



**Prioridade:** Média



O sistema deve permitir:



- Download do relatório em PDF;

- Impressão direta pelo navegador.



---



### RF028 — Seleção de Período do Relatório



**Prioridade:** Baixa



O sistema deve permitir que o nutricionista selecione o período considerado para geração dos gráficos do relatório, por exemplo:



- Últimos 30 dias;

- Últimos 60 dias;

- Últimos 90 dias.



---



# Módulo: Agenda de Consultas *(Novo — v1.1)*



---



### RF029 — Agendamento de Consulta



**Prioridade:** Alta



O sistema deve permitir que o nutricionista agende uma consulta para um paciente informando:



- Data;

- Horário de início;

- Duração;

- Observações (opcional).



---



### RF030 — Visualização da Agenda



**Prioridade:** Alta



O sistema deve exibir a agenda de consultas em formato de calendário, oferecendo:



- Visualização diária;

- Visualização semanal.



Cada consulta deve apresentar:



- Paciente;

- Horário;

- Status.



---



### RF031 — Edição e Cancelamento de Consulta



**Prioridade:** Média



O sistema deve permitir que o nutricionista:



- Reagende uma consulta;

- Altere data e horário;

- Cancele consultas previamente cadastradas.



---



### RF032 — Validação de Conflito de Horário



**Prioridade:** Média



O sistema deve impedir o agendamento de duas consultas com horários sobrepostos para o mesmo nutricionista.



Ao detectar conflito, deverá ser exibida uma mensagem de erro ao usuário.



---



### RF033 — Visualização de Consultas pelo Paciente



**Prioridade:** Média



O sistema deve permitir que o paciente visualize, em sua área autenticada:



- Data da próxima consulta;

- Horário da próxima consulta agendada.

---

### RF034 — Base de Alimentos

**Prioridade:** Alta

O sistema deve permitir que o nutricionista selecione alimentos a partir de uma base cadastrada ou adicione alimentos manualmente (texto livre) durante a montagem de um plano alimentar.
Para alimentos da base, o sistema deve carregar automaticamente a proporção de calorias e macros, se disponíveis.

# 3. Requisitos Não Funcionais (RNF)



Os requisitos não funcionais estão baseados na norma **ISO/IEC 25010** e são mensuráveis, conforme os critérios de engenharia adotados no projeto.



Os requisitos **RNF011 a RNF013** foram adicionados nesta versão em função dos módulos de **Relatórios** e **Agenda de Consultas**.



---



### RNF001 — Desempenho



O sistema deve responder às operações de cadastro e consulta de pacientes dentro de um tempo aceitável.



**Critério de verificação**



- Tempo de resposta inferior a **2 segundos** para **95%** das requisições, considerando até **10 usuários simultâneos**.



---



### RNF002 — Desempenho



O cálculo de:



- IMC;

- TMB;

- GET;



deve ser processado imediatamente após a submissão dos dados do paciente.



**Critério de verificação**



- Resultado apresentado em menos de **500 ms** após o envio do formulário.



---



### RNF003 — Usabilidade



A interface do paciente deve ser totalmente responsiva para dispositivos móveis.



**Critério de verificação**



- Funcionamento correto em resoluções a partir de **360 px**;

- Compatibilidade com **Chrome Mobile** e **Safari Mobile**.



---



### RNF004 — Usabilidade



A marcação de uma refeição como concluída deve exigir o mínimo possível de interação.



**Critério de verificação**



- A ação deve ser realizada em **até dois cliques/toques**, sem necessidade de navegar entre telas.



---



### RNF005 — Confiabilidade



O sistema deve persistir corretamente as marcações das refeições entre diferentes sessões do usuário.



**Critério de verificação**



- Recuperação correta das marcações em **100% dos casos** após o encerramento e reabertura do navegador.



---



### RNF006 — Segurança



O acesso ao sistema deve ocorrer somente mediante autenticação válida utilizando o **Supabase Auth**.



**Critério de verificação**



- **100% das rotas protegidas** exigem sessão autenticada.



---



### RNF007 — Segurança



O gerenciamento das credenciais dos usuários deve ser realizado exclusivamente pelo **Supabase Auth**.



**Critério de verificação**



- Nenhuma senha poderá ser armazenada pela aplicação.



---



### RNF008 — Manutenibilidade



O código-fonte deve seguir uma arquitetura organizada e modular.



**Critério de verificação**



- Organização por módulos (componentes, páginas e serviços);

- Versionamento em GitHub;

- Uso de commits semânticos;

- Revisão de código pela equipe.



---



### RNF009 — Portabilidade



O sistema deve funcionar corretamente nos principais navegadores modernos.



**Critério de verificação**



Compatibilidade com:



- Chrome 120+;

- Firefox 120+;

- Safari 17+.



Sem erros de console ou problemas de layout.



---



### RNF010 — Disponibilidade



A aplicação hospedada deve permanecer disponível durante todo o desenvolvimento do MVP.



**Critério de verificação**



- Disponibilidade mínima de **95%** durante as **10–12 semanas** de desenvolvimento, utilizando a infraestrutura da **Vercel Free Tier**.



---



### RNF011 — Desempenho *(Novo — v1.1)*



A geração do relatório em PDF do paciente (RF026) deve ocorrer em tempo aceitável.



**Critério de verificação**



- Relatório disponível para download em até **3 segundos**, considerando pacientes com até **90 dias de histórico**.



---



### RNF012 — Usabilidade *(Novo — v1.1)*



A agenda de consultas deve ser totalmente utilizável tanto em desktop quanto em dispositivos móveis.



**Critério de verificação**



- Calendário renderizado corretamente a partir de **360 px**;

- Áreas de toque de no mínimo **44 × 44 px**;

- Compatibilidade com Chrome e Safari Mobile.



---



### RNF013 — Confiabilidade *(Novo — v1.1)*



O sistema deve garantir a integridade da agenda de consultas.



**Critério de verificação**



- **0% de consultas sobrepostas** criadas com sucesso em cenários de agendamentos simultâneos.

# 4. Matriz de Rastreabilidade



A tabela abaixo relaciona os **Requisitos Não Funcionais (RNF)** com os principais **Requisitos Funcionais (RF)** que impactam, incluindo os módulos adicionados na versão 1.1.



O símbolo **●** indica impacto direto.



| RNF \ RF | RF001–003 | RF004–006 | RF007 | RF011–012 | RF020–022 | RF023–025 | RF026–028 | RF029–032 | Geral |

|-----------|:---------:|:---------:|:-----:|:---------:|:---------:|:---------:|:---------:|:---------:|:-----:|

| RNF001 | ● | – | – | – | ● | ● | – | ● | – |

| RNF002 | – | ● | – | – | – | – | – | – | – |

| RNF003 | – | – | – | ● | – | – | – | ● | – |

| RNF004 | – | – | – | ● | – | – | – | – | – |

| RNF005 | – | – | – | ● | – | – | – | – | – |

| RNF006 | ● | – | ● | ● | ● | ● | ● | ● | – |

| RNF007 | – | – | – | – | – | – | – | – | ● |

| RNF008 | – | – | – | – | – | – | – | – | ● |

| RNF009 | – | – | – | – | – | – | – | – | ● |

| RNF010 | – | – | – | – | – | – | – | – | ● |

| RNF011 | – | – | – | – | – | – | ● | – | – |

| RNF012 | – | – | – | – | – | – | – | ● | – |

| RNF013 | – | – | – | – | – | – | – | ● | – |



## Legenda



- **●** — Impacto direto: o requisito não funcional restringe ou qualifica diretamente a funcionalidade correspondente.

- **–** — Sem impacto direto.

- **Geral** — Requisito aplicável ao sistema como um todo.



---



# 5. Restrições e Premissas Técnicas



## 5.1 Restrições do MVP



### Autenticação implementada no MVP



Diferentemente do registrado na versão 1.0 deste documento, o acesso ao sistema é protegido por login desde a primeira versão do MVP, utilizando **Supabase Auth**, **JWT** e **Row Level Security (RLS)** (RF015–RF019).



A versão 1.0 continha uma inconsistência entre a stack tecnológica e esta seção, corrigida nesta revisão conforme registrado no Relatório de Status do Projeto.



---



### Relatórios gerados no client-side



A emissão de relatórios (RF026–RF028) é realizada diretamente no navegador utilizando os dados carregados do Supabase.



Não existe um backend dedicado para geração de documentos, sendo esta solução adequada ao volume de dados esperado para o MVP acadêmico.



---



### Agenda sem integração externa



A Agenda de Consultas (RF029–RF033) não possui integração com serviços externos, como:



- Google Calendar;

- Microsoft Outlook.



A sincronização com calendários externos está prevista para uma futura versão (v2).



---



### Supabase Free Tier



O banco de dados utiliza o plano gratuito do Supabase, que possui limitações de:



- armazenamento;

- capacidade computacional;

- número de usuários simultâneos.



Essas limitações são consideradas adequadas ao contexto acadêmico do MVP.



---



### Sem integração com APIs externas



Todos os cálculos nutricionais (IMC, TMB e GET) são realizados localmente utilizando fórmulas matemáticas de domínio público, como:



- Harris-Benedict;

- Mifflin-St Jeor.



Não existe dependência de APIs externas.



---



### Escopo congelado



Qualquer funcionalidade que não esteja listada nesta versão **1.1** será considerada fora do MVP.



Novas funcionalidades deverão ser registradas como candidatas à **versão 2**, conforme a estratégia de mitigação de riscos definida no projeto.



---



## 5.2 Premissas



- O nutricionista utiliza um computador com navegador moderno (Chrome 120+, Firefox 120+ ou Safari 17+).



- O paciente acessa preferencialmente o sistema por smartphone conectado à internet.



- Os dados cadastrados no MVP possuem finalidade exclusivamente acadêmica e de demonstração.



- As anotações clínicas (RF023) são tratadas como dados sensíveis de saúde e ficam disponíveis apenas para o nutricionista responsável, em conformidade com a LGPD.



---



# 6. Critérios de Qualidade dos Requisitos



Todos os requisitos presentes neste documento foram elaborados seguindo critérios clássicos da Engenharia de Software.



| Critério | Definição | Aplicação neste documento |

|----------|-----------|---------------------------|

| **Atomicidade** | Cada requisito deve tratar apenas de uma funcionalidade ou restrição. | Cada requisito funcional descreve apenas uma responsabilidade. Ex.: RF020 trata exclusivamente do registro de medidas corporais, enquanto o histórico foi separado em RF021. |

| **Verificabilidade** | Deve ser possível comprovar objetivamente se o requisito foi atendido. | Todos os RNFs possuem métricas mensuráveis (ex.: relatório em até 3 segundos; 0% de consultas sobrepostas). Os RFs descrevem comportamentos diretamente verificáveis. |

| **Clareza** | Os requisitos devem evitar termos subjetivos e utilizar critérios objetivos e mensuráveis. | Foram eliminados termos vagos como "rápido", "eficiente" ou "fácil", substituindo-os por métricas quantitativas em todos os requisitos não funcionais, inclusive os adicionados na versão 1.1. |



---