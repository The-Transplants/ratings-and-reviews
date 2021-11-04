// const { password } = require('../config/config');
// const { Pool } = require('pg');
const express = require('express');

const port = 3000;
const app = express();

const {
  postReview, getReview, reportReview, helpfulReview, getMetaReview,
} = require('./controllers/controls');

// Post
app.post('/reviews/', postReview);

// Get
app.get('/reviews/', getReview);
app.get('/reviews/meta/', getMetaReview);

// Put
app.put('/reviews/:review_id(\\d+)/report', reportReview);
app.put('/reviews/:review_id/helpfulness', helpfulReview);

app.listen(port, () => console.log(`Server is running on Port ${port}`));
