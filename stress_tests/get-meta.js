/* eslint-disable quotes */
/* eslint-disable func-names */
/* eslint-disable import/no-unresolved */
const http = require('k6/http');
const { sleep } = require('k6');

export const options = {
  vus: 500,
  duration: '10s',
};

export default function () {
  http.get('http://localhost:3000/reviews/meta/?product_id=43215');
  sleep(1);
}
