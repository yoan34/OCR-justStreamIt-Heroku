#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from concurrent.futures import ThreadPoolExecutor, wait

CATEGORIES = ('best movies', 'action', 'comedy', 'horror')

URL_SEARCH_ID = "http://localhost:8000/api/v1/titles/{}"
URL_MOVIE = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
URL_CATEGORY = "http://localhost:8000/api/v1/titles/?min_year=2000&genre={}&sort_by=-imdb_score&page={}"
URL_BEST_MOVIES = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page={}"


def load_url(url):
    '''Retourne les données de la requête sur l'API '''
    response = requests.get(url, stream=True)
    return response.json()

def get_urls():
    '''Récupère toutes les URLs lié au catégories choisi'''
    urls = []
    for category in CATEGORIES:
        if category != 'best movies':
            [urls.append(URL_CATEGORY.format(category, i+1)) for i in range(2)]
        else:
            [urls.append(URL_BEST_MOVIES.format(i+1)) for i in range(2)]
    return urls
            
def load_categories(id):
    '''
    Charge les données de l'API en utilisant le multithreading pour obtenir
    plus vite les informations.
    '''
    futures = []
    data = {category: [] for category in CATEGORIES}

    # On charge simultanement les données en stockant leur etat dans "futures"
    with ThreadPoolExecutor() as executor:
        for url in get_urls():
            try:
                futures.append(executor.submit(load_url, url))
            except Exception:
                print("error appear with url: {}".format(url))

    best_movie_in = False
    for i, future in enumerate(futures):
        category = CATEGORIES[i//2]
        movies = []

        # On récupère le résultats de notre requête stocké dans la "future" qui a
        # terminé son chargement et on récupère l'ID et l'image du film.
        result = future.result()
        for r in result['results'] if i % 2 == 0 else result['results'][:(3 if best_movie_in else 2)]:
            if r['id'] != id:
                if len(movies) < 7:
                    movies.append((r['id'], r['image_url']))
            else:
                best_movie_in = True

        print("nombre movies: {}".format(len(movies)))
        data[category] += movies[:]

        best_movie_in = False if (i % 2 == 1) else best_movie_in

    return data

def load_best_movie():
    '''Charge les données de l'API pour trouver le meilleur film.'''
    response = requests.get(URL_MOVIE)
    if response.ok:
        response = response.json()
        id, score, vote = -1, 0, -1
        for movie in response['results'][:4]:
            if float(movie['imdb_score']) > score:
                id, score, vote = movie['id'], float(movie['imdb_score']), movie['votes']
            elif float(movie['imdb_score']) == score:
                if movie['votes'] > vote:
                    id, score, vote = movie['id'], float(movie['imdb_score']), movie['votes']
    else:
        print('Error on load the best movie.')
    
    response = requests.get(URL_SEARCH_ID.format(id))
    if response.ok:
        response = response.json()
        return {
            'id': response['id'],
            'img': response['image_url'],
            'genres': response['genres'],
            'plot': response['long_description'],
            'title': response['original_title'],
        }
    else:
        print('Error on load the best movie.')




