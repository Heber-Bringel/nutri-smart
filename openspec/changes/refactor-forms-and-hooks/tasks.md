## 1. Setup e Dependências

- [ ] 1.1 Instalar as bibliotecas `react-hook-form`, `zod` e `@hookform/resolvers`

## 2. Refatoração do Fluxo de Login (Auth)

- [ ] 2.1 Criar schema de validação Zod para os dados de Login
- [ ] 2.2 Criar custom hook `useAuthViewModel` que instancie o `LoginUseCase` via injeção de dependência e gerencie os estados de `isLoading` e `error`
- [ ] 2.3 Refatorar o componente `LoginPage.tsx` para usar o `useAuthViewModel`, o `react-hook-form` e remover o acoplamento direto com o `UseCase`

## 3. Refatoração do Fluxo de Pacientes

- [ ] 3.1 Criar schema de validação Zod para o Cadastro e Edição de Pacientes
- [ ] 3.2 Criar custom hook `usePacientesViewModel` focado em gerenciar chamadas de listagem, criação e exclusão, além dos estados locais
- [ ] 3.3 Refatorar `PatientForm.tsx` e componentes relacionados à listagem de pacientes para consumir apenas o `usePacientesViewModel`

## 4. Refatoração do Fluxo de Agendamento (Opcional se aplicável)

- [ ] 4.1 Criar schema Zod para validação de agendamentos (se houver form de criação na View)
- [ ] 4.2 Criar custom hook `useAgendaViewModel` para abstrair operações da agenda e esconder a emissão de eventos (Observer) e uso do Strategy
- [ ] 4.3 Refatorar os componentes da Agenda para utilizar o novo ViewModel
