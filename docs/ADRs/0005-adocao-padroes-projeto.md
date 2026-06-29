# ADR 0005 - Adoção de Padrões GoF para Desacoplamento e Controle de Fluxo 

Data: 23/06/2026

## Status

Accepted

## Contexto

Durante a revisão de escopo do NutriSmart (ERS v1.1), foram identificados problemas de acoplamento que podem dificultar a manutenção e evolução do sistema ao longo dos próximos sprints e da futura versão v2.

A camada de dados utiliza chamadas diretas ao Supabase distribuídas entre componentes React, criando forte dependência da tecnologia atualmente adotada. O mesmo cenário ocorre nos módulos de autenticação, geração de relatórios em PDF e agenda de consultas, que dependem diretamente de bibliotecas externas sujeitas a substituição futura.

Além disso, o fluxo de agendamento de consultas necessita aplicar regras distintas conforme o perfil do usuário autenticado (nutricionista, administrador ou paciente). Sem uma estratégia adequada, essa lógica tende a crescer por meio de estruturas condicionais extensas, aumentando o acoplamento e reduzindo a manutenibilidade.

Também foi identificado que a criação de uma consulta gera múltiplos efeitos colaterais independentes, como envio de notificações, registro de auditoria, invalidação de cache e preparação de relatórios. Centralizar essas responsabilidades em um único serviço viola o princípio da responsabilidade única e dificulta a evolução do sistema.

Diante desses riscos, tornou-se necessário adotar padrões de projeto capazes de reduzir dependências diretas, facilitar testes, permitir substituição de tecnologias e promover extensibilidade.

## Decisão

Adotar os padrões de projeto GoF Adapter, Factory, Strategy e Observer como mecanismos oficiais de desacoplamento e organização do fluxo de execução do NutriSmart.

### Adapter + Factory

Será criada uma camada de abstração para componentes dependentes de tecnologias externas.

As integrações com persistência de dados, autenticação, geração de PDF e bibliotecas de calendário serão acessadas exclusivamente por meio de interfaces definidas no núcleo da aplicação

Implementações concretas serão mantidas na camada de infraestrutura e instanciadas por factories, permitindo a substituição de fornecedores sem impacto nas regras de negócio.

Exemplos:

* `PatientRepository` → `SupabasePatientRepository`

* `AuthProvider` → `SupabaseAuthAdapter`

* `ReportGenerator` → `JsPdfReportAdapter`

* `CalendarAdapter` → `ReactBigCalendarAdapter`

### Strategy

As regras de validação de agendamento serão encapsuladas em estratégias específicas para cada perfil de usuário.

Será utilizada a interface `IAgendamentoValidator`, com implementações independentes para nutricionista, administrador e paciente.

O serviço de agendamento passará a receber a estratégia adequada por injeção de dependência, eliminando cadeias extensas de `if/else` ou `switch`.

### Observer

Os efeitos colaterais decorrentes da criação de consultas serão desacoplados do serviço principal por meio do padrão Observer.

Um componente central (`ConsultaEventEmitter`) será responsável por notificar observadores registrados após a conclusão do agendamento.

Entre os observadores previstos estão:

* Envio de notificações ao paciente.

* Registro de auditoria.

* Invalidação de cache.

* Preparação de dados para relatórios.

Novos comportamentos poderão ser adicionados sem alterações no serviço de agendamento.

## Consequências

### Positivas

* Redução do acoplamento entre regras de negócio e tecnologias externas.

* Facilidade para substituir Supabase, bibliotecas de PDF ou componentes de calendário no futuro.

* Maior testabilidade por meio de interfaces e mocks.

* Possibilidade de adicionar novos perfis de usuário sem modificar o serviço de agendamento.

* Inclusão de novos efeitos colaterais sem alterar a lógica principal do sistema.

* Melhor aderência aos princípios SOLID, especialmente Aberto/Fechado e Responsabilidade Única.

* Evolução incremental da arquitetura ao longo dos sprints.

* Maior facilidade de manutenção e evolução para a versão v2.

### Negativas

* Aumento da quantidade de arquivos e abstrações no projeto.

* Necessidade de maior esforço inicial para configuração da arquitetura.

* Curva de aprendizado relacionada à injeção de dependência e composição de objetos.

* Maior nível de indireção ao navegar pelo código.

* Complexidade adicional para tratamento de falhas em observers assíncronos.

* Possível aumento do tempo de desenvolvimento durante os primeiros sprints devido à estrutura arquitetural adotada.
