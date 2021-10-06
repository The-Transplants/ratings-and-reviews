/* eslint-disable max-len */
// POST REVIEWS
exports.reviewPost = `
INSERT INTO reviews (
  product_id, rating, review_date, summary, body,
  recommend, reported, reviewer_name, reviewer_email
) VALUES (
  $1, $2, now(), $3, $4, false, false, $5, $6
);
`;

exports.photosPost = `
INSERT INTO photos (
  review_id, photo_url
) VALUES (
  (SELECT MAX(id) FROM reviews), $1
)`;

exports.charsPost = `
INSERT INTO characteristics (
  product_id, name
) VALUES (
  $1, $2
)`;

exports.charsReviewPost = `
INSERT INTO characteristic_reviews (
  id, review_id, value, characteristics_id
) VALUES (
  (SELECT MAX(id) FROM characteristic_reviews) + 1,
  (SELECT MAX(id) FROM reviews),
  $1,
  (SELECT MAX(id) FROM characteristics)
)`;

// PUT REPORT
exports.report = 'UPDATE reviews SET reported = true WHERE id = $1;';

// PUT HELPFUL
exports.helpful = 'UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1;';

// GET REVIEWS META
exports.reviewsMeta = `
SELECT jsonb_build_object(
  'product_id', product_id,
  'ratings', (SELECT jsonb_object_agg(counted.rating, counted.value) as ratings FROM (SELECT rating, COUNT(rating) as value FROM reviews WHERE product_id = $1 GROUP BY rating) as counted),
  'recommend', (
    SELECT jsonb_build_object(
      'true', (SELECT COUNT(recommend) FROM reviews WHERE recommend = true and product_id = $1),
      'false', (SELECT COUNT(recommend) FROM reviews WHERE recommend = false and product_id = $1)
    )
  ),


  'characteristics', ( SELECT array(
    SELECT jsonb_build_object(
      characteristics.name, json_build_object(
        'id', characteristics.id,
        'value', avg(characteristic_reviews.value)
      )
    )
    as characteristics
    FROM characteristics
    INNER JOIN characteristic_reviews
    ON characteristic_reviews.id = characteristic_reviews.characteristics_id
    WHERE characteristics.product_id = 5
    GROUP BY characteristics.id
  ) )


) as data FROM reviews WHERE product_id = $1`;

// GET REVIEWS
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
      'photos', (
        SELECT array(
          SELECT jsonb_build_object(
            'id', id,
            'url', photo_url
            ) FROM photos WHERE review_id = $1
        )
      )
    ) FROM reviews WHERE product_id = $1
  ) as results`;
