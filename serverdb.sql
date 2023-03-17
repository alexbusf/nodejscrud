CREATE TABLE genre
(
    id serial PRIMARY KEY,
    title varchar(50) NOT NULL
);

CREATE TABLE film
(
    id serial PRIMARY KEY,
    title varchar(50) NOT NULL,
    yearfilm numeric(4) NOT NULL
);

CREATE TABLE film_genre
(
    film_id integer REFERENCES film(id) NOT NULL,
    genre_id integer REFERENCES genre(id) NOT NULL,
    CONSTRAINT film_genre_id PRIMARY KEY (film_id, genre_id)
);