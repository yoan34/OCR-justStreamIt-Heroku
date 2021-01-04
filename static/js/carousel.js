let carousels = document.querySelectorAll('.carousel__wrapper');

let [carousel_movies, carousel_arrows] = [[], []]

for (let i = 0; i < carousels.length; i++) {
    let movies = carousels[i].querySelectorAll('.carousel__items__image');
    let arrows = carousels[i].querySelectorAll('.carousel__btn');
    carousel_arrows.push(arrows);
    carousel_movies.push(movies);
}

const onMoveForward = (movies, i) => {
    let retain = movies.item(0).src;
    let retain_id = movies.item(0).id;
    for (let i = 0; i < movies.length-1; i++) {
        let retain2 = movies.item(i+1).src;
        let retain_id2 = movies.item(i+1).id;
        movies.item(i).src = retain2;
        movies.item(i).id = retain_id2;
    }
    movies.item(movies.length-1).src = retain;
    movies.item(movies.length-1).id = retain_id;
}

const onMoveBackward = (movies, i) => {
    let retain = movies.item(movies.length - 1).src;
    let retain_id = movies.item(movies.length - 1).id;
    for (let i = movies.length-1; i > 0; i--) {
        let retain2 = movies.item(i-1).src;
        let retain_id2 = movies.item(i-1).id;
        movies.item(i).src = retain2;
        movies.item(i).id = retain_id2;
    }
    movies.item(0).src = retain;
    movies.item(0).id = retain_id;
}

for (let i = 0; i < carousel_arrows.length; i++) {
    carousel_arrows[i][0].addEventListener('click', () => onMoveBackward(carousel_movies[i], i));
    carousel_arrows[i][1].addEventListener('click', () => onMoveForward(carousel_movies[i], i));
}