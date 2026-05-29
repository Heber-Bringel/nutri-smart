# ADR 0003 - Definição da Stack TecnolÓgica do MVP

Data: 28/05/2026

## Objetivo da Definição Tecnológica

A definição da stack tecnológica do MVP do NutriSmart tem como objetivo estabelecer um ecossistema de desenvolvimento que equilibre produtividade, simplicidade operacional, facilidade de manutenção e capacidade futura de evolução arquitetural.

Como o projeto possui caráter acadêmico, equipe reduzida e prazo limitado de desenvolvimento, as tecnologias selecionadas priorizam:

* rapidez de implementação;
* baixo custo operacional;
* facilidade de aprendizado;
* integração entre frontend e backend;
* suporte à arquitetura proposta;
* escalabilidade futura.

A stack escolhida também busca manter compatibilidade com:

* Clean Architecture;
* Monolito Modular;
* MVVM no frontend;
* organização baseada em Vertical Slices.

---

# 1. Stack Tecnológica Definida

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS

## Backend e Infraestrutura

* Supabase (Relacional)

## Hospedagem

* Vercel
* Supabase Cloud
* GitHub

---

# 2. Justificativa da Escolha do Frontend

## React

O React foi escolhido como principal biblioteca frontend devido à sua forte aderência ao desenvolvimento de interfaces reativas e componentizadas.

A arquitetura do NutriSmart exige:

* atualização dinâmica da interface;
* gerenciamento de estados;
* reatividade em tempo real;
* reutilização de componentes;
* separação entre lógica e interface.

Essas características se alinham diretamente aos conceitos do padrão MVVM adotado no sistema.

Além disso, o React oferece:

* componentização modular;
* ecossistema consolidado;
* ampla comunidade;
* facilidade de manutenção;
* integração natural com hooks e gerenciamento de estado.

Essa abordagem favorece a construção de interfaces modernas e altamente interativas, importantes para:

* dashboards nutricionais;
* acompanhamento alimentar;
* progresso de metas;
* atualização dinâmica de dados.

---

## TypeScript

O TypeScript foi adotado visando:

* tipagem estática;
* maior segurança no código;
* melhor organização estrutural;
* redução de erros em tempo de execução;
* facilidade de manutenção.

Como o projeto utiliza princípios da Clean Architecture e separação rigorosa de responsabilidades, a tipagem forte melhora significativamente:

* reutilização;
* legibilidade;
* manutenção;
* escalabilidade do sistema.

Além disso, o TypeScript reduz inconsistências comuns presentes em aplicações JavaScript puras.

---

## Vite

O Vite foi escolhido como ferramenta de build devido à sua alta performance e simplicidade de configuração.

Entre seus principais benefícios:

* inicialização rápida;
* hot reload eficiente;
* baixo tempo de compilação;
* menor complexidade de setup;
* excelente integração com React + TypeScript.

Para um MVP acadêmico, isso reduz tempo de configuração e acelera o desenvolvimento da aplicação.

---

## TailwindCSS

O TailwindCSS foi escolhido para estilização da interface devido à sua abordagem utility-first, que favorece:

* produtividade;
* padronização visual;
* componentização;
* manutenção simplificada.

Além disso, a biblioteca facilita:

* responsividade;
* prototipação rápida;
* reutilização de estilos;
* desenvolvimento de interfaces modernas.

Essa escolha é especialmente vantajosa para equipes pequenas e projetos com prazo reduzido.

---

# 3. Justificativa da Escolha do Backend

## Supabase

O Supabase foi escolhido como principal plataforma backend do MVP do NutriSmart.

A plataforma será utilizada como Backend-as-a-Service (BaaS), fornecendo:

* banco de dados;
* autenticação;
* armazenamento;
* APIs automáticas;
* realtime;
* gerenciamento de infraestrutura.

Essa escolha reduz significativamente a necessidade de implementação de um backend tradicional, permitindo que a equipe concentre esforços:

* nas regras de negócio;
* na experiência do usuário;
* na arquitetura do sistema;
* nas funcionalidades principais da aplicação.

Além disso, o Supabase reduz:

* complexidade operacional;
* tempo de desenvolvimento;
* necessidade de manutenção de servidores;
* quantidade de código boilerplate.

Para um MVP acadêmico, essa abordagem oferece excelente produtividade com baixa complexidade técnica.

---

# 4. Banco de Dados Relacional

O NutriSmart utilizará apenas o sistema de banco de dados integrado do Supabase.

A escolha do Supabase ocorre devido à sua integração nativa com toda a infraestrutura backend utilizada no projeto, permitindo centralizar:

autenticação;
persistência;
segurança;
APIs;
armazenamento;
controle de acesso.

A adoção de uma única plataforma reduz:

acoplamento operacional;
complexidade de configuração;
tempo de desenvolvimento;
necessidade de manutenção de múltiplos serviços independentes.

Além disso, o Supabase fornece:

gerenciamento simplificado do banco;
APIs automáticas;
políticas de segurança;
integração com autenticação;
escalabilidade futura.

Para o contexto do MVP acadêmico do NutriSmart, essa abordagem oferece excelente equilíbrio entre:

produtividade;
simplicidade;
organização arquitetural;
capacidade de evolução futura.
---

# 5. Compatibilidade da Stack com a Arquitetura

A stack tecnológica escolhida possui forte compatibilidade com os padrões arquiteturais definidos para o NutriSmart.

## Compatibilidade com MVVM

O React, combinado com hooks e gerenciamento de estado, favorece a implementação de conceitos inspirados em MVVM:

* Views desacopladas;
* lógica de apresentação isolada;
* atualização reativa da interface.

## Compatibilidade com Clean Architecture

O TypeScript facilita:

* separação de responsabilidades;
* definição de interfaces;
* organização em camadas;
* abstrações de domínio.

Mesmo utilizando Supabase diretamente, a arquitetura continuará tratando a infraestrutura como detalhe externo da aplicação.

## Compatibilidade com Monolito Modular

A stack escolhida favorece:

* modularização;
* organização por domínio;
* evolução incremental;
* separação lógica entre funcionalidades.

Essa abordagem permite crescimento gradual da aplicação sem necessidade imediata de microsserviços.

---

# 6. Considerações Finais

A stack tecnológica escolhida para o MVP do NutriSmart busca equilibrar:

* simplicidade;
* produtividade;
* organização arquitetural;
* baixo custo operacional;
* facilidade de manutenção.

A combinação de:

* React;
* TypeScript;
* Vite;
* TailwindCSS;
* Supabase;

permite que o sistema mantenha:

* interfaces modernas e reativas;
* organização modular;
* consistência de dados;
* desenvolvimento acelerado;
* facilidade de evolução futura.

Além disso, a stack reduz significativamente a complexidade técnica para uma equipe acadêmica pequena, sem comprometer os princípios arquiteturais definidos para o projeto.

Dessa forma, as tecnologias escolhidas atendem adequadamente às necessidades atuais e futuras do MVP do NutriSmart.