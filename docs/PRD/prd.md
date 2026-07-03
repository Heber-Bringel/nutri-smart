# Documento de Requisitos do Produto (PRD) — NutriSmart

## Declaração do Problema

Nutricionistas enfrentam uma sobrecarga administrativa significativa em sua rotina diária. O processo manual de cadastrar pacientes, realizar cálculos antropométricos e energéticos (como IMC, TMB e GET), organizar agendas de consultas e elaborar relatórios consome um tempo precioso que poderia ser direcionado ao atendimento clínico. Além disso, a falta de uma ferramenta integrada de fácil acesso para os pacientes visualizarem seus planos alimentares e registrarem sua adesão diária diminui o engajamento com o tratamento nutricional e dificulta o acompanhamento longitudinal da evolução do paciente.

## Solução

O **NutriSmart** é uma plataforma web responsiva voltada para a prática clínica nutricional que resolve essas dores conectando o profissional e o paciente em um ecossistema único. 
- **Para o Nutricionista:** automatiza cálculos clínicos instantaneamente (IMC via classificação OMS, TMB/GET via Mifflin-St Jeor), centraliza o prontuário (com registro de circunferências, dobras cutâneas e anotações clínicas privadas), organiza a rotina através de uma agenda inteligente com prevenção de conflitos de horários e gera relatórios consolidados em PDF com um clique.
- **Para o Paciente:** oferece uma área autenticada responsiva para visualização do plano alimentar diário, indicação visual de progresso diário e registro rápido de adesão (marcação de refeições concluídas), além de visualização da data da próxima consulta.

A segurança e o isolamento de dados são garantidos pelo uso de autenticação robusta e políticas de segurança em nível de linha (RLS), atendendo aos preceitos da LGPD para dados sensíveis de saúde.

## Histórias de Usuário

1. **Como um** usuário (nutricionista ou paciente), **eu quero** realizar login no sistema utilizando meu e-mail e senha, **para que** eu possa acessar as funcionalidades correspondentes ao meu perfil de forma segura e isolada.
2. **Como um** usuário (nutricionista ou paciente), **eu quero** recuperar minha senha por meio de um link enviado ao meu e-mail cadastrado, **para que** eu possa voltar a acessar minha conta mesmo que esqueça a senha, sem depender de suporte manual.
3. **Como um** nutricionista, **eu quero** cadastrar um novo paciente informando nome completo, data de nascimento, sexo biológico, peso (kg), altura (cm) e nível de atividade física, **para que** eu possa registrar suas informações clínicas no sistema e gerar os indicadores nutricionais automaticamente.
4. **Como um** nutricionista, **eu quero** visualizar a lista completa dos meus pacientes com nome, data do último atendimento e status do plano alimentar ativo, **para que** eu possa acessar rapidamente a ficha de qualquer paciente e priorizar os atendimentos.
5. **Como um** nutricionista, **eu quero** excluir permanentemente o registro de um paciente (incluindo todos os seus dados clínicos e planos alimentares), **para que** eu possa manter a base de dados limpa e exercer o direito de remoção do paciente conforme o Art. 18 da LGPD.
6. **Como um** nutricionista, **eu quero** que o sistema calcule automaticamente o IMC, a TMB e o Gasto Energético Total (GET) ao cadastrar ou editar as medidas de peso/altura de um paciente, **para que** eu possa eliminar erros manuais nos cálculos e reduzir o tempo administrativo por consulta.
7. **Como um** nutricionista, **eu quero** criar um plano alimentar personalizado para o paciente, contendo refeições estruturadas, alimentos, quantidades e calorias automáticas por refeição, **para que** eu possa prescrever uma dieta adequada às metas energéticas do paciente.
8. **Como um** nutricionista, **eu quero** visualizar gráficos de evolução de peso e medidas do paciente ao longo do tempo, **para que** eu possa avaliar a efetividade do tratamento e readequar a dieta.
9. **Como um** paciente, **eu quero** visualizar o plano alimentar planejado para o dia atual com os alimentos, quantidades e calorias totais por refeição, **para que** eu saiba exatamente o que consumir ao longo do dia.
10. **Como um** paciente, **eu quero** marcar cada refeição do dia como concluída em até dois toques na tela, **para que** eu registre minha adesão de forma ágil e intuitiva.
11. **Como um** paciente, **eu quero** ver um indicador visual de progresso diário (barra ou percentual), **para que** eu saiba quantas refeições já realizei em relação ao plano diário total.
12. **Como um** nutricionista, **eu quero** registrar medidas corporais detalhadas do paciente (circunferências da cintura, quadril, braço, coxa, dobras cutâneas e percentual de gordura) associadas à data de atendimento, **para que** eu possa realizar uma avaliação antropométrica completa.
13. **Como um** nutricionista, **eu quero** visualizar o histórico antropométrico do paciente in tabelas e gráficos comparativos, **para que** eu identifique perdas ou ganhos de medidas longitudinais.
14. **Como um** nutricionista, **eu quero** registrar anotações clínicas em texto livre vinculadas ao atendimento, **para que** eu mantenha um registro subjetivo confidencial da evolução clínica.
15. **Como um** nutricionista, **eu quero** visualizar, editar ou excluir anotações clínicas passadas, **para que** eu possa complementar ou retificar o prontuário.
16. **Como um** nutricionista, **eu quero** exportar e fazer download de um relatório completo do paciente em PDF (contendo dados cadastrais, indicadores, evolução e o plano vigente), **para que** eu possa entregá-lo impresso ou digitalmente ao paciente.
17. **Como um** nutricionista, **eu quero** filtrar o período dos gráficos de evolução contidos no relatório do paciente (30, 60 ou 90 dias), **para que** eu possa personalizar a entrega do documento.
18. **Como um** nutricionista, **eu quero** agendar uma consulta para um paciente informando data, hora e duração, **para que** eu gerencie meus horários de atendimento.
19. **Como um** nutricionista, **eu quero** visualizar minha agenda de consultas no formato de calendário diário e semanal, **para que** eu tenha uma visão organizada da minha semana de trabalho.
20. **Como um** nutricionista, **eu quero** reagendar ou cancelar uma consulta, **para que** eu possa acomodar imprevistos e remarcações.
21. **Como um** paciente, **eu quero** visualizar a data e hora da minha próxima consulta agendada em minha área exclusiva, **para que** eu me organize e evite faltas.

