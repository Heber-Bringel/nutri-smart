# ADR 0003 - Definição da Stack Tecnológica do MVP

**Data:** 28/05/2026  
**Status:** Accepted

---

## Contexto
O MVP do **NutriSmart** é uma aplicação web voltada para a saúde e nutrição digital, com o objetivo principal de automatizar cálculos nutricionais e engajar pacientes no acompanhamento da dieta. Para a execução do projeto no âmbito acadêmico da disciplina de Engenharia de Software II, a equipe enfrenta restrições severas de tempo (calendário letivo de aproximadamente 10 a 12 semanas de desenvolvimento) e a necessidade de mitigar custos financeiros, operando com um orçamento estritamente zero para a fase de MVP.

Do ponto de vista técnico, o sistema exige uma interface altamente reativa para que as interações dos pacientes (como a marcação de refeições concluídas) reflitam dinamicamente nos gráficos de evolução e indicadores. Além disso, há a necessidade de persistência de dados em nuvem para organizar históricos alimentares e fichas clínicas com segurança, demandando uma stack que equilibre a maturidade e expertise atual do time com a agilidade exigida pelo cronograma acadêmico.

---

## Decisão
Decidimos adotar a seguinte stack tecnológica para a construção, persistência e publicação do MVP do NutriSmart:

*   **Frontend (Interface do Usuário):** **React 18** construído sobre o ecossistema **Vite** e estilizado com **Tailwind CSS**. O React garante a reatividade necessária para o gerenciamento de estados dos indicadores clínicos e dashboards, enquanto o Tailwind CSS acelera a prototipação de telas responsivas para os perfis de usuários do sistema.
*   **Backend as a Service (BaaS) e Banco de Dados:** **Supabase Free Tier** (baseado em banco de dados relacional **PostgreSQL**). O Supabase atuará como mecanismo de persistência em nuvem e fornecedor de APIs automáticas, eliminando a necessidade de estruturar um backend tradicional próprio nesta primeira fase (ficando o uso de Node.js + Express postergado para o planejamento da versão v2).
*   **Hospedagem e Governança:** **Vercel** para o deploy contínuo da aplicação frontend de forma gratuita, integrada diretamente ao controle de versão e repositório central no **GitHub**.

> **Nota Técnica:** Os cálculos de IMC e gasto calórico basal/total (TMB) serão processados localmente no cliente através de código baseado nas fórmulas científicas de Harris-Benedict e Mifflin-St Jeor, eliminando dependências e riscos com a integração de APIs externas de terceiros.

---

## Consequências

### Positivas (Benefícios)
*   **Velocidade de Entrega e Foco no Negócio:** A eliminação de um backend tradicional estruturado do zero reduz drasticamente a necessidade de escrever código *boilerplate*, permitindo que o time foque na implementação das regras de negócio nutricionais e entregue o MVP dentro do prazo de 12 semanas.
*   **Custo Financeiro Zero:** Toda a infraestrutura selecionada (Vercel, Supabase Free Tier e GitHub) opera sob camadas e planos gratuitos, mitigando totalmente o risco econômico durante o período letivo.
*   **Alinhamento com a Expertise do Time:** A equipe possui nível de conhecimento prévio estabelecido em React e Git/GitHub, o que diminui sensivelmente a curva de aprendizado inicial e os riscos de atraso no cronograma.

### Negativas (Trade-offs e Riscos Assumidos)
*   **Ausência de Autenticação Segura no MVP:** Para cumprir o escopo crítico no prazo estipulado, o acesso à plataforma não terá proteção por login de usuários nesta fase inicial. O sistema operará com essa limitação técnica temporária, ficando restrito a demonstrações acadêmicas e ambientes controlados até a implementação segura planejada com Supabase Auth/JWT na v2.
*   **Gargalo de Escalabilidade no BaaS:** A camada gratuita do Supabase possui limitações estritas de capacidade e conexões. Embora seja perfeitamente suficiente para o escopo do MVP acadêmico, exigirá uma migração obrigatória para o plano Pro ou um PostgreSQL independente caso o produto evolua comercialmente.
*   **Acoplamento com o Provedor (Vendor Lock-in):** Consumir as tabelas e APIs do Supabase diretamente pelo cliente Frontend gera uma dependência direta dos métodos e da arquitetura da plataforma. Caso a equipe decida mudar a estratégia de banco de dados ou backend no futuro, haverá a necessidade de uma refatoração expressiva na camada de integração de dados da aplicação.