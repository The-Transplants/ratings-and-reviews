/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
const express = require('express');
const { Pool } = require('pg');
// const { password } = require('../config/config');
const port = 1234;

const {
  reviewsMeta, reviews, report, reviewPost,
  charsReviewPost, photosPost, charsPost, helpful,
} = require('./controllers');

const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'sdc-postgres', // EC2 PUBLIC DNS PORT
  database: 'fishdb',
  password: 'fish',
  port: 5432,
});

// app.get('/', async (res, req) => {
//   const { rows } = await pool.query('');
// });

// Post
app.post('/reviews/', (req, res) => {
  let {
    product_id, rating, summary,
    body, reviewer_email,
    reviewer_name, photos, characteristics,
  } = req.query;

  pool.query(reviewPost, [product_id, rating, summary, body, reviewer_name, reviewer_email])
    .then(() => console.log('review posted!'))
    .catch(err => console.log(err));

  JSON.parse(photos).forEach((photo) => {
    pool.query(photosPost, [photo])
      .then(() => console.log(`photo posted! url: ${photo}`))
      .catch(err => console.log(err));
  });

  for (let key in JSON.parse(characteristics)) {
    let currentVal = JSON.parse(characteristics)[key];

    pool.query(charsPost, [product_id, key])
      .then(() => console.log(`posted chars with key: ${key}`))
      .catch(err => console.log(err));

    pool.query(charsReviewPost, [currentVal])
      .then(() => console.log(`charsReview posted with val: ${currentVal}`))
      .catch(err => console.log(err));
  }

  res.send('CREATED');
});

// Get
app.get('/reviews/', (req, res) => {
  pool.query(reviews, [req.query.product_id])
    .then(response => res.send(response.rows[0]))
    .catch(err => console.log(err));
});

app.get('/reviews/meta/', (req, res) => {
  pool.query(reviewsMeta, [req.query.product_id])
    .then(response => res.send(response.rows[0].data))
    .catch(err => console.log(err));
});

// Put
app.put('/reviews/:review_id/report', (req, res) => {
  pool.query(report, [req.params.review_id])
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err));
});
app.put('/reviews/:review_id/helpfulness', (req, res) => {
  pool.query(helpful, [req.params.review_id])
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err));
});

// app.listen(port, () => console.log(`Server is running on Port ${port}`));
app.listen(port);

module.exports = pool;
