 # NUTRISMART
 ## Relatório de Viabilidade de Software (RVS)
 ### Framework TELOS — Análise Completa de Viabilidade (Versão 1.3 — Convite de Acesso)

 **Aluna:** Maria Clara Almeida Martins
 **Professor:** Mayllon Veras
 **Disciplina:** Engenharia de Software 2
 **Local/Data:** Piripiri - PI, Junho de 2026

 ---

 ## 1. Identificação do Projeto

 | Nome do Sistema | NutriSmart |
 | :--- | :--- |
 | **Tipo** | Sistema Web — MVP Acadêmico com Potencial Comercial |
 | **Domínio** | Saúde e Nutrição Digital |
 | **Usuários-Alvo** | Nutricionistas e seus pacientes |
 | **Objetivo Principal** | Automatizar cálculos nutricionais, centralizar prontuário clínico (medidas e anotações), gerenciar consultas e engajar pacientes. |
 | **Stack Tecnológica** | React 19+ com TypeScript, Node.js, Supabase Free Tier (Auth + RLS), Biblioteca Client-Side PDF (jsPDF) |
 | **Decisão Final Esperada** | GO — Aprovado para Continuidade do Desenvolvimento do MVP Ampliado |

 ---

 ## 2. Resumo Executivo

 O **NutriSmart** é uma aplicação web voltada para a prática nutricional clínica, projetada para otimizar o fluxo de trabalho de nutricionistas e aumentar o engajamento dos pacientes.

 Nesta versão revisada (v1.3), o escopo do MVP inclui o convite seguro de acesso do paciente por e-mail, além de ter sido estendido para além dos cálculos básicos e planos alimentares, englobando a gestão completa da rotina clínica: **Registro Histórico de Medidas Corporais**, **Anotações Clínicas Privadas**, **Emissão de Relatórios Consolidados em PDF** e **Agenda de Consultas Integrada**.

 O sistema continua focado em seus dois perfis centrais: o Nutricionista (gestão de pacientes, avaliações, agendas e relatórios) e o Paciente (acesso à dieta, marcação de adesão e visualização de consultas). 

 A expansão atende diretamente às dores de mercado ao eliminar ferramentas paralelas e descentralizadas. Com base na reavaliação sob o framework TELOS, o projeto permanece **VIÁVEL**, com riscos controlados e cronograma ajustado para absorver os novos módulos acadêmicos.

 ---

 ## 3. Análise TELOS

 ### 3.1 T — Viabilidade Técnica (Technical)
 A stack original foi complementada por ferramentas de geração de documentos client-side, mantendo o desenvolvimento focado no ecossistema JavaScript/TypeScript.

 | Tecnologia | Finalidade | Expertise do Time | Estabilidade |
 | :--- | :--- | :--- | :--- |
 | **React 19+ com TypeScript** | Interface do usuário (SPA reativa e type-safe) | Média-Alta | Alta |
 | **Supabase Free** | Persistência em nuvem e PostgreSQL | Média | Alta |
 | **Supabase Auth** | Autenticação, convite por e-mail e controle via RLS | Média | Alta |
