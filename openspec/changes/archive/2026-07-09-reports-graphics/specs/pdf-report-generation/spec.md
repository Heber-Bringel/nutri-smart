## ADDED Requirements

### Requirement: Emissão de Relatório PDF Client-side
O sistema SHALL permitir que o nutricionista emita um relatório consolidado de cada paciente em formato PDF. A compilação e geração do arquivo deverão ser realizadas de forma integral no navegador do usuário (client-side).

#### Scenario: Geração do relatório consolidado do paciente
- **GIVEN** que o usuário está autenticado como nutricionista e os dados requisitados foram carregados com sucesso (restrição via RLS onde `auth.uid() = nutricionista_id`)
- **WHEN** o nutricionista aciona a ação de "Gerar Relatório"
- **THEN** o sistema compila os dados cadastrais, IMC, TMB, GET, medidas antropométricas e o histórico em um documento PDF, sem fazer chamadas à API de backend para a sua montagem.

### Requirement: Filtro de Período para Relatórios
O sistema SHALL possibilitar ao nutricionista selecionar o período do histórico de dados a ser incluído nos gráficos do relatório, oferecendo como opções 30, 60 ou 90 dias.

#### Scenario: Aplicação de filtro temporal na geração do relatório
- **GIVEN** que o nutricionista está na tela/modal de configuração de emissão de relatórios
- **WHEN** o nutricionista seleciona um filtro de período, por exemplo, "Últimos 60 dias", e confirma a geração
- **THEN** os gráficos e tabelas de evolução exportados no PDF devem retratar estritamente os dados que ocorreram dentro desta janela temporal.

### Requirement: Download e Impressão de Relatório
O sistema SHALL oferecer botões de ação explícitos para permitir que o arquivo PDF gerado seja salvo localmente pelo nutricionista ou impresso diretamente.

#### Scenario: Download de relatório PDF gerado
- **GIVEN** que o sistema terminou de compilar o relatório do paciente e o exibiu na interface
- **WHEN** o usuário seleciona a opção "Fazer Download"
- **THEN** o navegador aciona o download local do respectivo arquivo PDF.
