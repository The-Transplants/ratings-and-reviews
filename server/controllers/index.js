exports.reviewsMeta = `
SELECT jsonb_build_object(
  'product_id', product_id,
  'ratings', (SELECT jsonb_object_agg(counted.rating, counted.value) as ratings FROM(SELECT rating, COUNT(rating) as value from reviews WHERE product_id = $1 GROUP BY rating) as counted),
  'recommend', (SELECT jsonb_build_object( 'true', (SELECT COUNT(recommend) FROM reviews WHERE recommend = true and product_id = $1), 'false', (SELECT COUNT(recommend) FROM reviews WHERE recommend = false and product_id = $1))),

  'characteristic', '(SELECT array(SELECT * FROM aggs_char WHERE product_id = $1))'
) FROM reviews WHERE product_id = $1`;

exports.reviews = `
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
  ) as results`;

exports.reviewPost = `INSERT INTO reviews (
  product_id, rating, review_date, summary, body, recommend, reviewer_name, reviewer_email
) VALUES (
  $1, $2, now(), $3, $4, $5, $6, $7
);`;

exports.report = 'UPDATE reviews SET reported = true WHERE id = $1;';

exports.helpful = 'UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1;';
