let genre = document.querySelector('.movie__info__genre');
let landscape = window.innerWidth > window.innerHeight ? true : false;
if (landscape) {
    document.querySelector('.movie__info__plot').style.display = 'initial';
    document.querySelector('.movie__info__title').style.display = 'initial';
}

let text = JSON.parse(genre.textContent.replaceAll("'", '"'))
genre.textContent = text.join(' - ');
