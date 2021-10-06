

CREATE SCHEMA IF NOT EXISTS public;

SET max_parallel_workers_per_gather TO 8;

CREATE TABLE IF NOT EXISTS reviews(
  id SERIAL PRIMARY KEY,
  product_id int not null,
  rating int not null,
  review_date bigint not null,
  summary varchar(255) not null,
  body varchar(500) not null,
  recommend boolean DEFAULT FALSE,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name varchar(100) not null,
  reviewer_email varchar(50) not null,
  response varchar(255) DEFAULT null,
  helpfulness int DEFAULT 0
);


-- Parallel Seq Scan on reviews reviews_1
-- Parallel Seq Scan on reviews reviews_2
-- Parallel Seq Scan on reviews reviews_3
-- Parallel Seq Scan on characteristics
-- Parallel Seq Scan on characteristic_reviews
-- Parallel Seq Scan on reviews

-- CREATE INDEX IF NOT EXISTS id_index ON characteristics (id);

CREATE INDEX IF NOT EXISTS id_index ON reviews (id);
CREATE INDEX IF NOT EXISTS photos_id_index ON photos (id);
CREATE INDEX IF NOT EXISTS characteristics_id_index ON characteristic_reviews (characteristics_id);
CREATE INDEX IF NOT EXISTS product_id_index ON reviews (product_id);
CREATE INDEX IF NOT EXISTS recommend_index ON reviews (recommend);
CREATE INDEX IF NOT EXISTS rating_index ON reviews (rating);

SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews)+1);

-- Alters reviews by converting epoch time (13 digit int) into timestamp

-- ALTER TABLE reviews
--   ALTER COLUMN review_date
--     TYPE TIMESTAMP USING
--       to_timestamp(review_date / 1000) + ((review_date % 1000) || ' milliseconds')
--         :: INTERVAL;


CREATE TABLE IF NOT EXISTS photos(
  id SERIAL PRIMARY KEY,
  review_id int not null,
  photo_url VARCHAR(255) not null
);

SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos)+1);

CREATE TABLE IF NOT EXISTS characteristics(
  id SERIAL PRIMARY KEY,
  product_id int not null,
  name varchar(50) not null
);
SELECT setval('characteristics_id_seq', (SELECT MAX(id) FROM characteristics));

CREATE TABLE IF NOT EXISTS characteristic_reviews(
  id SERIAL PRIMARY KEY,
  characteristics_id int not null,
  review_id int not null,
  value int not null
);

SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) FROM characteristic_reviews)+1);

CREATE TABLE IF NOT EXISTS aggs_char AS SELECT
char.name, char.id, avg(char_review.value) AS value, product_id FROM characteristics AS char INNER JOIN
characteristic_reviews AS char_review ON char.id = char_review.characteristics_id GROUP BY char.id;

-- \COPY characteristic_reviews FROM '/Users/randystanford/__SDC/reviews/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
-- \COPY photos FROM '/Users/randystanford/__SDC/reviews/reviews_photos.csv' DELIMITER ',' CSV HEADER;
-- \COPY characteristics FROM '/Users/randystanford/__SDC/reviews/characteristics.csv' DELIMITER ',' CSV HEADER;
-- \COPY reviews FROM '/Users/randystanford/__SDC/reviews/reviews.csv' DELIMITER ',' CSV HEADER;


/*
SELECT json_build_object(char.name, json_build_object('id', char.id, 'value', avg(char_review.value))) FROM characteristics as char INNER JOIN characteristic_reviews AS char_review ON char.id = char_review.characteristics_id WHERE char.product_id = 5 GROUP BY char.id;


SELECT json_build_object(
  characteristics.name, json_build_object(
    'id', characteristics.id,
    'value', avg(char_review.value)
  )
)
FROM characteristics
INNER JOIN characteristic_reviews
ON characteristic_reviews.id = characteristic_reviews.characteristics_id
WHERE characteristics.product_id = 5
GROUP BY characteristics.id;




*/

CREATE FUNCTION json_merge(data json, merge_data json) RETURNS json LANGUAGE sql IMMUTABLE
AS $$
  SELECT json_object_agg(key, value)
  FROM (
    WITH to_merge AS (
      SELECT * FROM json_each(merge_data)
    )
    SELECT *
    FROM json_each(data)
    WHERE key NOT IN (SELECT key FROM to_merge)
    UNION ALL
    SELECT * FROM to_merge
  ) t;
$$;

CREATE AGGREGATE json_collect(json) (
  SFUNC = json_merge,
  STYPE = json,
  INITCOND = '{}'
);