# AI Harness do NutriSmart

## Objetivo

O AI Harness é o conjunto de contexto, restrições e sensores que cerca a geração assistida por IA. Ele transforma requisitos e decisões arquiteturais em entradas verificáveis e impede que uma saída aparentemente funcional viole o escopo do MVP, a separação de camadas ou os contratos de dados.

## Arquitetura do Harness

```text
Issue / requisito
      ↓
PRD + ERS + USE_CASES + ADRs + OpenSpec (feedforward)
      ↓
Prompt da tarefa com RF/HU, regras RLS e limites de camada
      ↓
Alteração no código
      ↓
ESLint → TypeScript (tsc -b) → testes automatizados (feedback)
      ↺ correção orientada pelo diagnóstico
```

As instruções operacionais ficam em `.agent/AGENTS.md`; o contexto de geração fica em `openspec/config.yaml`; as especificações de comportamento ficam em `openspec/specs/`; e os contratos formais ficam em `docs/contracts/`.

## Feedforward — garantia de entrada

Antes da IA escrever código, o time fornece:

1. **Contexto do produto:** `docs/PRD/prd.md`, `docs/Context/ERS.md` e `docs/Context/USE_CASES.md`, incluindo RF/HU, personas, limites e critérios de sucesso.
2. **Decisões arquiteturais:** ADR 0002 (Clean Architecture + MVVM), ADR 0003 (stack), ADR 0004 (autenticação) e ADR 0005 (Adapter, Factory, Strategy e Observer).
3. **Contrato antes da implementação:** `docs/contracts/openapi.yaml`, `docs/contracts/schemas.json` e `openspec/specs/` definem entradas, saídas, cenários Given/When/Then e regras de RLS.
4. **Regras no prompt e no agente:** `.agent/AGENTS.md` exige português-BR, escopo RF001–RF033/RF034 já documentado, referência a RF/HU, preservação de comentários e proíbe SDKs externos em `model/` e `usecase/`.
5. **Limites de integração:** Supabase, jsPDF e React Big Calendar só entram por adapters; cálculo nutricional permanece no domínio; anotações clínicas só podem ser lidas pelo nutricionista responsável.

Assim, o prompt não é apenas uma solicitação de funcionalidade: ele carrega o contrato, a rastreabilidade e as restrições que a implementação precisa satisfazer.

## Feedback — loop de correção baseado em sensores

O feedback é sequencial e deve ser executado após cada alteração:

### 1. Linter e formatador

`npm run lint` executa ESLint sobre o repositório. O sensor detecta imports inválidos, variáveis não utilizadas, violações de hooks e problemas de estilo. O Prettier é a referência de formatação quando uma alteração exigir normalização manual.

### 2. Typechecker

`npm run build` executa `tsc -b` antes do build Vite. O TypeScript verifica os contratos entre entidades, interfaces, use cases, adapters e componentes, evitando que payloads incompatíveis avancem para a execução.

### 3. Testes automatizados

O projeto mantém os casos de uso isolados de React e do SDK Supabase por interfaces, permitindo testes com stubs/mocks. Os testes devem cobrir prioritariamente cálculos IMC/TMB/GET, validações de formulário, conflitos de agenda, RLS/escopo de dados e adesão. Quando uma suíte de testes estiver disponível no branch, ela deve ser executada pelo script correspondente antes da revisão; a ausência de script de testes no MVP atual é uma lacuna explícita, não um resultado positivo fictício.

### Ordem e tratamento do diagnóstico

```bash
npm run lint
npm run build
npm test -- --run   # quando a suíte estiver configurada
```

O primeiro diagnóstico é corrigido antes de executar o próximo sensor. Uma falha de lint não é mascarada por `--no-verify`; um erro de tipo não é contornado com `any`; e uma falha de teste gera uma nova iteração de implementação. A revisão manual confirma ainda arquitetura, RLS, rastreabilidade RF/HU e aderência ao OpenAPI/JSON Schema.

## Evidências esperadas na revisão

- Saída limpa do ESLint.
- Build TypeScript/Vite concluído.
- Testes automatizados verdes, ou registro explícito de que a suíte ainda não está configurada.
- Diff com contrato atualizado quando a forma de entrada/saída mudar.
- PR vinculada à issue e contendo RF/HU impactados.
