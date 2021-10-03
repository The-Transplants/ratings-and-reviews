const { client } = require('../../../server/');

exports.reviewPost = (req, res) => {
  var { product_id, rating, summary, body, recommend, email, name, photos, characteristics } = req.query;

  recommend === 'true'
    ? recommend = !!recommend
    : recommend = !recommend;

  // var params = [ parseInt(product_id), rating, summary, body, recommend, name, email, JSON.parse(photos), JSON.parse(characteristics), ]

  client.query(`
    INSERT INTO reviews (
      product_id, rating, review_date, summary, body, recommend, reviewer_name, reviewer_email
    ) VALUES (
      $1, $2, now(), $3, $4, $5, $6, $7
    );
  `, [product_id, rating, summary, body, recommend, name, email])
    .then(response => {
      console.log(response)
      res.send(response)
    })
    .catch(err => console.log(err))
};