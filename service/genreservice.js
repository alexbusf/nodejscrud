function getGenreAll(req, res, client) {
    const query = 'SELECT * FROM genre ORDER BY genre.id DESC';
    client.query(query, (error, results) => {
        if (error) {
          throw error;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results.rows));
    });
}


function getGenreOne(req, res, client) {
  const id = req.url.split('/')[2];
  const query = 'SELECT * FROM genre WHERE id = $1';
  const values = [id];
  client.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results.rows));
  });
}

function postGenre(req, res, client) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    const data = JSON.parse(body);
    query = 'INSERT INTO genre (title) VALUES ($1)';
    const values = [data.title];
    client.query(query, values, (error, results) => {
      if (error) {
        throw error;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Inserted successfully');
    });
  });
}

function updateGenre(req, res, client) {
  const id = req.url.split('/')[2];
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    const data = JSON.parse(body);
    query = 'UPDATE genre SET title = $1 WHERE id = $2';
    const values = [data.title, id];
    client.query(query, values, (error, results) => {
      if (error) {
        throw error;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Updated successfully');
    });
  });
}

function deleteGenre(req, res, client) {
  const id = req.url.split('/')[2];

  query = 'DELETE FROM genre WHERE id = $1';
  const values = [id];
  client.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Deleted successfully');
  });
}

module.exports = { getGenreAll, getGenreOne, postGenre, updateGenre, deleteGenre }