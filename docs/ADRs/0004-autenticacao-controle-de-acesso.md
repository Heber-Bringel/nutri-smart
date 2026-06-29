# ADR 0004 - Implementação do Mecanismo de Autenticação

Data: 21/06/2026

## Status

Accepted

## Contexto

Na definição inicial da stack do MVP (ADR 0003), a autenticação de usuários foi explicitamente deixada de fora do escopo para mitigar riscos de prazo no cronograma acadêmico de 12 semanas. No entanto, o avanço do desenvolvimento do NutriSmart trouxe a necessidade imediata de proteger dados clínicos sensíveis, individualizar históricos alimentares e garantir que os pacientes visualizem apenas suas próprias dietas.

Diante disso, a equipe precisa introduzir um mecanismo de login e controle de acessos. Essa solução deve ser implementada de forma rápida, sem custos financeiros e, crucialmente, deve respeitar a separação de conceitos estabelecida na arquitetura do projeto (ADR 0002), evitando o acoplamento direto da interface com o provedor de identidade.

## Decisão

A equipe decidiu adotar o **Supabase Auth** como provedor de autenticação do sistema, utilizando estratégias baseadas em JWT (JSON Web Tokens). 

Para manter a conformidade com a Clean Architecture e o MVVM definidos na ADR 0002, a implementação seguirá as seguintes diretrizes:

* **Camada de Infra (`infra/`):** Criar um `SupabaseAuthService` que encapsula as chamadas nativas do SDK do Supabase (como `signInWithPassword` e `signUp`).
* **Camada de Domínio (`model/services/`):** Definir um contrato/interface abstrata (ex: `IAuthService`) para que as camadas internas não conheçam o Supabase.
* **Camada de Casos de Uso (`usecase/`):** Criação dos casos de uso `LoginUseCase`, `RegisterUseCase` e `GetCurrentUserUseCase`.
* **Gerenciamento de Sessão:** O estado do usuário autenticado será exposto via contratos de repositório e injetado nos ViewModels através da camada de Injeção de Dependências (`di/`).

## Consequências

### Positivas

* Agilidade na Implementação: Utiliza a infraestrutura de BaaS já contratada e configurada no projeto, eliminando a necessidade de desenvolver um servidor de autenticação do zero.
* Segurança Pronta: Delega rotinas complexas de segurança (hashing de senhas, expiração de tokens e proteção contra ataques comuns) para uma plataforma especializada.
* Adesão à Clean Architecture: O uso de interfaces no domínio garante que, caso o Supabase seja substituído no futuro por outro provedor (como Firebase ou Auth0), os ViewModels e Casos de Uso permanecerão intactos.
* Custo Zero: A funcionalidade está inclusa no *Free Tier* do Supabase utilizado pela equipe.

### Negativas

* Esforço Extra de Desenvolvimento: Exigirá a criação de novas telas (Login/Cadastro), novos ViewModels e novos Casos de Uso, pressionando o cronograma restante das semanas letivas.
* Aumento de Boilerplate na Infra: Para manter o desacoplamento, será necessário mapear os objetos de usuário nativos do Supabase para as entidades internas de domínio do projeto.
* Gerenciamento de Estado Global: Introduz a complexidade de gerenciar um estado global de sessão (usuário logado vs. deslogado) que impactará o fluxo de rotas no Frontend (React).
