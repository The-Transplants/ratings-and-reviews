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

app.listen(4000, () => console.log('Server is running on Port 4000'));

module.exports = client;