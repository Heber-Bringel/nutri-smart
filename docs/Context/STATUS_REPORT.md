# NutriSmart — Relatório de Status do Projeto



## Relatório de Status do Projeto (Status Report)



**Consolidação da RVS e da Atividade Prática Atualizadas**



**Componente Curricular:** Engenharia de Software 2



**Professor:** Mayllon Veras



**Semestre:** 2026.1



**Período de Referência:** Junho de 2026



**Versão do Relatório:** 1.0



## STATUS GERAL



🟢 **NO PRAZO**



---



# 1. Sumário Executivo do Status



Este relatório consolida o estado atual do projeto NutriSmart a partir das versões mais recentes da Relatório de Viabilidade de Software (RVS) e da Atividade Prática — Épicos, Histórias de Usuário e Casos de Uso.



O destaque do período é a incorporação formal de **Autenticação e Controle de Acesso** ao escopo do MVP, antes tratada de forma inconsistente entre os documentos do projeto.



| Indicador | Situação Atual |

|-----------|----------------|

| **Fase Atual** | Planejamento e especificação concluídos — pronto para iniciar o Sprint 0 |

| **Status Geral** | No Prazo |

| **Decisão de Viabilidade (TELOS)** | GO — Aprovado para Modelagem e Desenvolvimento |

| **Mudança Relevante do Período** | Autenticação e Controle de Acesso incorporados ao escopo do MVP (novo Épico 0) |

| **Próximo Marco** | Início do Sprint 0 — Setup (Semanas 1-2) |



---



# 2. Linha do Tempo de Revisões



O quadro abaixo resume a evolução dos dois principais documentos de planejamento do projeto até a presente data.



| Documento | Versão | Data | Principal Mudança |

|-----------|---------|------|-------------------|

| **RVS — Relatório de Viabilidade** | v1 | Abril/2026 | Aprovação inicial (GO) com base no framework TELOS; autenticação listada na stack técnica, mas classificada como **"Fora do MVP"** no cronograma — inconsistência identificada. |

| **Atividade Prática** | v1.0 | Abril/2026 | Definição de 3 épicos (Gestão de Pacientes, Avaliação e Planejamento, Adesão do Paciente) e 10 histórias de usuário, sem épico de autenticação. |

| **RVS — Relatório de Viabilidade** | v2 | Junho/2026 | Autenticação e Controle de Acesso incorporados formalmente ao escopo do MVP. Cronograma, custos, matriz de riscos e conformidade LGPD revisados para refletir a mudança. |

| **Atividade Prática** | v1.1 | Junho/2026 | Novo Épico 0 — Autenticação e Controle de Acesso. Histórias HU-00 (login) e HU-01 (recuperação de senha) especificadas. Caso de uso UC-00 — Realizar Login detalhado com fluxos principal, alternativo e de exceção. |



> **Nota:** A inconsistência da v1 da RVS — em que o Supabase Auth constava na stack técnica do MVP, mas a funcionalidade de autenticação era listada como "Fora do MVP" no cronograma — foi o gatilho para a revisão registrada nesta linha do tempo.



---



# 3. Indicadores Gerais do MVP



| Indicador | Valor Atual |

|-----------|-------------|

| Épicos definidos | **4 (Épico 0 a Épico 3)** |

| Histórias de usuário especificadas | **11 (HU-00 a HU-10)** |

| Casos de uso detalhados | **2 (UC-00 — Login; UC-01 — Criar Plano Alimentar)** |

| Requisitos funcionais rastreados | **15 (RF000, RF000a, RF001 a RF014)** |

| Sprints planejados | **6 (Sprint 0 a Sprint 5)** |

| Duração total prevista | **10 a 12 semanas** |

| Decisão de viabilidade (TELOS) | **GO** |



---



# 4. Mudança de Escopo Aprovada — Autenticação e Controle de Acesso



A análise conjunta da RVS e da Atividade Prática revelou que a autenticação de usuários, embora presente na stack tecnológica desde a primeira versão da RVS (Supabase Auth), não estava refletida nem no cronograma do MVP nem nos épicos da Atividade Prática.



Essa lacuna foi corrigida nas versões atuais dos dois documentos, com o **Épico 0 — Autenticação e Controle de Acesso** passando a ser pré-requisito formal de todos os demais épicos.



## Impacto por Dimensão TELOS



- **Técnica:** complexidade de implementação revista de **Alta** para **Média**, por utilizar o módulo nativo **Supabase Auth** com JWT e Row Level Security (RLS), em vez de uma solução construída do zero.



- **Econômica:** custo adicional de **R$ 0,00** — a autenticação está incluída no mesmo plano gratuito do Supabase já orçado para persistência de dados.



