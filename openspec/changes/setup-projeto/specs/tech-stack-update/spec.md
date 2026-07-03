## ADDED Requirements

### Requirement: React 19+ como framework frontend
O sistema DEVE utilizar React 19+ como framework de interface do usuário.
O projeto DEVE especificar `react@^19` e `react-dom@^19` como dependências.
A build tool DEVE ser Vite com o plugin `@vitejs/plugin-react-swc`.

#### Scenario: Verificação da versão do React
- **WHEN** o comando `npm ls react` é executado
- **THEN** a versão retornada DEVE ser 19.x.x

#### Scenario: Build com Vite + SWC
- **WHEN** o comando `npm run build` é executado
- **THEN** o build deve ser concluído sem erros utilizando o Vite e o plugin SWC

### Requirement: TypeScript como linguagem padrão
Todo código fonte do projeto DEVE ser escrito em TypeScript (`.ts` para lógica, `.tsx` para componentes React).
O arquivo `tsconfig.json` DEVE estar presente na raiz com `strict: true`.
O arquivo DEVE configurar paths absolutos com alias `@/` apontando para `src/`.
O arquivo DEVE configurar `"jsx": "react-jsx"` para suporte a JSX sem import explícito do React.

#### Scenario: Compilação TypeScript com strict mode
- **WHEN** o comando `npx tsc --noEmit` é executado
- **THEN** a compilação deve passar sem erros de tipo

#### Scenario: Paths absolutos funcionando
- **WHEN** um arquivo em `src/app/` importa de `@/model/entities/Patient`
- **THEN** o import deve resolver para `src/model/entities/Patient.ts`

#### Scenario: JSX sem import React
- **WHEN** um arquivo `.tsx` utiliza JSX sem `import React from 'react'`
- **THEN** o TypeScript não deve reportar erro de JSX não definido

### Requirement: Documentação da stack atualizada
O ADR 0003 (Definição da Stack Tecnológica do MVP) DEVE ser atualizado para refletir React 19+ e TypeScript.
A seção 1.4 do documento ERS (Stack Tecnológica do MVP) DEVE ser atualizada para refletir React 19+ e TypeScript.
Qualquer outra referência a React 18 ou JavaScript puro nos documentos do projeto DEVE ser substituída.

#### Scenario: ADR 0003 atualizado
- **WHEN** o arquivo `docs/ADRs/0003-definicao-da-stack-tecnologica-do-mvp.md` é lido
- **THEN** a linha de frontend DEVE mencionar "React 19+" e não "React 18"

#### Scenario: ERS seção 1.4 atualizada
- **WHEN** o arquivo `docs/Context/ERS.md` é lido
- **THEN** a seção 1.4 DEVE mencionar "React 19+" e "TypeScript" e não "React 18"

### Requirement: Dependências e configuração do projeto
O `package.json` DEVE listar `react@^19`, `react-dom@^19`, `typescript@^5`, `@types/react`, `@types/react-dom`, `vite` e `@vitejs/plugin-react-swc`.
Um `tsconfig.json` DEVE ser criado na raiz com configuração adequada.
O `vite.config.ts` DEVE utilizar o plugin `@vitejs/plugin-react-swc`.

#### Scenario: package.json com dependências corretas
- **WHEN** o arquivo `package.json` é lido
- **THEN** ele DEVE conter `react` na versão `^19`, `react-dom` na versão `^19`, e `typescript` na versão `^5`

#### Scenario: tsconfig.json presente e válido
- **WHEN** o arquivo `tsconfig.json` é lido
- **THEN** ele DEVE conter `"strict": true` e `"jsx": "react-jsx"` e paths com alias `@/`
