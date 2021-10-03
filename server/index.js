const express = require('express');
const { Client } = require('pg');
const { password } = require('../config/config');

// const { report } = require('./controllers/report');
// const { reviews } = require('./controllers/reviews-get');
// const { helpful } = require('./controllers/helpful');
// const { reviewPost } = require('./controllers/reviews-post');
const {
  reviewsMeta, reviews, report, reviewPost, helpful,
} = require('./controllers');

const app = express();
app.set('port', process.env.PORT || 4000);

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password,
  port: 5432,
});

client.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

// Post
app.post('/reviews/', (req, res) => {
  let {
    product_id, rating, summary, body, recommend, email, name, photos, characteristics,
  } = req.query;

  recommend === 'true' ? recommend = !!recommend : recommend = !recommend;

  client.query(reviewPost, [product_id, rating, summary, body, recommend, name, email])
    .then(response => {
      console.log(response);
      res.send(response);
    })
    .catch(err => console.log(err));
});

// Get
app.get('/reviews/', (req, res) => {
  client.query(reviews, [req.query.product_id])
    .then(response => res.send(response.rows[0].results))
    .catch(err => console.log(err));
});
app.get('/reviews/meta/:product_id', (req, res) => {
  client.query(reviewsMeta, [req.params.product_id])
    .then(response => res.send(response.rows))
    .catch(err => console.log(err));
});

// Put
app.put('/reviews/:review_id/report', (req, res) => {
  client.query(report, [req.params.review_id])
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err));
});
app.put('/reviews/:review_id/helpfulness', (req, res) => {
  client.query(helpful, [req.params.review_id])
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err));
});

app.listen(4000, () => console.log('Server is running on Port 4000'));

module.exports = client;