- **Legal:** o item **"Segurança e sigilo"** da LGPD passa de **Parcial** para **Atendido no MVP**, reforçando a conformidade desde a primeira entrega.



- **Operacional:** o fluxo de login (e-mail e senha) segue um padrão amplamente reconhecido pelo público-alvo e não introduz fricção relevante para nutricionistas ou pacientes.



- **Cronograma:** a funcionalidade foi absorvida no **Sprint 1 (Auth + Core Nutricionista)**, sem necessidade de estender o prazo total de **10–12 semanas**.



---



# 5. Status por Épico



| Épico | Requisitos | HUs | Sprint Planejado | Status |

|-------|------------|-----|-----------------|--------|

| **Épico 0 — Autenticação e Controle de Acesso** | RF000, RF000a | HU-00, HU-01 (2) | Sprint 1 | Especificado |

| **Épico 1 — Gestão de Pacientes** | RF001, RF002, RF003, RF009 | HU-02, HU-03, HU-04 (3) | Sprint 1 | Especificado |

| **Épico 2 — Avaliação e Planejamento Nutricional** | RF004–RF008, RF010 | HU-05, HU-06, HU-07 (3) | Sprint 2–3 | Especificado |

| **Épico 3 — Adesão e Acompanhamento pelo Paciente** | RF011–RF014 | HU-08, HU-09, HU-10 (3) | Sprint 3 | Especificado |



> **Especificado** indica que épico, histórias de usuário e critérios de aceitação foram documentados e estão prontos para entrar em desenvolvimento; nenhuma codificação foi reportada até o presente período de referência.

# 6. Cronograma Atualizado (Sprints de 2 Semanas)



| Sprint | Semanas | Entregas Principais | Status |

|--------|----------|--------------------|--------|

| **Sprint 0 — Setup** | 1–2 | Estrutura do projeto, repositório Git, wireframes das telas principais (incluindo telas de login e recuperação de senha) | Próximo |

| **Sprint 1 — Auth + Core Nutricionista** | 3–4 | Implementação do Supabase Auth (login, sessão, RLS), cadastro de pacientes, cálculos automáticos, persistência via Supabase | Planejado |

| **Sprint 2 — Plano Alimentar** | 5–6 | Criação de planos, listagem de alimentos, vinculação ao paciente | Planejado |

| **Sprint 3 — Área do Paciente** | 7–8 | Interface do paciente com acesso autenticado, visualização da dieta, marcação de refeições | Planejado |

| **Sprint 4 — Evolução e Polimento** | 9–10 | Gráfico de evolução, ajustes de UX e validação do fluxo de autenticação | Planejado |

| **Sprint 5 — Entrega Final** | 11–12 | Correção de bugs, documentação, preparação da apresentação | Planejado |



> **Conclusão do Cronograma:** a autenticação via Supabase Auth foi absorvida no Sprint 1 sem necessidade de extensão de prazo, graças à integração nativa que elimina o desenvolvimento de back-end customizado.



---



# 7. Matriz de Riscos Atualizada



| ID | Risco | Probabilidade | Impacto | Ação de Mitigação |

|----|--------|---------------|----------|-------------------|

| **R1** | Escopo mal definido gerando retrabalho: funcionalidades novas podem ser inseridas durante o desenvolvimento, comprometendo o prazo do MVP. | Alta | Alto | Congelar o escopo do MVP após aprovação do RVS. Utilizar um backlog versionado no GitHub Projects. Qualquer nova funcionalidade é registrada como v2. |

| **R2** | Limitação técnica de autenticação: integração do Supabase Auth com Row Level Security (RLS) pode exigir configuração cuidadosa para garantir isolamento de dados entre pacientes e nutricionistas. | Baixa | Alto | Implementar e validar as políticas de RLS no Sprint 1 antes de desenvolver as demais funcionalidades. Documentar as regras de acesso no README do repositório. |

| **R3** | Disponibilidade do time: conflito com outras disciplinas, provas ou compromissos pessoais pode reduzir a capacidade produtiva em semanas críticas. | Média | Alto | Distribuir tarefas com responsáveis claros desde o Sprint 0. Manter buffer de 2 semanas no cronograma (Sprints 11–12). Realizar reunião semanal de sincronização de 30 minutos. |



> **Atualização do Risco R2:** com a incorporação da autenticação ao escopo formal do MVP e o planejamento de implementação e validação de RLS já no Sprint 1, a probabilidade do risco foi revista de **Média** para **Baixa** em relação à versão anterior da RVS.



---



# 8. Casos de Uso Críticos (Resumo)



