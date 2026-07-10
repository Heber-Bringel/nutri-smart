## Context

A aplicação NutriSmart lida com formulários para manipulação de dados de usuários e pacientes, além de agendamentos. Atualmente, os formulários não possuem uma validação robusta baseada em esquemas e a interface visual de usuário (Views) chama diretamente os casos de uso de negócio através do injetor de dependência (DI).
Esse padrão acopla as regras de negócio à camada de apresentação. A Issue #29 exige a implementação do React Hook Form em conjunto com o Zod para validação forte dos dados no frontend e a criação de hooks (como camada ViewModel) para abstrair o consumo dos dados e execução de operações.

## Goals / Non-Goals

**Goals:**
- Validar as entradas de todos os formulários através de tipagem e verificação rigorosa usando schemas do `zod`.
- Melhorar a confiabilidade do gerenciamento de estado local dos formulários com `react-hook-form`.
- Criar hooks customizados para abstração de domínio, atuando como ViewModels (ex: `useAuthViewModel`, `usePacientesViewModel`).
- Remover chamadas diretas aos casos de uso dentro dos componentes visuais.
- Assegurar que nenhum detalhe de infraestrutura (como Supabase SDK) vaze para os hooks ou para os UseCases, usando os Adapters já definidos.

**Non-Goals:**
- Alterar regras de negócio subjacentes, regras de restrição de domínio e cálculos (como os cálculos nutricionais que permanecem isolados).
- Substituir o uso do Context API ou outras estratégias arquiteturais por bibliotecas de estado global (como Redux ou Zustand).
- Fazer refatoração total da UI que não diga respeito diretamente ao gerenciamento de estado dos forms.

## Decisions

1. **Validação com React Hook Form + Zod**
   - *Por quê?* O `react-hook-form` é otimizado para evitar renderizações desnecessárias e sua integração com `zod` via `@hookform/resolvers` permite que o mesmo schema de validação seja estendido facilmente no futuro.
   - *Alternativas consideradas:* Formik + Yup. Rejeitado por problemas de performance reportados em formulários complexos e suporte TypeScript nativo inferior ao Zod.

2. **Criação da Camada ViewModel (Custom Hooks)**
   - *Por quê?* De acordo com o padrão MVVM / Clean Architecture estabelecido, as Views (componentes React) não devem conhecer o domínio diretamente. Os hooks funcionarão como ViewModels: instanciando UseCases a partir do container `di`, gerenciando os estados de `loading`, `error` e agrupando lógicas de paginação e chamadas, enquanto injetam o Observer (`ConsultaEventEmitter`) onde necessário.
   - *Alternativas consideradas:* Continuar chamando UseCases da UI e tratar `loading` e `error` em cada tela. Rejeitado por gerar código duplicado e alto acoplamento.

3. **Adapters e Estrutura Existente (Supabase)**
   - *Por quê?* Mantendo o isolamento definido na arquitetura original, a implementação dos `useCases` manterá o acoplamento apenas com as interfaces do domínio, e os novos hooks nunca importarão de `supabase-js`, mas usarão apenas os resultados e métodos fornecidos pelos UseCases ou `di.get()`.

## Risks / Trade-offs

- **[Risk] Regressão na funcionalidade atual dos formulários** → Mitigação: Testes e revisão manual nos fluxos críticos de Login, Criação de Paciente e Agendamento após a migração para os schemas `zod`. Mapear cuidadosamente estados como `isSubmitting` para manter o feedback na UI.
- **[Risk] Complexidade inicial e padronização** → Mitigação: Criar uma estrutura de retorno consistente para os ViewModels, retornando por exemplo um objeto contendo propriedades padrão `{ data, isLoading, error, executeAction }`.

## Migration Plan

1. Instalar as três bibliotecas requeridas.
2. Criar os schemas na camada apropriada (dentro de `src/viewmodel/schemas` ou similar) e refatorar `LoginPage`.
3. Criar o `useAuthViewModel` e remover injeção de dependência explícita do `LoginPage`.
4. Seguir para o `PatientForm` e demais áreas da aplicação.
