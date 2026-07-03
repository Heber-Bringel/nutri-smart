## Context

O NutriSmart está na fase de setup inicial. A documentação existente (ADR 0003, ERS) referencia React 18, mas o ecossistema já evoluiu para React 19+. O projeto ainda não possui código fonte — todo o desenvolvimento está por começar. A stack deve ser atualizada antes da implementação para evitar retrabalho de migração futura.

A arquitetura já foi definida no ADR 0002 (Clean Architecture + MVVM) e ADR 0005 (padrões GoF). A atualização da stack deve ser compatível com essas decisões.

## Goals / Non-Goals

**Goals:**
- Adotar React 19+ como versão alvo do framework frontend
- Adotar TypeScript 5+ como linguagem padrão (`.ts` / `.tsx`)
- Configurar Vite com plugin SWC para build rápido e suporte nativo a TypeScript
- Configurar `tsconfig.json` com `strict: true` e paths absolutos
- Atualizar as documentações (ADR 0003, ERS) para refletir a nova stack
- Garantir que todo código gerado a partir de agora use a stack atualizada

**Non-Goals:**
- Alterar Supabase, Vercel, Tailwind CSS ou demais componentes da infraestrutura
- Alterar a arquitetura definida nos ADRs 0002 e 0005
- Implementar qualquer funcionalidade de negócio

## Decisions

### 1. React 19+ em vez de React 18
React 19 introduz o React Compiler (automatic memoização), melhorias em Server Components, `use()` API, e `useActionState` para formulários. Para um projeto que ainda não começou, não há razão para iniciar com a versão anterior. A API pública é largely backward-compatible, então toda a documentação existente sobre componentes, hooks e padrões continua válida.

**Alternativa considerada:** Permanecer em React 18. Rejeitada porque criaria dívida técnica desde o início.

### 2. TypeScript obrigatório (strict mode)
TypeScript com `strict: true` oferece type safety máximo, catches erros em tempo de compilação, e melhora a experiência de desenvolvimento com autocomplete e refatoração segura. A estrutura Clean Architecture + MVVM se beneficia especialmente de interfaces e tipos bem definidos nas camadas de domínio e infraestrutura.

**Alternativa considerada:** JavaScript puro ou TypeScript leniente (`strict: false`). Rejeitado por não oferecer os benefícios de segurança de tipos que um projeto acadêmico com múltiplos desenvolvedores exige.

### 3. Vite + `@vitejs/plugin-react-swc`
Vite é o build tool mais rápido do ecossistema React, com HMR instantâneo. O plugin SWC (em vez do Babel padrão) oferece compilação significativamente mais rápida de JSX/TypeScript. React 19 é totalmente compatível com Vite.

**Alternativa considerada:** Create React App (depreciado), Next.js (overhead desnecessário para SPA). Vite é a escolha padrão da comunidade para SPAs React.

### 4. Paths absolutos (`@/`)
Configurar `@/` como alias para `src/` simplifica imports e evita `../../` relativos, melhorando a legibilidade em uma estrutura com múltiplas camadas (app, viewmodel, usecase, model, infra, di).

### 5. jsconfig → tsconfig
Substituir qualquer configuração de JavaScript por `tsconfig.json` com `"jsx": "react-jsx"` para suporte a JSX puro (sem necessidade de `import React` em cada arquivo).

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| React 19 pode ter breaking changes em bibliotecas da comunidade (ex.: componentes de calendário, gráficos) | Verificar compatibilidade antes de adicionar cada dependência; manter React 19 como range (`^19`) para patches |
| TypeScript strict mode pode tornar o onboarding mais lento para membros da equipe menos familiarizados | Documentar os padrões de tipos mais comuns; considerar `strict: true` com algumas regras relaxadas (ex.: `noUnusedLocals: false`) durante o aprendizado |
| SWC plugin não oferece suporte a Babel plugins customizados | Como o projeto não usa Babel plugins, não há impacto; se necessário no futuro, pode-se trocar para o plugin Babel padrão facilmente |
