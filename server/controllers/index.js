/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'fish',
  port: 5432,
});

const {
  reviewsMeta, reviews, report, reviewPost,
  charsReviewPost, photosPost, charsPost, helpful,
} = require('./queries');

exports.postReview = (req, res) => {
  console.log('sss');
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
};

exports.getReview = (req, res) => {
  pool.query(reviews, [req.query.product_id])
    .then(response => {
      res.send(response.rows[0]);
    })
    .catch(err => console.log(err));
};

exports.getMetaReview = (req, res) => {
  pool.query(reviewsMeta, [req.query.product_id])
    .then(response => res.send(response.rows[0].data))
    .catch(err => console.log(err));
};

exports.reportReview = (req, res) => {
  pool.query(report, [req.params.review_id])
    .then(() => res.send(200))
    .catch(err => console.log(err));
};

exports.helpfulReview = (req, res) => {
  pool.query(helpful, [req.params.review_id])
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err));
};
