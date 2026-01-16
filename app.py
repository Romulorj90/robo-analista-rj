import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify
from textblob import TextBlob
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PALAVRAS_GRAVES = ['morte', 'morre', 'morto', 'tiroteio', 'preso', 'prisão', 'assalto', 'roubo', 'crime', 'violência', 'baleado', 'corpo', 'fuga', 'polícia']
PALAVRAS_BOAS = ['show', 'festival', 'carnaval', 'praia', 'turismo', 'evento', 'cultura', 'inaugura', 'reforma', 'sucesso', 'vitória', 'ganha', 'grátis']

@app.route('/noticias', methods=['GET'])
def buscar_noticias():
    url = "https://g1.globo.com/rj/rio-de-janeiro/"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'}
    
    try:
        resposta = requests.get(url, headers=headers)
        soup = BeautifulSoup(resposta.text, 'html.parser')
        # Buscamos o container que engloba a notícia toda (incluindo a imagem lateral)
        posts = soup.find_all('div', class_='feed-post-body', limit=15)
        
        resultados = []
        for item in posts:
            titulo_tag = item.find('a', class_='feed-post-link')
            if not titulo_tag: continue

            # TENTATIVA REFORÇADA DE IMAGEM
            # Subimos dois níveis para pegar o container que tem a mídia
            container_pai = item.find_parent('div', class_='feed-post')
            img_tag = None
            if container_pai:
                img_tag = container_pai.find('img')
            
            img_url = ""
            if img_tag:
                # O G1 alterna entre src, data-src e srcset. Vamos testar todos.
                img_url = img_tag.get('src') or img_tag.get('data-src') or img_tag.get('srcset')
            
            # Limpeza: Se o link for um código binário (base64), ignoramos para não travar
            if not img_url or "data:image" in img_url or "base64" in img_url:
                img_url = "https://s2.glbimg.com/S6-Z7_98_00.jpg" # Imagem padrão do Rio

            titulo = titulo_tag.get_text().strip()
            resumo_tag = item.find('div', class_='feed-post-body-resumo')
            resumo = resumo_tag.get_text().strip() if resumo_tag else "Confira os detalhes no G1."
            link = titulo_tag.get('href')
            
            texto_analise = (titulo + " " + resumo).lower()
            
            if any(p in texto_analise for p in PALAVRAS_GRAVES):
                sentimento = "Negativo"
            elif any(p in texto_analise for p in PALAVRAS_BOAS):
                sentimento = "Positivo"
            else:
                sentimento = "Neutro"

            resultados.append({
                'titulo': titulo, 'resumo': resumo, 'link': link, 
                'sentimento': sentimento, 'imagem': img_url
            })
        return jsonify(resultados)
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)