## Decisões de Implementação

- **Módulos do Sistema:**
  - **Módulo de Autenticação:** Baseado no **Supabase Auth** usando JWT. A comunicação é encapsulada em um `SupabaseAuthAdapter` respeitando a interface `IAuthService` definida no domínio para evitar acoplamento (ADR 0004).
  - **Módulo de Prontuário e Medidas Corporais:** Gerenciamento de circunferências, dobras cutâneas e anotações. As anotações de texto livre são tratadas como dados sensíveis de saúde (Art. 11 da LGPD) e protegidas rigorosamente via Row Level Security (RLS) no Supabase (invisíveis para o paciente).
  - **Módulo de Relatórios:** Implementação da biblioteca **jsPDF** no client-side (`JsPdfReportAdapter` sob a interface `ReportGenerator`). O PDF é gerado a partir do estado da aplicação no navegador, economizando recursos de infraestrutura e banda (ADR 0005).
  - **Módulo de Agenda:** Calendário interativo baseado em React Big Calendar (`ReactBigCalendarAdapter`). Implementa validação estrita de sobreposição de horários.
- **Padrões GoF Adotados (ADR 0005):**
  - **Adapter + Factory:** Abstração de bibliotecas externas (Supabase, jsPDF, calendário).
  - **Strategy:** Lógica de validação de consultas separada por papéis de usuário (Nutricionista, Administrador, Paciente) através de `IAgendamentoValidator`.
  - **Observer:** Efeitos colaterais da agenda (ex.: disparar notificações de lembrete, atualizar cache) gerenciados via `ConsultaEventEmitter`, separando a lógica de agendamento de outras responsabilidades secundárias.
- **Modelo de Dados e Segurança:**
  - Banco de dados PostgreSQL hospedado no Supabase.
  - Implementação rigorosa de **Row Level Security (RLS)** nas tabelas de pacientes, consultas, medidas e anotações para garantir isolamento absoluto de dados entre nutricionistas e pacientes.

## Decisões de Teste

- **Estratégia de Teste:** Os testes devem focar estritamente no comportamento externo e nas regras de negócio (seams), evitando acoplamento com a implementação interna dos componentes React ou com o SDK do Supabase.
- **Módulos Testados:**
  - **Módulo de Agenda (Validação de Conflitos):** Garantir que o validador de agendamento rejeite horários sobrepostos (0% de consultas sobrepostas em cenários concorrentes).
  - **Módulo de Cálculos Clínicos:** Testes unitários para validar a exatidão das fórmulas de Mifflin-St Jeor (TMB) e Harris-Benedict (GET), além das faixas de IMC da OMS.
  - **Módulo de Autenticação e RLS:** Testar a integridade das políticas do banco de dados (RLS) via testes de API, garantindo que um paciente nunca consiga ler ou escrever dados de outro paciente ou anotações clínicas privadas do nutricionista.
- **Prior Art (Referência):** Testes unitários limpos focados em casos de uso de domínio (`LoginUseCase`, `CreateAppointmentUseCase`), usando stubs/mocks para os adaptadores de banco de dados (`PatientRepositoryMock`).

## Fora de Escopo

- Integração nativa bidirecional com Google Calendar ou Outlook Calendar.
- Módulo de faturamento, cobrança eletrônica ou gateway de pagamento integrado no MVP.
- Envio de notificações via canais comerciais terceiros (WhatsApp Business API, SMS Gateway).
- Aplicativo móvel nativo (iOS/Android) publicado nas lojas (resolvido via Web App Responsivo).
- Customização de temas visuais (White Label) por nutricionista.

## Notas Adicionais

- **Conformidade LGPD:** As anotações de consulta são dados pessoais sensíveis. Além da proteção de dados em repouso e trânsito (HTTPS), a opção de exclusão de dados (Art. 18) está contemplada no fluxo de exclusão de paciente. O Termo de Consentimento detalhado para a coleta de dados de saúde física será implementado na versão v2 comercial do software.
