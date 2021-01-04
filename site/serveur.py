#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template
from data import movie, categories
from requestsAPI import load_categories, load_best_movie
app = Flask(__name__)


@app.route("/")
def index():
    movie = load_best_movie()
    categories = load_categories(movie['id'])
    return render_template("home.html", categories=categories, movie=movie)

@app.route("/categories")
def _categories():
    return render_template("categories.html")

if __name__ == "__main__":
    app.run(debug=True)
