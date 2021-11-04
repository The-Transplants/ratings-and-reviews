CREATE DATABASE postgres;

\c postgres;

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

CREATE TABLE IF NOT EXISTS photos(
  id SERIAL PRIMARY KEY,
  review_id int not null,
  photo_url VARCHAR(255) not null
);

CREATE TABLE IF NOT EXISTS characteristics(
  id SERIAL PRIMARY KEY,
  product_id int not null,
  name varchar(50) not null
);

CREATE TABLE IF NOT EXISTS characteristic_reviews(
  id SERIAL PRIMARY KEY,
  characteristics_id int not null,
  review_id int not null,
  value int not null
);

-- \COPY characteristic_reviews FROM '__DEN14/__SDC/Ratings-and-Reviews/reviews/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
-- \COPY photos FROM '__DEN14/__SDC/Ratings-and-Reviews/reviews/reviews_photos.csv' DELIMITER ',' CSV HEADER;
-- \COPY characteristics FROM '__DEN14/__SDC/Ratings-and-Reviews/reviews/characteristics.csv' DELIMITER ',' CSV HEADER;
-- \COPY reviews FROM '__DEN14/__SDC/Ratings-and-Reviews/reviews/reviews.csv' DELIMITER ',' CSV HEADER;

CREATE INDEX IF NOT EXISTS id ON reviews (id);
CREATE INDEX IF NOT EXISTS photos_id_index ON photos (id);
CREATE INDEX IF NOT EXISTS characteristics_id_index ON characteristic_reviews (characteristics_id);
CREATE INDEX IF NOT EXISTS product_id_index ON reviews (product_id);
CREATE INDEX IF NOT EXISTS recommend_index ON reviews (recommend);
CREATE INDEX IF NOT EXISTS rating_index ON reviews (rating);

SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews)+1);
SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos)+1);
SELECT setval('characteristics_id_seq', (SELECT MAX(id) FROM characteristics));
SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) FROM characteristic_reviews)+1);

-- CREATE TABLE IF NOT EXISTS aggs_char AS SELECT
-- char.name, char.id, avg(char_review.value) AS value, product_id FROM characteristics AS char INNER JOIN
-- characteristic_reviews AS char_review ON char.id = char_review.characteristics_id GROUP BY char.id;
-- Alters reviews by converting epoch time (13 digit int) into timestamp
-- ALTER TABLE reviews
--   ALTER COLUMN review_date
--     TYPE TIMESTAMP USING
--       to_timestamp(review_date / 1000) + ((review_date % 1000) || ' milliseconds')
--         :: INTERVAL;