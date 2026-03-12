# 🤖 Robô Analista de Notícias - V1.1 (Dashboard Híbrido)

Este projeto é um dashboard inteligente que realiza o **web scraping** de portais de notícias, processa o conteúdo através de **Inteligência Artificial** para análise de sentimento e exibe os resultados em uma interface moderna, assíncrona e separada por contextos (Hard News vs. Tecnologia).

![Status](https://img.shields.io/badge/Status-V1.1_Ativa-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Flask](https://img.shields.io/badge/Framework-Flask-lightgrey)

## 🚀 Novidades da Versão 1.1
A evolução desta aplicação focou em resolver gargalos de UX (Experiência do Usuário) e precisão de dados:
* **Separação de Contexto (Abas):** O backend agora possui rotas independentes. Notícias de segurança do RJ não se misturam com termos de "vírus" e "hackers" do mercado de Tecnologia, garantindo uma IA calibrada e gráficos precisos para cada nicho.
* **Layout Híbrido (Hero Banner):** As 3 notícias mais urgentes ganharam destaque em um carrossel de largura total no topo da página.
* **Motor de Busca e Filtros Instantâneos:** Implementação de filtragem via JavaScript no frontend, permitindo buscar palavras-chave ou isolar notícias (Boas/Graves) em milissegundos, sem requisições extras ao servidor.

---

## 🛠️ Tecnologias Utilizadas

### **Backend (API & Dados)**
* **Python & Flask**: Criação da API e roteamento.
* **BeautifulSoup4**: Extração de dados (Web Scraping) superando desafios de *Lazy Loading* (data-src e srcset).
* **TextBlob**: Processamento de Linguagem Natural (NLP) com dicionários de peso customizados.

### **Frontend (Interface)**
* **HTML5, CSS3 & JS (ES6)**: Design "Neo-Glass", sistema de abas e carrossel interativo.
* **Chart.js**: Renderização dinâmica do balanço de sentimentos.
* **LocalStorage**: Persistência de dados para curadoria de notícias favoritas.

---

## ⚙️ Como Executar o Projeto Localmente

### **1. Configuração do Ambiente**
```bash
# Criar e ativar o ambiente virtual
python -m venv .venv
.\.venv\Scripts\activate  # No Windows

# Instalar dependências
pip install flask beautifulsoup4 requests textblob flask-cors

2. Iniciando o Backend (API)
Na pasta raiz do projeto, execute o servidor Flask:

python app.py

⚠️ Importante: O servidor rodará na porta 5000. Não acesse a raiz diretamente (retornará 404). As rotas ativas da API são:

Dados do Rio de Janeiro: http://127.0.0.1:5000/noticias/rj
Dados de Tecnologia: http://127.0.0.1:5000/noticias/tech

3. Iniciando o Frontend (Dashboard)
Com o terminal do Python rodando em segundo plano, abra o arquivo index.html em seu navegador (recomendado uso da extensão Live Server do VS Code para a porta 5500).