| **Supabase Edge Functions** | Execução administrativa segura do convite de pacientes | Média | Alta |
 | **Tailwind CSS** | Estilização responsiva mobile-first | Média | Alta |
 | **jsPDF / Lib** | Geração de relatórios no navegador | Média | Alta |
 | **Git + GitHub** | Controle de versão e gerência | Alta | Alta |

 * **Convite de Acesso:** O serviço nativo de e-mail do Supabase Auth envia um link individual de uso único, válido por 24 horas. Uma Edge Function protege a operação administrativa e a integração é isolada por `IPatientInvitationService` e `SupabasePatientInvitationAdapter`. Falhas são registradas sem desfazer o cadastro clínico.
 * **Geração de PDF no Client-Side:** Atende perfeitamente ao requisito de emissão de relatórios (RF026) sem onerar o backend ou estourar as limitações do Supabase Free Tier. O documento é gerado diretamente a partir do estado da aplicação no navegador.
 * **Agenda e Conflitos:** A lógica de validação de horários sobrepostos (RF032) será executada via funções de banco ou validações na camada cliente, aproveitando a tipagem nativa de data/hora do PostgreSQL/Supabase.
 * **Riscos Técnicos Resolvidos:** Operações simultâneas de agendamento podem gerar concorrência. Mitigado por regras restritivas no banco de dados e integridade assegurada pela validação de conflitos (0% de consultas sobrepostas).

 ### 3.2 E — Viabilidade Econômica (Economic)
 * Como projeto acadêmico, o custo financeiro direto de execução permanece zero (R$ 0,00).
 * As funcionalidades de relatório, agenda e convite de acesso utilizam bibliotecas e serviços incluídos nos planos gratuitos e recursos nativos do Supabase, não gerando custos adicionais para o MVP.
 * Todos os módulos novos (Módulo de Avaliação Clínica Avançada, Relatórios e Agenda) foram acomodados nas ferramentas gratuitas (Vercel Free Tier e Supabase Free Tier). O custo de infraestrutura para os 6 meses mantém-se em R$ 0,00.
 * O valor percebido do produto aumentou significativamente com o novo escopo: 
   * **Acompanhamento Longitudinal:** centralização de prontuário, evitando planilhas extras.
   * **Redução de Desistências:** agenda integrada e avisos reduzem o absenteísmo.
   * **Potencial Comercial:** com a adição de agenda e prontuário completo, o valor estimado de uma futura assinatura SaaS sobe de R$ 79,90/mês para R$ 119,90/mês, com breakeven mantido extremamente baixo.

 ### 3.3 L — Viabilidade Legal (Legal)
 A inclusão do módulo de Avaliação Clínica Avançada e Anotações Clínicas (RF023) eleva o rigor legal do sistema. As anotações de texto livre são categorizadas estritamente como dados de saúde sensíveis (Art. 11 da LGPD).

 * **Mitigação Legal Aplicada:** O sistema foi configurado para que as anotações clínicas sejam criptografadas/isoladas via Row Level Security (RLS), sendo visíveis unicamente ao nutricionista responsável, nunca ao paciente ou terceiros.
 * O uso da biblioteca jsPDF atende à licença MIT, permitindo sua incorporação livre de royalties.

 ### 3.4 O — Viabilidade Operacional (Operational)
 Os novos módulos trazem fluxos familiares a clínicas de saúde. A agenda em formato de calendário (visão diária e semanal) foi desenhada para operação ágil tanto em desktop quanto em mobile, atendendo à área de toque mínima de 44x44px (RNF012).

 | Funcionalidade | Problema Resolvido | Complexidade para o Usuário |
 | :--- | :--- | :--- |
 | **Registro de Medidas (RF020)** | Elimina fichas físicas paralelas para dobras e circunferências. | Baixa (Campos numéricos) |
 | **Anotações Clínicas (RF023)** | Centraliza o histórico de queixas e evolução subjetiva na ficha. | Baixa (Texto livre) |
 | **Emissão de Relatório (RF026)** | Agiliza a entrega de documentos para o paciente em PDF com 1 clique. | Muito Baixa |
 | **Agenda de Consultas (RF029)** | Organiza os horários e impede consultas sobrepostas automaticamente. | Média (Calendário interativo) |
