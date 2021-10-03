const express = require('express');
const connectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
const { password } = require('../config/config.js');

const { Client } = require('pg');
const { report } = require('../database/models/report');
const { reviews } = require('../database/models/reviews-get');
const { helpful } = require('../database/models/helpful');
const { reviewPost } = require('../database/models/reviews-post');
const { reviewsMeta } = require('../database/models/reviews-meta');

var app = express();
app.set('port', process.env.PORT || 4000);

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: password,
  port: 5432,
})

client.connect(err => {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/reviews/', reviews);
app.post('/reviews/', reviewPost);
app.put('/reviews/:review_id/report', report);
app.get('/reviews/meta/:product_id', reviewsMeta);
app.put('/reviews/:review_id/helpfulness', helpful);

// GET REVIEWS
// app.get('/reviews/', reviews);
// app.get('/reviews/', (req, res) => {
//   console.log(req.query.product_id)
//   var query = `
//   SELECT array(
//     SELECT jsonb_build_object(
//       'product_id', product_id,
//       'rating', rating,
//       'summary', summary,
//       'recommend', recommend,
//       'body', body,
//       'date', review_date,
//       'reviewer_name', reviewer_name,
//       'helpfulness', helpfulness,
//       'photos', (SELECT array(
//         (SELECT jsonb_build_object(
//           'id', id,
//           'url', photo_url
//         ) FROM photos WHERE review_id = $1 ))
//       )
//     ) FROM reviews WHERE product_id = $1
//   ) as results`
//   client.query(query, [req.query.product_id])
//   .then(response => res.send(response.rows[0].results))
//   .catch(err => console.log(err))
// });


// GET REVIEWS META
// app.get('/reviews/meta/:product_id', reviewsMeta);

// app.get('/reviews/meta/:product_id', function (req, res) {
//   var query = `
//   SELECT jsonb_build_object(
//     'product_id', product_id,
//     'ratings', (SELECT jsonb_object_agg(counted.rating, counted.value) as ratings FROM(SELECT rating, COUNT(rating) as value from reviews WHERE product_id = $1 GROUP BY rating) as counted),
//     'recommend', (SELECT jsonb_build_object( 'true', (SELECT COUNT(recommend) FROM reviews WHERE recommend = true and product_id = $1), 'false', (SELECT COUNT(recommend) FROM reviews WHERE recommend = false and product_id = $1))),

//     'characteristic', '(SELECT array(SELECT * FROM aggs_char WHERE product_id = $1))'

//   ) FROM reviews WHERE product_id = $1`;
//   client.query(query, [req.params.product_id])
//     .then(response => res.send(response.rows))
//     .catch(err => console.log(err))
// });

// POST REVIEWS
// app.post('/reviews/', reviewPost);
// app.post('/reviews/', function (req, res) {
//   var { product_id, rating, summary, body, recommend, email, name, photos, characteristics } = req.query;

//   recommend === 'true' ? recommend = !!recommend : recommend = !recommend;

//   // var params = [ parseInt(product_id), rating, summary, body, recommend, name, email, JSON.parse(photos), JSON.parse(characteristics), ]

//   client.query(`
//     INSERT INTO reviews (
//       product_id, rating, review_date, summary, body, recommend, reviewer_name, reviewer_email
//     ) VALUES (
//       $1, $2, now(), $3, $4, $5, $6, $7
//     );
//   `, [product_id, rating, summary, body, recommend, name, email])
//     .then(response => {
//       console.log(response)
//       res.send(response)
//     })
//     .catch(err => console.log(err))
// });
//ALTER SEQUENCE reviews_id_seq restart with (SELECT max(id + 1) FROM reviews);

// SELECT max(id) FROM reviews



// PUT HELPFUL
// app.put('/reviews/:review_id/helpfulness', helpful);
// app.put('/reviews/:review_id/helpfulness', function (req, res) {
//   const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${req.params.review_id};`;
//   client.query(query)
//     .then(response => res.sendStatus(200))
//     .catch(err => console.log(err))
// });

// PUT REPORT
// app.put('/reviews/:review_id/report', report);
// app.put('/reviews/:review_id/report', function (req, res) {
//   const query = `UPDATE reviews SET reported = true WHERE id = ${req.params.review_id};`;
//   client.query(query)
//     .then(response => res.sendStatus(200))
//     .catch(err => console.log(err))
// });

app.listen(4000, () => console.log('Server is running on Port 4000'));

module.exports = client;