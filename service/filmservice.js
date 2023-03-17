function getFilmAll(req, res, client) {
  query = `SELECT film.id, film.title, film.yearfilm, 
    JSON_AGG(JSON_BUILD_OBJECT('id', genre.id, 'title', genre.title)) AS genre  
    FROM film 
    LEFT JOIN film_genre ON film_genre.film_id=film.id
    LEFT JOIN genre ON film_genre.genre_id=genre.id
    GROUP BY film.id
    ORDER BY film.id DESC`;
  client.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results.rows));
  });
}

function getFilmOne(req, res, client) {
  const id = req.url.split('/')[2];
  const query = `SELECT film.id, film.title, film.yearfilm, 
      JSON_AGG(JSON_BUILD_OBJECT('id', genre.id, 'title', genre.title)) AS genre 
      FROM film 
      LEFT JOIN film_genre ON film_genre.film_id=film.id
      LEFT JOIN genre ON film_genre.genre_id=genre.id
      WHERE film.id = $1
      GROUP BY film.id`;
  client.query(query, [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results.rows));
  });
}

function postFilm(req, res, client) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    const data = JSON.parse(body);

    const queryfilm = 'INSERT INTO film (title, yearfilm) VALUES ($1, $2) RETURNING id';
    const valuesfilm = [data.title, data.yearfilm];
    client.query(queryfilm, valuesfilm, (error, results) => {
      if (error) {
        throw error;
      }
      const filmId = results.rows[0].id;
      for (let i = 0; i < data.genre.length; i++) {
        const queryfilmgenre = 'INSERT INTO film_genre (film_id, genre_id) VALUES ($1, $2)';
        const valuesfilmgenre = [filmId, data.genre[i].id];
        client.query(queryfilmgenre, valuesfilmgenre, (error, results) => {
          if (error) {
            throw error;
          }
        });
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Inserted successfully');
    });
  });
}

function updateFilm(req, res, client) {
  const id = req.url.split('/')[2];
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    const data = JSON.parse(body);

    const queryfilm = 'UPDATE film SET title = $1, yearfilm = $2 WHERE id = $3';
    const valuesfilm = [data.title, data.yearfilm, id];
    client.query(queryfilm, valuesfilm, (error, results) => {
      if (error) {
        throw error;
      }
      const queryfilmgenreDel = 'DELETE FROM film_genre WHERE film_id = $1';
      const valuesfilmgenreDel = [id];
      client.query(queryfilmgenreDel, valuesfilmgenreDel, (error, results) => {
        if (error) {
          throw error;
        }
          
        for (let i = 0; i < data.genre.length; i++){
          const queryfilmgenredIns = 'INSERT INTO film_genre (film_id, genre_id) VALUES ($1, $2)';
          const valuesfilmgenreIns = [id, data.genre[i].id];
          client.query(queryfilmgenredIns, valuesfilmgenreIns, (error, results) => {
            if (error) {
              throw error;
            }
          });
        }
      });  
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Updated successfully');
    });
  });
}

function deleteFilm(req, res, client){
  const id = req.url.split('/')[2];

  const queryfilmgenreDel = 'DELETE FROM film_genre WHERE film_id = $1';
  const valuesfilmgenreDel = [id];
  client.query(queryfilmgenreDel, valuesfilmgenreDel, (error, results) => {
    if (error) {
      throw error;
    }
    const queryfilmDel = 'DELETE FROM film WHERE id = $1';
    const valuesfilmDel = [id];
    client.query(queryfilmDel, valuesfilmDel, (error, results) => {
      if (error) {
        throw error;
      }
    });
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Deleted successfully');
  });
}

module.exports = { getFilmAll, getFilmOne, postFilm, updateFilm, deleteFilm }