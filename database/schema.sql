CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS reviews(
  id int not null PRIMARY KEY,
  product_id int not null,
  rating int not null,
  review_date bigint not null,
  summary varchar(255) not null,
  body varchar(500) not null,
  recommend boolean not null,
  reported boolean not null,
  reviewer_name varchar(100) not null,
  reviewer_email varchar(50) not null,
  response varchar(255) null,
  helpfulness int not null
);

CREATE TABLE IF NOT EXISTS photos(
  id int not null PRIMARY KEY,
  review_id int not null,
  photo_url VARCHAR(255) not null
);

CREATE TABLE IF NOT EXISTS characteristics(
  id int not null PRIMARY KEY,
  product_id int not null,
  name varchar(50) not null
);

CREATE TABLE IF NOT EXISTS characteristic_reviews(
  id int not null PRIMARY KEY,
  characteristics_id int not null,
  review_id int not null,
  value int not null
);

-- COPY characteristic_reviews FROM '/Users/randystanford/__SDC/reviews/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
-- COPY photos FROM '/Users/randystanford/__SDC/reviews/reviews_photos.csv' DELIMITER ',' CSV HEADER;
-- COPY characteristics FROM '/Users/randystanford/__SDC/reviews/characteristics.csv' DELIMITER ',' CSV HEADER;
-- COPY reviews FROM '/Users/randystanford/__SDC/reviews/reviews.csv' DELIMITER ',' CSV HEADER;