// Espera o HTML carregar completamente antes de rodar o JS
document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS FICTÍCIOS (MOCK) ---
    // (Este é nosso "banco de dados" falso)

    const mockMovies = [
        {
            id: "duna-2",
            title: "Duna: Parte Dois",
            synopsis: "Paul Atreides se une a Chani e aos Fremen em uma guerra de vingança contra os conspiradores que destruíram sua família.",
            posterUrl: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/8LJJjLjAzAwXS40S5mx79PJ2jSs.jpg"
        },
        {
            id: "oppenheimer",
            title: "Oppenheimer",
            synopsis: "A história do físico americano J. Robert Oppenheimer, seu trabalho no Projeto Manhattan e o desenvolvimento da bomba atômica.",
            posterUrl: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/1OsQJEoSXBjduuCvDOlRhoEUaHu.jpg"
        },
        {
            id: "barbie",
            title: "Barbie",
            synopsis: "Depois de ser expulsa da Barbieland por ser uma boneca de aparência menos do que perfeita, Barbie parte para o mundo humano.",
            posterUrl: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/yRRuLt7sMBEQkHsd1S3KaaofZn7.jpg"
        },
        {
            id: "interestelar",
            title: "Interestelar",
            synopsis: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.",
            posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
        },
        {
            id: "o-poderoso-chefao",
            title: "O Poderoso Chefão",
            synopsis: "O patriarca de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.",
            posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
        }
    ];

    // Nossos "comentários salvos"
    let mockRatings = {
        "duna-2": [
            { score: 5, comment: "Incrível! Obra-prima." },
            { score: 4, comment: "Muito bom, mas o livro é melhor." }
        ],
        "oppenheimer": [
            { score: 5, comment: "Tenso e espetacular." }
        ],
        "barbie": [],
        "interestelar": [
            { score: 5, comment: "Chorei no final." }
        ],
        "o-poderoso-chefao": []
    };


    // --- SELETORES DO DOM (Pegando os elementos do HTML) ---
    const movieGrid = document.getElementById('movie-grid');
    const modal = document.getElementById('modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalPoster = document.getElementById('modal-poster');
    const modalTitle = document.getElementById('modal-title');
    const modalSynopsis = document.getElementById('modal-synopsis');
    const commentsList = document.getElementById('comments-list');
    const ratingForm = document.getElementById('rating-form');
    const allStars = document.querySelectorAll('.stars span');
    const ratingScoreInput = document.getElementById('rating-score');
    const ratingCommentInput = document.getElementById('rating-comment');

    let currentMovieId = null;

    // --- FUNÇÕES ---

    /** 1. Mostra os filmes na tela */
    function displayMovies() {
        movieGrid.innerHTML = ''; 
        mockMovies.forEach(movie => {
            const movieCardHTML = `
                <div class="movie-card" data-movie-id="${movie.id}">
                    <img src="${movie.posterUrl}" alt="Pôster de ${movie.title}">
                    <div class="movie-info">
                        <button class="button-purple rate-button">Avaliar</button>
                    </div>
                </div>
            `;
            movieGrid.innerHTML += movieCardHTML;
        });
        addCardButtonListeners();
    }

    /** 2. Adiciona cliques aos botões "Avaliar" */
    function addCardButtonListeners() {
        const rateButtons = document.querySelectorAll('.rate-button');
        rateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.movie-card');
                const movieId = card.dataset.movieId;
                openModal(movieId);
            });
        });
    }

    /** 3. Abre o Modal com as informações do filme */
    function openModal(movieId) {
        currentMovieId = movieId; 
        const movie = mockMovies.find(m => m.id === movieId);
        if (!movie) return;

        modalTitle.textContent = movie.title;
        modalPoster.src = movie.posterUrl;
        modalSynopsis.textContent = movie.synopsis;

        displayComments(movieId);
        resetRatingForm();
        modal.classList.remove('hidden');
    }

    /** 4. Fecha o Modal */
    function closeModal() {
        modal.classList.add('hidden');
        currentMovieId = null;
    }

    /** 5. Mostra os comentários na lista */
    function displayComments(movieId) {
        commentsList.innerHTML = '';
        const ratings = mockRatings[movieId] || [];

        if (ratings.length === 0) {
            commentsList.innerHTML = '<p>Seja o primeiro a comentar!</p>';
            return;
        }

        ratings.forEach(rating => {
            const commentHTML = `
                <div class="comment-item">
                    <p class="comment-score">${'&#9733;'.repeat(rating.score)}</p>
                    <p>${rating.comment}</p>
                </div>
            `;
            commentsList.innerHTML += commentHTML;
        });
    }
    
    /** 6. Limpa o formulário de avaliação */
    function resetRatingForm() {
        ratingScoreInput.value = "0";
        ratingCommentInput.value = "";
        allStars.forEach(star => star.classList.remove('active'));
    }

    /** 7. Salva a nova avaliação (fictícia) */
    function handleRatingSubmit(event) {
        event.preventDefault(); 
        const score = parseInt(ratingScoreInput.value, 10);
        const comment = ratingCommentInput.value;

        if (score === 0 || comment.trim() === "") {
            alert("Por favor, selecione uma nota e escreva um comentário.");
            return;
        }

        const newRating = { score, comment };
        mockRatings[currentMovieId].push(newRating);
        displayComments(currentMovieId);
        resetRatingForm();
    }
    
    /** 8. Lógica de clique das estrelas */
    allStars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value, 10);
            ratingScoreInput.value = value;
            allStars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < value; i++) {
                allStars[i].classList.add('active');
            }
        });
    });


    // --- INICIALIZAÇÃO E EVENTOS GLOBAIS ---

    displayMovies(); // Mostra os filmes assim que a página carrega
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    ratingForm.addEventListener('submit', handleRatingSubmit);
});