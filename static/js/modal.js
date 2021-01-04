// Récupère tous les éléments nécessaires à faire fonctionner la fenêtre
// modal et d'ajouter des evénements sur ses derniers.
let modal = document.querySelector('.modal');
let images = document.querySelectorAll('.carousel__items__image');
let more_info = document.querySelector('.movie__info__btn__info');
let details = document.querySelector('details');
let actor_landscape = document.querySelector('.modal__body__actors--landscape');


// Fonction qui permet de changer dynamiquement les informations du modal.
// On récupère tous les éléments situé dans le modal et à travers l'objet 'data'
// on formate les données comme souhaiter et on l'intègre à l'élément.
const writeOnModal = data => {
    let title = document.querySelector('.modal__header__title');
    let country = document.querySelector('.modal__body__country');
    let image = document.querySelector('.modal__body__img');
    let info = document.querySelectorAll('.modal__body__info>p');
    let plot = document.querySelector('.modal__body__plot');
    let genre = document.querySelector('.modal__body__genre');
    let directors = document.querySelector('.modal__body__directors');
    let actors = document.querySelector('.modal__body__actors');
    let money = document.querySelector('.modal__body__boxoffice__dollars');
    let title_money = document.querySelector('.modal__body__boxoffice__title');
    let rated = document.querySelector('.modal__body__rated');

    let landscape = window.innerWidth > window.innerHeight ? true : false;
    
    title.textContent = data['original_title']
    image.src = data['image_url']
    country.textContent = data['countries'].join(' - ');

    let [rate, year, time] = [info[0], info[1], info[2]];
    rate.textContent = `${data['imdb_score']}/10`
    year.textContent = data['date_published']
    let time_convert = data['duration']

    let hour = parseInt(time_convert / 60)
    let minute = time_convert - (hour * 60)
    time.textContent = `${hour}h${minute}m`
    
    genre.textContent = data['genres'].join(' - ')
    if (data['description'].slice(0,10) !== 'Add a Plot') {
        plot.textContent = data['description'];
    } else {
        plot.textContent = "Description not available."
    }

    directors.textContent = 'Directors: ' + data['directors'].join(', ');

    if (landscape) {
        details.style.display = 'none';
        actor_landscape.style.display = 'initial';
    } else {
        details.style.display = 'initial';
        actor_landscape.style.display = 'none';
    }
    if (window.innerWidth < 800) {
        actor_landscape.textContent = "Actors: " + data['actors'].slice(0, 7).join(', ') + '...';
    } else {
        actor_landscape.textContent = "Actors: " + data['actors'].join(', ');
    }
    actors.textContent = data['actors'].join(', ');
    
    if (data['worldwide_gross_income'] !== null) {
        title_money.style.display = 'initial';
        money.style.display = 'initial';
        let moneyDots = data['worldwide_gross_income'].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        console.log(moneyDots)
        money.textContent = moneyDots + ' $';
    } else {
        title_money.style.display = 'none';
        money.style.display = 'none';
    }

    if (data['rated'] !== "Not rated or unkown rating") {
        rated.textContent = "Rated: " + data['rated'];
        rated.style.display = 'initial';
    } else {
        rated.style.display = 'none';
    }
    modal.style.display = 'initial';
}

// Fonction qui permet d'ouvrir la fenêtre modal et de lancer une requête avec 'fetch'
// pour récupérer les données nécessaires. On construit l'URL grâce à l'attribut 'id'
// que tous les éléments susceptible d'ouvrir une fenêtre modal possède.
const openModal = (event) => {
    console.log(event.target)
    let url = `http://localhost:8000/api/v1/titles/${event.target.id}`;
    fetch(url)
        .then(response => response.json())
        .then(data => writeOnModal(data))
        .catch(error => console.log(error))
}


// On ajoute un event 'click' sur toutes les images de tous les carousels pour ouvrir
// une fenêtre modal.
for (let i = 0; i < images.length; i++) {
    images[i].addEventListener('click', (e) => openModal(e))
}
more_info.addEventListener('click', (e) => openModal(e))


// On ajoute un event 'resize' à la fenêtre qui change l'aspect de la liste des acteurs si la 
// longueur > largeur et inversement. (Si largeur > longueur, un élément <details>...<details/> est utilisé)
let best_movie_plot = document.querySelector('.movie__info__plot');
let best_movie_title = document.querySelector('.movie__info__title');
window.addEventListener('resize', () => {
    let landscape = window.innerWidth > window.innerHeight ? true : false;
    let actor_landscape = document.querySelector('.modal__body__actors--landscape');

    if (landscape) {
        best_movie_plot.style.display = 'initial';
        best_movie_title.style.display = 'initial';
        details.style.display = 'none';
        actor_landscape.style.display = 'initial';
    } else {
        best_movie_plot.style.display = 'none';
        best_movie_title.style.display = 'none';
        details.style.display = 'initial';
        actor_landscape.style.display = 'none';
    }
});

// Ferme la fenêtre modal si on click à l'exterieur de la modal.
window.onclick = (event) => {
    if (event.target == modal) {
        details.removeAttribute("open");
        modal.style.display = 'none';
    }
}

// Ferme la fenêtre modal si on clic sur la croix en haut à droite de la fenêtre modal.
document.querySelector('.modal__header__close').addEventListener('click', () => {
    details.removeAttribute("open");
    modal.style.display = 'none';
})

