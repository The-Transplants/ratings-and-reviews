/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
const express = require('express');
const { Client } = require('pg');
const { password } = require('../config/config');

const {
  reviewsMeta, reviews, report, reviewPost,
  charsReviewPost, photosPost, charsPost, helpful,
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
  // console.log('Connected!');
});

// Post
app.post('/reviews/', (req, res) => {
  let {
    product_id, rating, summary,
    body, reviewer_email,
    reviewer_name, photos, characteristics,
  } = req.query;

  client.query(reviewPost, [product_id, rating, summary, body, reviewer_name, reviewer_email])
    .then(() => console.log('review posted!'))
    .catch(err => console.log(err));

  JSON.parse(photos).forEach((photo) => {
    client.query(photosPost, [photo])
      .then(() => console.log(`photo posted! url: ${photo}`))
      .catch(err => console.log(err));
  });

  for (let key in JSON.parse(characteristics)) {
    let currentVal = JSON.parse(characteristics)[key];

    client.query(charsPost, [product_id, key])
      .then(() => console.log(`posted chars with key: ${key}`))
      .catch(err => console.log(err));

    client.query(charsReviewPost, [currentVal])
      .then(() => console.log(`charsReview posted with val: ${currentVal}`))
      .catch(err => console.log(err));
  }

  res.send('CREATED');
});

// Get
app.get('/reviews/', (req, res) => {
  client.query(reviews, [req.query.product_id])
    .then(response => {
      res.send(response.rows[0].results);
    })
    .catch(err => console.log(err));
});

app.get('/reviews/meta/', (req, res) => {
  client.query(reviewsMeta, [req.query.product_id])
    .then(response => res.send(response.rows[0].data))
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
