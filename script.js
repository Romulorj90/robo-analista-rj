let meuGrafico = null;
let todasNoticias = [];
let filtroAtual = 'todos';
let categoriaAtual = 'rj';
let slideIndex = 0;
let carrosselTimer;

document.addEventListener('DOMContentLoaded', () => {
    // Abas de navegação
    document.querySelectorAll('.btn-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            categoriaAtual = e.target.dataset.categoria;
            carregarNoticias();
        });
    });

    // Buscas e Filtros
    document.getElementById('searchInput').addEventListener('input', aplicarFiltros);
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filtroAtual = e.target.dataset.filter;
            aplicarFiltros();
        });
    });

    carregarNoticias();
    atualizarListaFavoritos();
    setInterval(carregarNoticias, 300000);
});

async function carregarNoticias() {
    const feed = document.getElementById('feed');
    const track = document.getElementById('carouselTrack');

    feed.innerHTML = "<div style='text-align:center; padding:20px;'>⏳ Analisando dados...</div>";
    track.innerHTML = "<div style='text-align:center; padding:20px;'>Carregando destaques...</div>";

    try {
        const resposta = await fetch(`http://127.0.0.1:5000/noticias/${categoriaAtual}`);
        todasNoticias = await resposta.json();

        atualizarStats(todasNoticias);
        montarCarrossel(todasNoticias.slice(0, 3));
        aplicarFiltros();

    } catch (e) {
        feed.innerHTML = "<p style='color:#ff4d4d; text-align:center;'>Erro ao buscar dados. O servidor Python (app.py) está rodando?</p>";
        track.innerHTML = "";
    }
}

function montarCarrossel(destaques) {
    const track = document.getElementById('carouselTrack');
    track.innerHTML = '';
    clearInterval(carrosselTimer);

    if (destaques.length === 0) return;

    destaques.forEach((n, index) => {
        const imagemLimpa = n.imagem ? n.imagem.split(' ')[0] : 'https://via.placeholder.com/800x400';
        const ativo = index === 0 ? 'active' : '';

        track.innerHTML += `
            <div class="carousel-slide ${ativo}">
                <img src="${imagemLimpa}" alt="Destaque">
                <div class="carousel-content">
                    <span class="badge ${n.sentimento.toLowerCase()}">${n.sentimento}</span>
                    <h2><a href="${n.link}" target="_blank" style="color:white; text-decoration:none;">${n.titulo}</a></h2>
                    <p>${n.resumo}</p>
                    <button class="btn-fav" onclick="favoritar('${n.titulo.replace(/'/g, "")}', '${n.link}')">⭐ SALVAR NOTÍCIA</button>
                </div>
            </div>
        `;
    });

    slideIndex = 0;
    carrosselTimer = setInterval(() => mudarSlide(1), 5000);

    const container = document.getElementById('carouselDestaques');
    container.onmouseenter = () => clearInterval(carrosselTimer);
    container.onmouseleave = () => carrosselTimer = setInterval(() => mudarSlide(1), 5000);
}

function mudarSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    slides[slideIndex].classList.remove('active');
    slideIndex += n;

    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;

    slides[slideIndex].classList.add('active');
}

function aplicarFiltros() {
    const termoBusca = document.getElementById('searchInput').value.toLowerCase();
    const feed = document.getElementById('feed');
    feed.innerHTML = "";

    const noticiasFeed = todasNoticias.slice(3); // Pula as 3 primeiras que estão no carrossel

    const filtradas = noticiasFeed.filter(n => {
        const matchBusca = n.titulo.toLowerCase().includes(termoBusca) || n.resumo.toLowerCase().includes(termoBusca);
        const matchFiltro = filtroAtual === 'todos' || n.sentimento.toLowerCase() === filtroAtual;
        return matchBusca && matchFiltro;
    });

    if (filtradas.length === 0) {
        feed.innerHTML = '<div style="text-align:center; margin-top:30px; opacity:0.6;">Nenhuma notícia encontrada no feed com este filtro.</div>';
        return;
    }

    filtradas.forEach(n => {
        const imagemLimpa = n.imagem ? n.imagem.split(' ')[0] : 'https://via.placeholder.com/150x100';
        feed.innerHTML += `
            <div class="card">
                <img src="${imagemLimpa}" class="card-img" loading="lazy">
                <div class="card-body">
                    <div class="card-header">
                        <a href="${n.link}" target="_blank">${n.titulo}</a>
                        <span class="badge ${n.sentimento.toLowerCase()}">${n.sentimento}</span>
                    </div>
                    <p class="previa">${n.resumo}</p>
                    <button class="btn-fav" onclick="favoritar('${n.titulo.replace(/'/g, "")}', '${n.link}')">⭐ SALVAR</button>
                </div>
            </div>
        `;
    });
}

function atualizarStats(noticias) {
    let pos = 0, neg = 0, neu = 0;

    noticias.forEach(n => {
        if (n.sentimento === "Positivo") pos++;
        else if (n.sentimento === "Negativo") neg++;
        else neu++;
    });

    document.getElementById('total-noticias').innerText = noticias.length;
    document.getElementById('total-pos').innerText = pos;
    document.getElementById('total-neg').innerText = neg;
    document.getElementById('total-neu').innerText = neu;

    atualizarGrafico(pos, neu, neg);
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
            responsive: true, maintainAspectRatio: false,
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
        <li>
            <a href="${f.link}" target="_blank">⭐ ${f.titulo}</a>
            <button onclick="removerFav(${i})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold; margin-left:10px;">X</button>
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
    if (confirm("Apagar todos os favoritos?")) {
        localStorage.removeItem('favNoticias');
        atualizarListaFavoritos();
    }
}