| **Convite de Acesso (RF035)** | Permite que o paciente defina a própria senha com segurança. | Baixa (acesso ao link e definição da senha) |

 ### 3.5 S — Viabilidade de Cronograma (Schedule)
 Para acomodar os novos requisitos sem estourar o prazo final do período acadêmico, o cronograma macro de Sprints foi reordenado de forma modular:

 `[Sprint 0: Setup & Wireframes] ➔ [Sprint 1: Auth & Core Nutricionista] ➔ [Sprint 2: Plano Alimentar & Medidas] ➔ [Sprint 3: Área Paciente & Agenda] ➔ [Sprint 4: Relatórios & Gráficos] ➔ [Sprint 5: Polimento & Entrega]`

 * **Sprint 0 — Setup (Semanas 1-2):** Estrutura do projeto, configuração do repositório Git e criação dos wireframes (incluindo as telas das novas visões de agenda e histórico de medidas).
 * **Sprint 1 — Auth + Core Nutricionista (Semanas 3-4):** Implementação do Supabase Auth (login/senha), cadastro básico de pacientes e cálculos automatizados de IMC/TMB/GET.
 * **Sprint 2 — Plano Alimentar + Medidas Corporais (Semanas 5-6):** Criação de planos alimentares e inclusão do Módulo de Medidas Corporais (RF020), permitindo salvar circunferências e percentual de gordura.
 * **Sprint 3 — Área do Paciente + Agenda de Consultas (Semanas 7-8):** Interface do paciente para visualizar dietas e marcação de refeições. Implementação do Módulo de Agenda (RF029-RF032) com validação de sobreposição de horários.
 * **Sprint 4 — Emissão de Relatórios + Gráficos de Evolução (Semanas 9-10):** Integração dos gráficos de evolução temporal (peso e medidas) e implementação do Módulo de Relatórios em PDF via client-side (RF026).
 * **Sprint 5 — Polimento e Entrega (Semanas 11-12):** Convite de acesso do paciente (RF035), validação de responsividade mobile (360px), correção de bugs e fechamento da documentação.

 ---

 ## 4. Matriz de Riscos Atualizada

 | # | Risco | Prob. | Imp. | Ação de Mitigação Prioritária |
 | :--- | :--- | :--- | :--- | :--- |
 | **R1** | **Scope Creep (Expansão excessiva):** Novas ideias surgirem após a revisão v1.3. | Alta | Alto | RF035/HU-22 constitui exceção formal aprovada na issue #53; após esta revisão, funcionalidades sem RF permanecem adiadas para v2. |
 | **R2** | **Vazamento de Anotações Clínicas:** Falha nas políticas de RLS expor dados sensíveis do Art. 11 da LGPD. | Baixa | Alto | Criação de políticas de RLS específicas para a tabela de anotações no Supabase, garantindo rejeição automática de leituras vindas de pacientes. |
 | **R3** | **Estouro de prazo nas Sprints 3 e 4:** A alta densidade de novas telas (Agenda + PDF) sobrecarregar o time. | Média | Alto | Utilização de componentes prontos de calendário (bibliotecas padrão de React) e geração simplificada de PDF baseada em templates diretos. |
| **R4** | **Falha ou limitação no envio de convites:** indisponibilidade ou limite do serviço nativo de e-mail impedir a entrega imediata. | Média | Médio | Cadastro clínico não bloqueante, estado persistido, erro sanitizado e possibilidade futura de SMTP externo sem alteração do domínio. |
| **R5** | **Exposição de credenciais:** uso de senha previsível ou vazamento de chave administrativa. | Baixa | Alto | Paciente define a própria senha; Edge Function protege a service role; nenhum token ou senha é persistido em tabela pública. |

 ---

 ## 5. Decisão Final — Veredicto TELOS Atualizado

 | Dimensão | Status | Justificativa Resumida |
 | :--- | :--- | :--- |
 | **T — Técnica** | **VIÁVEL** | Relatórios permanecem no cliente e o convite utiliza Supabase Auth/Edge Function já compatíveis com a infraestrutura adotada. |
 | **E — Econômica** | **VIÁVEL** | Permanência em R$ 0,00 para a operação do MVP acadêmico, agregando maior valor de mercado para futura exploração comercial. |
 | **L — Legal** | **VIÁVEL** | O isolamento total das anotações clínicas assegura a conformidade estrita com o tratamento de dados sensíveis da LGPD. |
 | **O — Operacional** | **VIÁVEL** | Centraliza a rotina do profissional (calculadora, agenda, relatórios e prontuário) em uma plataforma única de fácil onboarding. |
 | **S — Cronograma** | **VIÁVEL** | Cronograma reorganizado em 6 sprints modulares garantindo a entrega do MVP funcional expandido dentro do semestre letivo. |

 > **DECISÃO: GO ✓**
 > O projeto NutriSmart permanece **APROVADO** e com o sinal verde mantido para a execução do desenvolvimento de seu escopo estendido.