let meuGrafico = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnUpdate').addEventListener('click', carregarNoticias);
    carregarNoticias();
    atualizarListaFavoritos();
    // Auto-atualização a cada 5 minutos
    setInterval(carregarNoticias, 300000);
});

async function carregarNoticias() {
    const feed = document.getElementById('feed');
    const btn = document.getElementById('btnUpdate');
    btn.innerText = "⏳ ANALISANDO...";
    btn.disabled = true;

    try {
        const resposta = await fetch('http://127.0.0.1:5000/noticias');
        const noticias = await resposta.json();
        feed.innerHTML = "";
        let pos = 0, neg = 0, neu = 0;

        noticias.forEach(n => {
            if (n.sentimento === "Positivo") pos++;
            else if (n.sentimento === "Negativo") neg++;
            else neu++;

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${n.imagem}" class="card-img" onerror="this.src='https://via.placeholder.com/150x100?text=G1+Rio'">
                <div class="card-body">
                    <div class="card-header">
                        <a href="${n.link}" target="_blank">${n.titulo}</a>
                        <span class="badge ${n.sentimento.toLowerCase()}">${n.sentimento}</span>
                    </div>
                    <p class="previa">${n.resumo}</p>
                    <button class="btn-fav" onclick="favoritar('${n.titulo.replace(/'/g, "")}', '${n.link}')">⭐ SALVAR</button>
                </div>
            `;
            feed.appendChild(card);
        });

        atualizarGrafico(pos, neu, neg);
        document.getElementById('total-noticias').innerText = noticias.length;
        document.getElementById('total-pos').innerText = pos;
        document.getElementById('total-neg').innerText = neg;
        document.getElementById('total-neu').innerText = neu;

    } catch (e) {
        feed.innerHTML = "<p style='text-align:center'>Erro ao conectar ao servidor. Verifique o app.py.</p>";
    } finally {
        btn.innerText = "🔄 ATUALIZAR AGORA"; btn.disabled = false;
    }
}

function atualizarGrafico(pos, neu, neg) {
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    if (meuGrafico) meuGrafico.destroy();
    meuGrafico = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Boas', 'Normais', 'Graves'],
            datasets: [{ data: [pos, neu, neg], backgroundColor: ['#2ecc71', '#95a5a6', '#e74c3c'], borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: 'white' } } }
        }
    });
}

function favoritar(titulo, link) {
    let favs = JSON.parse(localStorage.getItem('favNoticias')) || [];
    if (!favs.find(f => f.link === link)) {
        favs.push({ titulo, link });
        localStorage.setItem('favNoticias', JSON.stringify(favs));
        atualizarListaFavoritos();
    }
}

function atualizarListaFavoritos() {
    const lista = document.getElementById('listaFavoritos');
    const favs = JSON.parse(localStorage.getItem('favNoticias')) || [];
    lista.innerHTML = favs.map((f, i) => `
        <li style="color:white; background:rgba(255,255,255,0.05); padding:8px; border-radius:5px; margin-bottom:5px; display:flex; justify-content:space-between; align-items:center;">
            <a href="${f.link}" target="_blank" style="color:white; text-decoration:none; font-size:0.8rem; flex:1;">⭐ ${f.titulo}</a>
            <button onclick="removerFav(${i})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold; margin-left:5px;">X</button>
        </li>
    `).join('');
}

function removerFav(i) {
    let favs = JSON.parse(localStorage.getItem('favNoticias')) || [];
    favs.splice(i, 1);
    localStorage.setItem('favNoticias', JSON.stringify(favs));
    atualizarListaFavoritos();
}

function limparTodosFavoritos() {
    if (confirm("Limpar todos os favoritos?")) {
        localStorage.removeItem('favNoticias');
        atualizarListaFavoritos();
    }
}