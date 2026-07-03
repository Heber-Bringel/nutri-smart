## Why

O projeto NutriSmart encontra-se na fase de setup inicial, e a stack tecnológica definida nas ADRs e documentos do projeto referencia o React 18 como versão base do frontend. Desde então, o ecossistema React evoluiu significativamente — React 19 já é a versão estável — e o TypeScript se consolidou como padrão da indústria para aplicações React modernas. Manter o projeto em React 18 e sem uma configuração explícita de TypeScript desde o início significa iniciar o desenvolvimento com tecnologia defasada, perdendo ganhos de performance (React Compiler, melhorias em server components), tipos estáticos e a experiência de desenvolvimento que o ecossistema atual oferece.

Esta mudança visa atualizar a base tecnológica do projeto **antes do início do desenvolvimento**, garantindo que todo o código gerado já nasça sobre React 19+ e TypeScript, evitando retrabalho futuro de migração.

## What Changes

- **Frontend**: Substituir React 18 por React 19+ como versão alvo do framework
- **TypeScript**: Adotar TypeScript como linguagem padrão para todo o código fonte (`.ts` / `.tsx`), com configuração de `tsconfig.json` desde o setup inicial
- **Build tooling**: Garantir que o Vite esteja configurado com o plugin `@vitejs/plugin-react-swc` (compatível com React 19) e suporte nativo a TypeScript
- **Documentação**: Atualizar as referências a React 18 nos artefatos do projeto:
  - `docs/ADRs/0003-definicao-da-stack-tecnologica-do-mvp.md` — trocar "React 18" por "React 19+"
  - `docs/Context/ERS.md` (seção 1.4 Stack Tecnológica) — atualizar versão
  - `docs/PRD/prd.md` — garantir consistência com as demais decisões
- **Dependências**: Configurar `package.json` com `react@^19`, `react-dom@^19`, `typescript@^5`, e tipagens correspondentes (`@types/react`, `@types/react-dom`)
- **Configuração de tipos**: Adicionar `tsconfig.json` com `strict: true`, paths absolutos (`@/`), e suporte a JSX com `"jsx": "react-jsx"`
- **Remoção de referências desatualizadas**: Substituir qualquer menção a React 18, JavaScript puro ou ausência de TypeScript nos documentos e decisões arquiteturais

## Capabilities

### New Capabilities
- `tech-stack-update`: Configuração da stack moderna do NutriSmart — React 19+, TypeScript 5, Vite, e dependências atualizadas

### Modified Capabilities
*(Nenhuma capability existente ainda — este é o setup inicial)*

## Impact

- **ADRs**: `0003-definicao-da-stack-tecnologica-do-mvp.md` precisa ser revisada para refletir React 19+ e TypeScript
- **ERS**: Seção 1.4 (Stack Tecnológica do MVP) deve ser atualizada
- **PRD**: Nenhuma alteração funcional, apenas consistência terminológica
- **Build / Tooling**: `package.json` e `tsconfig.json` serão criados/ajustados; `vite.config.ts` precisará do plugin SWC
- **Código**: Todo código novo deverá usar `.tsx`/`.ts` e React 19 APIs; não haverá código legado em React 18
- **Nenhuma alteração** em Supabase, Vercel, Tailwind ou demais componentes da stack — apenas o frontend e sua linguagem/versão
