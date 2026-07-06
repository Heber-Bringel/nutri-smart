## Why

A visualização da evolução do paciente através de gráficos (peso, adesão e medidas antropométricas) é essencial para o acompanhamento longitudinal e adequação do tratamento nutricional. Além disso, a capacidade de gerar relatórios consolidados em PDF agrega valor ao atendimento, reduz o trabalho manual do profissional e facilita a comunicação com o paciente (Implementa RF010, RF014, RF021, RF026–RF028, e HU-8, HU-13, HU-16, HU-17).

## What Changes

- Implementação de gráficos de evolução de peso e adesão ao plano alimentar para o nutricionista e paciente.
- Implementação de tabelas cronológicas e gráficos evolutivos para o histórico de medidas corporais.
- Criação de um gerador de relatórios PDF executado integralmente no client-side.
- Inclusão de funcionalidade para filtragem do período (30, 60 ou 90 dias) aplicado aos gráficos no momento da emissão do relatório.
- Inclusão de botões de ação para visualizar, baixar e imprimir os relatórios a partir do navegador.

## Capabilities

### New Capabilities
- `patient-evolution-charts`: Componentes visuais para apresentação de gráficos de evolução de peso, percentual de adesão e medidas corporais na aplicação web.
- `pdf-report-generation`: Funcionalidade de emissão de relatórios PDF consolidados do paciente, configuração de período dos dados e integração com download/impressão.

### Modified Capabilities


## Impact

- **Dependências:** Adição da biblioteca `jsPDF` ao projeto. Segundo a arquitetura e ADR 0005, ela não será utilizada diretamente; será abstraída através do `JsPdfReportAdapter` que implementa a interface de domínio `ReportGenerator`.
- **Interface (React):** Criação de novas views/componentes dentro de `app/` para exibição dos gráficos e interface de geração do relatório.
- **Integração de Dados:** O gerador de relatórios deverá consolidar dados do perfil do paciente, medidas corporais, histórico de peso e plano alimentar vigente requisitados das camadas de infra/repositório.
