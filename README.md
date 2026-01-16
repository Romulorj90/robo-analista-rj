🤖 Robô Analista de Notícias RJ - IA & Monitoramento em tempo real
Este projeto é um dashboard inteligente que realiza o web scraping das notícias do portal G1 Rio de Janeiro, processa o conteúdo através de Inteligência Artificial para análise de sentimento e exibe os resultados em uma interface moderna e automatizada.

🎯 Objetivo
O robô foi criado para monitorar o cenário do Rio de Janeiro, classificando-se como manchetes entre Boas , Normais ou Graves , permitindo uma visão estatística do dia através de um gráfico sonoro e um sistema de curadoria de favoritos.

🛠️ Tecnologias Utilizadas
Backend (O Cérebro)
Python : Linguagem principal.

Flask : Micro-framework para criação da API que atende os dados.

BeautifulSoup4 : Biblioteca para remoção de dados (Web Scraping).

TextBlob : Biblioteca de Processamento de Linguagem Natural (PNL) para análise de sentimento.

Flask-CORS : Para permitir a comunicação segura entre o Backend e o Frontend.

Frontend (Uma Interface)
HTML5 & CSS3 : Design "Neo-Glass" com fundo animado e layout responsivo em 3 colunas.

JavaScript (ES6) : Lógica para consumo de API, manipulação do DOM e persistência local.

Chart.js : Renderização de gráficos de rosca para visualização de dados.

LocalStorage : Armazenamento dos favoritos diretamente no navegador do usuário.

🚀 Como Executar o Projeto
1. Pré-requisitos
Certifique-se de ter o Python instalado. Recomenda-se o uso de um ambiente virtual:

Bash

# Criar ambiente virtual
python -m venv .venv

# Ativar ambiente (Windows)
.\.venv\Scripts\activate
2. Instalação das Dependências
Bash

pip install flask beautifulsoup4 requests textblob flask-cors
3. Iniciando o Backend
Na pasta raiz do projeto, execute:

Bash

python app.py
O servidor iniciará emhttp://127.0.0.1:5000 .

4. Iniciando o Frontend
Basta abrir o arquivo index.htmlno seu navegador. Dica: Utilize a extensão Live Server do VS Code para uma melhor experiência.

🧠 Desafios Superados durante o Desenvolvimento
Extração de Imagens Dinâmicas : Superamos o desafio do Lazy Load do G1, implementando uma lógica que captura atributos de imagem específicos ( data-srce srcset) para evitar que as miniaturas não carreguem ou pisquem.

Refinamento da IA : Criamos um filtro de palavras-chave customizado para garantir que notícias de segurança pública fossem rigorosamente definidas como "Negativas/Graves", corrigindo falsos-positivos da análise gramatical padrão.

Auto-atualização : Implementamos uma lógica de Polling em JavaScript que atualiza o feed e os gráficos a cada 5 minutos de forma assíncrona, sem recarregar a página.

📸 Funcionalidades em Destaque
Dashboard de Estatísticas : Contador em tempo real de cada categoria de notícia.

Sistema de Favoritos : Salve notícias importantes com um clique e remova-as quando desejar.

Gráfico Interativo : Visualização imediata do balanço de sentimentos das últimas 15 notícias.

Visual Futurista : Interface escura com transparências e animações suaves.

Desenvolvido por Rômulo Cavalcante Amorim Estudo focado em Engenharia de Dados e Desenvolvimento Full Stack.