import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify
from textblob import TextBlob
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Função central que faz o Web Scraping para qualquer URL do G1 que passarmos
def extrair_noticias_g1(url, palavras_graves, palavras_boas):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'}
    
    try:
        resposta = requests.get(url, headers=headers)
        soup = BeautifulSoup(resposta.text, 'html.parser')
        posts = soup.find_all('div', class_='feed-post-body', limit=15)
        
        resultados = []
        for item in posts:
            titulo_tag = item.find('a', class_='feed-post-link')
            if not titulo_tag: continue

            # Captura de imagem (mesma lógica robusta de antes)
            container_pai = item.find_parent('div', class_='feed-post')
            img_tag = container_pai.find('img') if container_pai else None
            
            img_url = ""
            if img_tag:
                img_url = img_tag.get('src') or img_tag.get('data-src') or img_tag.get('srcset')
            
            if not img_url or "data:image" in img_url or "base64" in img_url:
                img_url = "https://via.placeholder.com/800x400?text=Imagem+Indisponivel"

            titulo = titulo_tag.get_text().strip()
            resumo_tag = item.find('div', class_='feed-post-body-resumo')
            resumo = resumo_tag.get_text().strip() if resumo_tag else "Confira os detalhes no portal."
            link = titulo_tag.get('href')
            
            texto_analise = (titulo + " " + resumo).lower()
            
            # Análise de sentimento baseada nas palavras fornecidas pela Rota
            if any(p in texto_analise for p in palavras_graves):
                sentimento = "Negativo"
            elif any(p in texto_analise for p in palavras_boas):
                sentimento = "Positivo"
            else:
                sentimento = "Neutro"

            resultados.append({
                'titulo': titulo, 'resumo': resumo, 'link': link, 
                'sentimento': sentimento, 'imagem': img_url
            })
        return resultados
    except Exception as e:
        return [{"erro": str(e)}]

# ROTA 1: Aba Rio de Janeiro
@app.route('/noticias/rj', methods=['GET'])
def buscar_rj():
    graves_rj = ['morte', 'morre', 'morto', 'tiroteio', 'preso', 'prisão', 'assalto', 'roubo', 'crime', 'violência', 'baleado', 'operação']
    boas_rj = ['show', 'festival', 'carnaval', 'praia', 'turismo', 'evento', 'cultura', 'inaugura', 'reforma', 'sucesso']
    
    dados = extrair_noticias_g1("https://g1.globo.com/rj/rio-de-janeiro/", graves_rj, boas_rj)
    return jsonify(dados)

# ROTA 2: Aba Tecnologia e Games (NOVO)
@app.route('/noticias/tech', methods=['GET'])
def buscar_tech():
    # Palavras-chave ajustadas para o mundo tech/games
    graves_tech = ['vazamento', 'falha', 'hacker', 'golpe', 'vírus', 'caiu', 'instabilidade', 'demissão', 'processo', 'prejuízo']
    boas_tech = ['lançamento', 'inovação', 'atualização', 'grátis', 'promete', 'oficial', 'novo', 'sucesso', 'ia']
    
    dados = extrair_noticias_g1("https://g1.globo.com/tecnologia/", graves_tech, boas_tech)
    return jsonify(dados)

if __name__ == '__main__':
    app.run(port=5000, debug=True)