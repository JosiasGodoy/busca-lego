const legoCardContainer = document.querySelector("#results-container");
const campoBusca = document.getElementById("campo-busca");
const filtroPecas = document.getElementById("filtro-pecas");
const valorPecasSpan = document.getElementById("valor-pecas");
const contadorResultados = document.getElementById("contador-resultados");

let dados = [];

// Função principal que aplica todos os filtros
function aplicarFiltros() {
    const termoBusca = campoBusca.value.toLowerCase();
    const maxPecas = parseInt(filtroPecas.value, 10);

    const dadosFiltrados = dados.filter(dado => {
        // 1. Filtro por texto (título ou código)
        const correspondeAoTexto = termoBusca === '' || 
                                 dado.titulo.toLowerCase().includes(termoBusca) ||
                                 dado.codigo.includes(termoBusca);
        
        // 2. Filtro por quantidade de peças
        const correspondeAsPecas = dado.pecas <= maxPecas;
        
        // O set deve corresponder a AMBOS os filtros
        return correspondeAoTexto && correspondeAsPecas;
    }); 

    renderizarCards(dadosFiltrados)
}

function renderizarCards(dados) {
    // Atualiza o contador com o número de resultados encontrados
    if (contadorResultados) {
        contadorResultados.textContent = dados.length;
    }

    legoCardContainer.innerHTML = "";

    if (dados.length === 0) {
        legoCardContainer.innerHTML = `<p class="sem-resultados">Nenhum set encontrado com os filtros aplicados.</p>`;
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("lego-card");
        article.innerHTML = `
            <img class="lego-card-image" src="${dado.imagem}" alt="Imagem do Set de Lego">
            <div class="lego-card-content">
                <h2 class="lego-card-title">${dado.titulo}</h2>
                <p class="lego-card-details">
                    Set: <span>${dado.codigo}</span> <br>
                    Peças: <span>${dado.pecas}</span>
                </p>
                <div class="lego-card-footer">
                    ${dado.ano}
                </div>
            </div>`;
        legoCardContainer.appendChild(article);
    }
}

// Função para carregar os dados e configurar a página
async function inicializar() {
    const resposta = await fetch("data.json");
    dados = await resposta.json();
    
    // Configura o valor máximo do slider com base nos dados reais
    const maxPecas = Math.max(...dados.map(set => set.pecas));
    filtroPecas.max = maxPecas;
    filtroPecas.value = maxPecas;
    valorPecasSpan.textContent = maxPecas;

    // Adiciona "ouvintes" para filtrar em tempo real
    campoBusca.addEventListener('input', aplicarFiltros);
    filtroPecas.addEventListener('input', () => {
        valorPecasSpan.textContent = filtroPecas.value;
        aplicarFiltros();
    });

    // Exibe todos os cards ao carregar a página
    aplicarFiltros();
}

// Inicia tudo quando a página carrega
inicializar();