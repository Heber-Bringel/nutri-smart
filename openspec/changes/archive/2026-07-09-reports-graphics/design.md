## Context

O MVP do NutriSmart (Sprint 4, Issue 18) precisa fornecer ao nutricionista e ao paciente os meios para acompanhamento clínico longitudinal, por meio de gráficos de evolução e relatórios exportáveis. A solução precisa seguir as restrições da arquitetura limpa do projeto, garantindo que o módulo de relatórios execute exclusivamente no lado do cliente e evite acoplamento da biblioteca de PDFs ao domínio do negócio.

## Goals / Non-Goals

**Goals:**
- Integrar componentes de gráficos (ex.: peso, adesão e medidas corporais) interativos para a visão web do nutricionista e do paciente (sendo que o paciente vê apenas peso e adesão).
- Gerar relatórios do paciente em formato PDF (dados cadastrais, indicadores, plano e histórico) sem depender de backend para a compilação do arquivo.
- Permitir a filtragem de dados temporais (30, 60 ou 90 dias) para os gráficos que serão incluídos no relatório impresso/PDF.

**Non-Goals:**
- Geração de PDF via back-end.
- Configuração de templates ou layout (white label) editável pelo nutricionista.
- Integrações de envio de relatórios gerados de forma automatizada por e-mail/WhatsApp.

## Decisions

- **Geração de PDF (Adapter Pattern):**
  - **Decisão:** A biblioteca `jsPDF` será utilizada no client-side para montar o documento.
  - **Arquitetura (ADR 0005):** Será criado o `JsPdfReportAdapter`, localizado na camada de infraestrutura (`infra/`), que implementará a interface de domínio `ReportGenerator`. O caso de uso (ex.: `GeneratePatientReportUseCase`) dependerá exclusivamente dessa interface. Nenhum arquivo dentro de `usecase/` importará o `jsPDF`.
- **Componentes Visuais de Gráficos:**
  - **Decisão:** Os gráficos serão criados como componentes independentes na camada de visualização (`app/`). A lógica de filtragem dos 30, 60 ou 90 dias será tratada pelas `ViewModels`, que alimentarão a view apenas com os recortes temporais necessários para renderização.
- **Row Level Security (RLS) e Isolamento de Dados:**
  - **Decisão:** O relatório irá requisitar acesso aos dados de medidas e planos. As policies (RLS) do Supabase já restringem o SELECT e UPDATE desses dados ao nutricionista proprietário (`auth.uid() = nutricionista_id`), assegurando o cumprimento da LGPD em relação a dados sensíveis de saúde sem a necessidade de criar novas regras específicas de autorização na camada de interface.

## Risks / Trade-offs

- **[Risco] Sobrecarga de Memória no Navegador:**
  - A manipulação de arrays extensos (dias de adesão, históricos longos) no momento de instanciar o PDF via jsPDF pode gerar travamentos em dispositivos com baixa memória.
  - **Mitigação:** Os dados incluídos no relatório são estritamente filtrados pelas janelas de tempo limitadas a um máximo de 90 dias. A imagem do gráfico para o PDF será capturada via Canvas em resolução controlada.
- **[Risco] Complexidade de Manutenção do Layout PDF:**
  - Criar PDFs programaticamente usando jsPDF é verboso e consome tempo de manutenção ao lidar com paginação e coordenadas X/Y manuais.
  - **Mitigação:** Estabelecer funções auxiliares de desenho reutilizáveis no próprio Adapter e manter um layout limpo, contendo apenas o indispensável e tabelas simplificadas para evitar paginações erráticas.
