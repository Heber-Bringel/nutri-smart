# AGENTS.md — NutriSmart

> Instruções obrigatórias para todos os agentes de IA que operem neste repositório.

---

## 1. Regras Gerais de Conduta

- **Idioma:** Toda comunicação, código (nomes de variáveis, comentários, documentação) e commits devem estar em **português-BR**, exceto termos técnicos consagrados (e.g., `useCase`, `adapter`, `repository`, `model`, `viewmodel`).
- **Tom:** Direto, técnico e profissional. Sem saudações excessivas ou enrolação.
- **Pergunte antes de agir:** Sempre solicite a opinião do usuário antes de implementar funcionalidades, correções ou refatorações — nunca assuma decisões de design por conta própria.
- **Não invente funcionalidades:** Só implemente o que foi explicitamente solicitado ou que consta nos documentos de requisitos.
- **Não apague comentários existentes:** Preserve todos os comentários e docstrings que não forem diretamente afetados pela alteração em curso.

---

## 2. Regras de Escopo

- O escopo do MVP está **CONGELADO** na ERS v1.3. Os requisitos válidos são **RF001–RF035** e as **HU-00–HU-22**. A issue #53 foi incorporada formalmente como RF035/HU-22.
- Antes de propor qualquer funcionalidade, confira a seção **"Fora de Escopo"** do [PRD](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/PRD/prd.md). Se a ideia estiver lá, marque como **candidata a v2** e pare.
- Se a ideia não corresponder a nenhum RF existente, marque como **candidata a v2** e pare — não expanda o escopo.
- Toda proposta deve referenciar o(s) **RF** e **HU** correspondentes (ex.: "Implementa RF020, HU-12").

### Itens explicitamente fora do MVP:

- Integração bidirecional com Google Calendar / Outlook
- Faturamento, cobrança ou gateway de pagamento
- Notificações via WhatsApp Business API / SMS
- App nativo iOS/Android publicado em loja
- White label / customização de tema por nutricionista

---

## 3. Regras de Git e Workflow

### Branches

- Convenção: `tipo/nome-da-change` (ex.: `feature/auth-supabase`, `bugfix/filtro-pacientes`).
- Tipos válidos: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `chore`.
- O nome da branch deve ser **igual ao nome da change do OpenSpec** quando aplicável.
- `main` contém código estável. `develop` é usada para validação antes de merge na `main`.

### Commits (Conventional Commits)

```
feat(escopo): descrição curta
fix(escopo): descrição curta
docs(escopo): descrição curta
refactor(escopo): descrição curta
chore: descrição curta
```

- O **escopo** entre parênteses deve ser um dos 7 domínios: `auth`, `patients`, `nutritional-assessment`, `patient-adherence`, `clinical-measurements`, `reports`, `scheduling`.
- Commits em português-BR.

### Pull Requests

- Sempre referenciar a Issue com `Closes #N`.
- Referenciar a change OpenSpec correspondente.
- Listar os RF/HU cobertos.
- Seguir o checklist definido em [git-workflow.md](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/workflow/git-workflow.md).
- Merge via **Squash and Merge**, sempre.

---

## 4. Referências Obrigatórias

Antes de iniciar qualquer tarefa, o agente **deve consultar** os seguintes documentos:

