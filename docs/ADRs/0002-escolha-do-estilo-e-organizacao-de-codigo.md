# ADR 0002 - Escolha do Estilo e Organização de Código

Data: 28/05/2026

## Status

Accepted

## Contexto

O NutriSmart é um sistema de acompanhamento nutricional desenvolvido em contexto acadêmico, com prazo reduzido de implementação e equipe composta por estudantes com diferentes níveis de experiência.

Durante a definição da arquitetura do MVP, a equipe precisou escolher uma estratégia de organização do código que promovesse separação de responsabilidades, facilidade de manutenção e possibilidade de evolução futura do sistema.

Além disso, a solução utilizará o Supabase como Backend-as-a-Service (BaaS), delegando funcionalidades de persistência, autenticação e acesso aos dados para uma plataforma externa. Dessa forma, a arquitetura da aplicação deve garantir que as regras de negócio permaneçam independentes dos serviços fornecidos pela infraestrutura.

## Decisão

A equipe decidiu adotar uma combinação de Clean Architecture e MVVM como padrão arquitetural do projeto.

A Clean Architecture será responsável por organizar a aplicação em camadas de responsabilidade bem definidas, separando regras de negócio, casos de uso e integrações externas.

O padrão MVVM será utilizado para estruturar a interação entre interface, estado da aplicação e fluxos de negócio, promovendo melhor organização da lógica de apresentação e maior previsibilidade no gerenciamento de dados.

A estrutura da aplicação será organizada da seguinte forma:

```text
src/
├── app/            # Interface da aplicação
├── viewmodel/      # Controle de estado e lógica de apresentação
├── usecase/        # Casos de uso da aplicação
├── model/          # Entidades, regras e contratos do domínio
│   ├── entities/
│   ├── errors/
│   └── services/
├── infra/          # Integrações externas e acesso ao Supabase
└── di/             # Injeção de dependências
```

Nessa organização:

* A interface interage com os ViewModels;
* Os ViewModels executam os casos de uso;
* Os casos de uso aplicam as regras de negócio do domínio;
* A infraestrutura encapsula o acesso ao Supabase e demais serviços externos;
* O domínio permanece desacoplado de tecnologias específicas.

## Consequências

### Positivas

* Separação clara de responsabilidades entre as camadas da aplicação.
* Maior organização da base de código.
* Redução do acoplamento entre regras de negócio e serviços externos.
* Facilidade para manutenção e evolução do sistema.
* Melhor testabilidade dos casos de uso e regras de domínio.
* Possibilidade de substituir ou complementar serviços externos sem alterar a lógica central da aplicação.
* Maior previsibilidade no gerenciamento de estado e fluxo de dados.

### Negativas

* Maior complexidade estrutural em comparação com arquiteturas mais simples.
* Curva de aprendizado associada aos conceitos de Clean Architecture e MVVM.
* Necessidade de disciplina para respeitar as responsabilidades de cada camada.
* Aumento da quantidade de arquivos e abstrações do projeto.
* Algumas funcionalidades simples podem demandar mais código devido à separação arquitetural adotada.
* Dependência de uma camada adicional de abstração para acessar recursos fornecidos pelo Supabase.
