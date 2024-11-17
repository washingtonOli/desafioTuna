document.addEventListener('DOMContentLoaded', async () => {
    const urlApiEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/';
    var resposta = await fetch(urlApiEstados);  // Chama a API para coletar os dados
    var estados = await resposta.json();  // Recebe os dados da API 

    let slideAtual = 0; //por onde começar a exibir o slide ao carregar a página
    let slidesExibidos = 3; //quantos exibir ao mesmo tempo ao carregar a página
    let totalSlides = 0; // ao fim dos slides, retoma pro 1º slide

    const container = document.querySelector('.carousel-slide');
    const voltarSlide = document.querySelector('.carousel-prev');
    const proximoSlide = document.querySelector('.carousel-next');
    const sidebar = document.querySelector('.sidebar'); //painel do menu lateral
    const menuToggle = document.querySelector('.menu-toggle'); // icone hamburguer

    // Função para mostrar/esconder o sidebar
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Função para gerar os slides do carrossel
    const criarCarrossel = () => {
        const regioes = []; // Array que vai armazenar as regiões. Vai passar a se comportar como um objeto pois não tem indice numerico

        // Agrupa estados por região
        estados.forEach((estado) => {
            const regiaoNome = estado.regiao.nome;  // Obtém o nome da região do estado

            // Vai criar um array para cada região. Depois, alimenta com o novo estado após cada iteração.
            if (!regioes[regiaoNome]) {
                regioes[regiaoNome] = [];  // Cria um novo array para cada região
            }

            // Adiciona o estado à região/vai alimentando
            regioes[regiaoNome].push(`${estado.sigla} - ${estado.nome}`);
        });

        // ordenar alfabeticamente
        Object.keys(regioes).forEach((regiaoNome) => {
            //console.log(`Região: ${regiaoNome}`);
            //console.log("Estados:", regioes[regiaoNome]);
            regioes[regiaoNome].sort();

            // Cria a caixa para a região
            const caixaRegiao = document.createElement('div');
            caixaRegiao.classList.add('caixa-regiao');

            // Cabeçalho da região
            const regiaoHeader = document.createElement('div');
            regiaoHeader.classList.add('regiao-header');

            // vai buscar o nome da regiao e sigla pertencente ao estado 
            const siglaNomeRegiao = estados.find((estado) => estado.regiao.nome === regiaoNome);
            //console.log (siglaNomeRegiao.regiao.nome);
            //console.log (siglaNomeRegiao.regiao.sigla);
            // adiciona ao cabeçalho da caixa região
            regiaoHeader.textContent = `${siglaNomeRegiao.regiao.nome} - ${siglaNomeRegiao.regiao.sigla}`;

            // Corpo da região (onde os estados vão aparecer)
            const regiaoBody = document.createElement('div');
            regiaoBody.classList.add('regiao-body');

            // Cria e adiciona cada estado ao corpo da região
            regioes[regiaoNome].forEach((estado) => {
                const estadoDiv = document.createElement('div');
                estadoDiv.classList.add('estado');
                estadoDiv.textContent = estado;
                regiaoBody.appendChild(estadoDiv);
            });

            // Adiciona o cabeçalho e o corpo à caixa da região
            caixaRegiao.appendChild(regiaoHeader);
            caixaRegiao.appendChild(regiaoBody);

            // Adiciona a caixa da região ao container principal
            container.appendChild(caixaRegiao);
        });

        // Atualiza o número total de slides (regiões)
        totalSlides = container.children.length;
    };

    // Chama a função para gerar os slides do carrossel
    criarCarrossel();

    // Função para atualizar a posição do carrossel
    const updateCarousel = () => {
        const width = container.children[0].getBoundingClientRect().width;  // Obtém a largura de um slide
        container.style.transform = `translateX(-${slideAtual * width}px)`; // Move o carrossel para o slide atual
    };

    // Evento de clique para o botão "próximo"
    proximoSlide.addEventListener('click', () => {
        if (slideAtual < totalSlides - slidesExibidos) {
            slideAtual++;
        } else {
            slideAtual = 0; // Volta ao início
        }
        updateCarousel();
    });

    // Evento de clique para o botão voltar
    voltarSlide.addEventListener('click', () => {
        if (slideAtual > 0) {
            slideAtual--;
        } else {
            slideAtual = totalSlides - slidesExibidos; // Volta ao último conjunto
        }
        updateCarousel();
    });

    // Responsividade: ajusta o número de slides visíveis com base na largura da janela
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            slidesExibidos = 2;
        } else {
            slidesExibidos = 3;
        }
        updateCarousel();
    });
});
