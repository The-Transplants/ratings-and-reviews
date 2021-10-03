const { client } = require('../../../server/');

exports.reviewsMeta = (req, res) => {
  var query = `
  SELECT jsonb_build_object(
    'product_id', product_id,
    'ratings', (SELECT jsonb_object_agg(counted.rating, counted.value) as ratings FROM(SELECT rating, COUNT(rating) as value from reviews WHERE product_id = $1 GROUP BY rating) as counted),
    'recommend', (SELECT jsonb_build_object( 'true', (SELECT COUNT(recommend) FROM reviews WHERE recommend = true and product_id = $1), 'false', (SELECT COUNT(recommend) FROM reviews WHERE recommend = false and product_id = $1))),

    'characteristic', '(SELECT array(SELECT * FROM aggs_char WHERE product_id = $1))'
  ) FROM reviews WHERE product_id = $1`;


  client.query(query, [req.params.product_id])
    .then(response => res.send(response.rows))
    .catch(err => console.log(err))
};