| Documento | Caminho | Quando consultar |
|---|---|---|
| **PRD** | [prd.md](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/PRD/prd.md) | Escopo, decisões de implementação, padrões GoF, fora de escopo |
| **ERS** | [ERS.md](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/Context/ERS.md) | Requisitos funcionais (RF001–RF035) e não-funcionais |
| **Casos de Uso** | [USE_CASES.md](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/Context/USE_CASES.md) | Fluxos detalhados de cada funcionalidade |
| **ADR 0002** | [0002](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/ADRs/0002-escolha-do-estilo-e-organizacao-de-codigo.md) | Arquitetura (Clean Architecture + MVVM), estrutura de pastas |
| **ADR 0003** | [0003](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/ADRs/0003-definicao-da-stack-tecnologica-do-mvp.md) | Stack tecnológica (React 19+ com TypeScript, Supabase, Tailwind, jsPDF) |
| **ADR 0004** | [0004](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/ADRs/0004-autenticacao-controle-de-acesso.md) | Autenticação (Supabase Auth, IAuthService) |
| **ADR 0005** | [0005](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/ADRs/0005-adocao-padroes-projeto.md) | Padrões GoF (Adapter, Factory, Strategy, Observer) |
| **OpenSpec Config** | [config.yaml](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/openspec/config.yaml) | Regras de proposal, specs, design e tasks |
| **Git Workflow** | [git-workflow.md](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/workflow/git-workflow.md) | Branches, commits, PRs, merge |
| **RVS** | [RVS.md](file:///C:/Users/heber%20bringel/Documents/workspaces/engenharia_de_software/nutri-smart-trabalho-final/nutri-smart/docs/Context/RVS.md) | Viabilidade, riscos e cronograma |

---

## 5. Instruções por Tipo de Agente

### 🔍 Agente Pesquisador (Research)

- Foque em levantar informações dentro do repositório antes de buscar externamente.
- Ao responder, sempre cite o **arquivo-fonte** e a **linha** onde encontrou a informação.
- Não proponha mudanças — apenas relate descobertas e sugira próximos passos ao usuário.

### 🛠️ Agente Implementador (Builder)

- Consulte o PRD, ADRs e ERS **antes** de escrever qualquer código.
- Respeite a estrutura de pastas definida no ADR 0002:
  ```
  src/
  ├── app/            # Interface (React)
  ├── viewmodel/      # Controle de estado e lógica de apresentação
  ├── usecase/        # Casos de uso da aplicação
  ├── model/          # Entidades, regras e contratos do domínio
  │   ├── entities/
  │   ├── errors/
  │   └── services/
  ├── infra/          # Integrações externas (Supabase, jsPDF, etc.)
  └── di/             # Injeção de dependências
  ```
- Nunca importe diretamente SDKs externos (Supabase, jsPDF, React Big Calendar) dentro de `usecase/` ou `model/`. Use **Adapters** na camada `infra/` que implementem interfaces do domínio.


### 📋 Agente Revisor (Reviewer)

- Verifique se o código respeita a separação de camadas (Clean Architecture + MVVM).
- Confirme que nenhum SDK externo vaza para a camada de domínio.
- Valide que os padrões GoF estão sendo aplicados corretamente:
  - **Adapter + Factory:** para integrações externas.
  - **Strategy:** para `IAgendamentoValidator` (validação por perfil de usuário).
  - **Observer:** para `ConsultaEventEmitter` (efeitos colaterais desacoplados).
- Verifique se há referência ao RF/HU correspondente.
- Reprove código que funcione mas viole a arquitetura — "funcionou" não é critério suficiente.

### 📝 Agente de Planejamento (Planner / Proposer)

- Toda proposta deve referenciar RF e HU correspondentes.
- Use **Given/When/Then** nos cenários de especificação.
- Se a change envolver dados sensíveis (anotações clínicas, dados de paciente), descreva a regra de **RLS** no design.
- Se usar Supabase, jsPDF ou calendário, nomeie o **Adapter** e a **interface de domínio** no design.
- Referencie o **ADR** correspondente quando existir.

---

## 6. Stack Tecnológica (Referência Rápida)

| Camada | Tecnologia |
|---|---|
| Frontend | React 19+ com TypeScript + Vite |
| Estilização | Tailwind CSS |
| BaaS / Banco | Supabase Free Tier (PostgreSQL + Auth + RLS) |
| Relatórios PDF | jsPDF (client-side) |
| Calendário | React Big Calendar |
| Deploy | Vercel Free Tier |
| Controle de Versão | Git + GitHub |
| Qualidade Local | ESLint + Prettier |
