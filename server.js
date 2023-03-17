require('dotenv').config();
const http = require('http');
const { Pool } = require('pg');
const configdb = require('./configdb');
const { getGenreAll, getGenreOne, postGenre, updateGenre, deleteGenre } = require('./service/genreservice');
const { getFilmAll, getFilmOne, postFilm, updateFilm, deleteFilm } = require('./service/filmservice');

const PORT = process.env.PORT || 8080;

const pool = new Pool(configdb);
pool.connect()
.then(() => {
  console.log('Connected to the database!');
})
.catch(error => {
  console.error('Error connecting to the database:', error);
});


const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/genre') {

    getGenreAll(req, res, pool);

  } else if (req.method === 'GET' && req.url.startsWith('/genre/')) {

    getGenreOne(req, res, pool);

  } else if (req.method === 'POST' && req.url === '/genre') {

    postGenre(req, res, pool);

  } else if (req.method === 'PUT' && req.url.startsWith('/genre/')) {

    updateGenre(req, res, pool);

  } else if (req.method === 'DELETE' && req.url.startsWith('/genre/')) {

    deleteGenre(req, res, pool);

  } else if (req.method === 'GET' && req.url === '/film') {

    getFilmAll(req, res, pool);

  } else if (req.method === 'GET' && req.url.startsWith('/film/')) {

    getFilmOne(req, res, pool);

  } else if (req.method === 'POST' && req.url === '/film') {

    postFilm(req, res, pool);

  } else if (req.method === 'PUT' && req.url.startsWith('/film/')) {

    updateFilm(req, res, pool);

  } else if (req.method === 'DELETE' && req.url.startsWith('/film/')) {

    deleteFilm(req, res, pool);

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not found');
  }
});

server.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));