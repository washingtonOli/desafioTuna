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

    // Esse método é auto executável. Ele roda sozinho sem ninguém chamar.
    // seria o mesmo que declarar o método com um nome e chama-lo logo depois de sua declaração
    (() => {
        const regioes = [];

        estados.forEach((estado) => {
            // Verifica se ja tem um objeto Região com esse nome. Se não tem, adiciona no array
            if (!regioes.find(r => r.nome == estado.regiao.nome)) {
                regioes.push({
                    nome: estado.regiao.nome,
                    sigla: estado.regiao.sigla
                });
            }

            //busca o objeto região que ja esta na lista
            const regiao = regioes.find(r => r.nome == estado.regiao.nome);

            //testa se ja tem o array de estados em cada região, se não tem, cria
            if (!regiao.estados)
                regiao.estados = [];

            // adiciona o estado no objeto região que esta no array regioes
            regiao.estados.push(estado);
        });

        // ordena as regiões alfabeticamente
        regioes.sort((r1, r2) => {
            if (r1.nome < r2.nome) return -1;
            if (r1.nome > r2.nome) return 1;
            return 0;
        })

        regioes.forEach((regiao) => {

            // ordena alfabeticamente os estados de cada região
            regiao.estados.sort((e1, e2) => {
                if (e1.nome < e2.nome) return -1;
                if (e1.nome > e2.nome) return 1;
                return 0;
            })

            const caixaRegiao = document.createElement('div');
            caixaRegiao.classList.add('caixa-regiao');

            const regiaoHeader = document.createElement('div');
            regiaoHeader.classList.add('regiao-header');

            regiaoHeader.textContent = `${regiao.nome} - ${regiao.sigla}`;

            const regiaoBody = document.createElement('div');
            regiaoBody.classList.add('regiao-body');

            regiao.estados.forEach((estado) => {
                const estadoDiv = document.createElement('div');
                estadoDiv.classList.add('estado');
                estadoDiv.textContent = estado.nome;
                regiaoBody.appendChild(estadoDiv);
            });

            caixaRegiao.appendChild(regiaoHeader);
            caixaRegiao.appendChild(regiaoBody);
            container.appendChild(caixaRegiao);
        });

        totalSlides = container.children.length;
    })();

});
