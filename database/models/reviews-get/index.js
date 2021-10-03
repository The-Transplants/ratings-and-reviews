const { client } = require('../../../server/');

exports.reviews = (req, res) => {
  console.log(req.query.product_id)
  var query = `
  SELECT array(
    SELECT jsonb_build_object(
      'product_id', product_id,
      'rating', rating,
      'summary', summary,
      'recommend', recommend,
      'body', body,
      'date', review_date,
      'reviewer_name', reviewer_name,
      'helpfulness', helpfulness,
      'photos', (SELECT array(
        (SELECT jsonb_build_object(
          'id', id,
          'url', photo_url
        ) FROM photos WHERE review_id = $1 ))
      )
    ) FROM reviews WHERE product_id = $1
  ) as results`
  client.query(query, [req.query.product_id])
  .then(response => res.send(response.rows[0].results))
  .catch(err => console.log(err))
};