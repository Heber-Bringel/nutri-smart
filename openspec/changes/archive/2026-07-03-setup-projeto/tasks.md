## 1. Setup do Projeto com Vite + React 19 + TypeScript

- [x] 1.1 Criar o projeto com `npm create vite@latest . -- --template react-ts`
- [x] 1.2 Atualizar `package.json` para usar `react@^19` e `react-dom@^19`
- [x] 1.3 Instalar `@vitejs/plugin-react-swc` e configurar `vite.config.ts`
- [x] 1.4 Configurar `typescript@^5`, `@types/react`, `@types/react-dom` nas dependências

## 2. Configuração do TypeScript

- [x] 2.1 Configurar `tsconfig.json` com `"strict": true` e `"jsx": "react-jsx"`
- [x] 2.2 Configurar paths absolutos com alias `@/` apontando para `src/` no `tsconfig.json` e `vite.config.ts`
- [x] 2.3 Verificar compilação com `npx tsc --noEmit` sem erros

## 3. Estrutura de Diretórios

- [x] 3.1 Criar estrutura `src/app/`, `src/viewmodel/`, `src/usecase/`, `src/model/entities/`, `src/model/services/`, `src/infra/`, `src/di/`
- [x] 3.2 Adicionar arquivos `.gitkeep` em diretórios vazios (se necessário)

## 4. Atualização da Documentação

- [x] 4.1 Atualizar `docs/ADRs/0003-definicao-da-stack-tecnologica-do-mvp.md` — trocar "React 18" por "React 19+", adicionar TypeScript
- [x] 4.2 Atualizar `docs/Context/ERS.md` seção 1.4 — trocar "React 18" por "React 19+", adicionar TypeScript
- [x] 4.3 Atualizar `docs/PRD/prd.md` se houver referências a React 18
- [x] 4.4 Verificar demais documentos do projeto por referências a React 18 ou JavaScript puro

## 5. Verificação Final

- [x] 5.1 Executar `npm run build` e confirmar build bem-sucedido
- [x] 5.2 Executar `npx tsc --noEmit` e confirmar zero erros de tipo
- [x] 5.3 Executar `npm run dev` e confirmar que o servidor de desenvolvimento inicia sem erros
