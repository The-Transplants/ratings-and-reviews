/* eslint-disable quotes */
/* eslint-disable func-names */
/* eslint-disable import/no-unresolved */
const http = require('k6/http');
const { sleep } = require('k6');

export const options = {
  duration: '10s',
  vus: 100,
};

export default function () {
  const payload = {
    product_id: 999999,
    rating: 5,
    summary: "this is a summary",
    body: "this is a body",
    recommend: true,
    reviewer_name: "koop",
    reviewer_email: "koopie@koopmail.com",
    photos: ["photo1.img", "photo2.img", "photo3.img"],
    characteristics: { sickness: 5, swag: 5 },
  };
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post('http://localhost:4000/reviews/', payload, params);
  sleep(1);
}