Dois casos de uso concentram a maior complexidade técnica e funcional do MVP e foram detalhados na Atividade Prática v1.1 com fluxo principal, fluxos alternativos e fluxos de exceção.



Os fluxos completos não são reproduzidos aqui; este relatório apresenta apenas um resumo de status.



## UC-00 — Realizar Login (RF000, Épico 0)



Pré-requisito de todo o sistema.



Cobre:



- Autenticação por e-mail e senha via Supabase Auth;

- Recuperação de senha por e-mail;

- Tratamento de exceções como:

  - credenciais inválidas;

  - falha de conexão;

  - formato de e-mail inválido.



---



## UC-01 — Criar Plano Alimentar (RF007, Épico 2)



História de usuário de maior complexidade do MVP (HU-06), com dependência direta do UC-00.



Cobre:



- criação de refeições;

- cadastro de alimentos;

- cálculo automático de totais calóricos;

- edição de planos existentes (RF008);

- tratamento de exceções como:

  - refeição sem alimentos;

  - falha de conexão com o Supabase;

  - expiração da sessão durante o preenchimento.



---



# 9. Conformidade Legal (LGPD) — Status Atualizado



| Exigência LGPD | Aplicação no NutriSmart | Status |

|---------------|-------------------------|--------|

| Finalidade específica para coleta | Dados coletados exclusivamente para gestão nutricional | Atendido |

| Consentimento do titular | Termo de uso apresentado no cadastro do paciente | Planejado para v2 |

| Minimização de dados | Apenas dados necessários ao cálculo e plano são coletados | Atendido |

| Segurança e sigilo | Supabase Auth + HTTPS + controle de acesso por perfil (RLS) | Atendido no MVP |

| Direito de exclusão | Funcionalidade de exclusão de paciente no painel do nutricionista (HU-04) | Planejado |

| Indicação de DPO | Não obrigatório para projetos de pequeno porte/acadêmicos | N/A |



---



# 10. Veredicto de Viabilidade (TELOS) — Atualizado



| Dimensão | Status | Justificativa Resumida |

|----------|--------|------------------------|

| **T — Técnica** | **VIÁVEL** | Stack estável (React + Supabase Free Tier + Supabase Auth), expertise adequada ao MVP, riscos conhecidos e gerenciáveis. |

| **E — Econômica** | **VIÁVEL** | Custo zero para o MVP (Supabase Auth incluso no Free Tier); TCO comercial acessível com ROI positivo a partir de 5 clientes. |

| **L — Legal** | **VIÁVEL*** | Autenticação no MVP reforça a conformidade LGPD; conformidade completa exigida na versão comercial. |

| **O — Operacional** | **VIÁVEL** | Sistema resolve problemas reais; autenticação com padrão familiar ao usuário não adiciona complexidade operacional. |

| **S — Cronograma** | **VIÁVEL** | MVP entregável em 10–12 semanas; autenticação absorvida no Sprint 1 sem impacto no prazo. |



# DECISÃO



✅ **GO**



O projeto NutriSmart, com Autenticação e Controle de Acesso incorporados ao escopo do MVP, permanece aprovado para avançar às fases de modelagem e desenvolvimento.



> **Ressalva Legal:** para evolução do MVP para produto comercial, ainda são obrigatórios:

>

> - política de privacidade publicada;

> - termo de consentimento para coleta de dados de saúde;

> - mecanismo de exclusão de dados do titular (Art. 18 da LGPD).



---



# 11. Próximos Passos e Pendências



- Iniciar o Sprint 0 (Semanas 1–2): estrutura do projeto, repositório Git e wireframes, incluindo as telas de login e recuperação de senha.



- Configurar o Supabase Auth e as políticas de Row Level Security (RLS) já no Sprint 1, antes do desenvolvimento das demais funcionalidades, como ação de mitigação do risco R2.



- Pendência legal: elaborar o termo de consentimento do titular dos dados, atualmente planejado apenas para a versão v2.



- Pendência funcional: implementar a funcionalidade de exclusão de dados do paciente (HU-04), garantindo o atendimento ao Art. 18 da LGPD.



- Manter o backlog congelado: qualquer nova funcionalidade proposta após este relatório deve ser registrada como v2, conforme ação de mitigação do risco R1.



---



# 12. Conclusão



O projeto NutriSmart encerra o período de referência com o planejamento e a especificação funcional concluídos, status geral **No Prazo** e decisão de viabilidade **GO** mantida.



A principal evolução foi a incorporação de **Autenticação e Controle de Acesso** ao escopo do MVP, eliminando uma inconsistência identificada entre a RVS e a Atividade Prática, sem impacto no prazo ou no custo do projeto.



O próximo marco é o início do **Sprint 0**.